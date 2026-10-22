#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { validateStablePluginNpmBootstrapApproval } from "./plugin-npm-bootstrap-approval.mjs";

const releasePublishRunId = process.env.RELEASE_PUBLISH_RUN_ID ?? "";
const expectedBranch = process.env.EXPECTED_WORKFLOW_BRANCH ?? "";
const directRecovery = process.env.DIRECT_RELEASE_RECOVERY === "true";
const allowCompletedSuccessfulParent = process.env.ALLOW_COMPLETED_SUCCESSFUL_PARENT === "true";
const approvalPath = process.env.APPROVAL_PATH ?? "";
const approvalKind = process.env.RELEASE_APPROVAL_KIND ?? "parent";
const expectedRunAttempt = process.env.EXPECTED_RUN_ATTEMPT ?? "";
const expectedWorkflowFullRef = process.env.EXPECTED_WORKFLOW_FULL_REF ?? "";
const expectedWorkflowSha = process.env.EXPECTED_WORKFLOW_SHA ?? "";
const childWorkflowSha = process.env.CHILD_WORKFLOW_SHA ?? "";
const run = approvalPath ? null : JSON.parse(fs.readFileSync(0, "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

function canonicalPackages(value) {
  const packages = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (
    packages.length === 0 ||
    new Set(packages).size !== packages.length ||
    packages.some((entry) => !/^@openclaw\/[a-z0-9][a-z0-9._-]*$/u.test(entry))
  ) {
    fail("ClawHub bootstrap approval requires a unique @openclaw/* package set.");
  }
  return packages.toSorted((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function positiveRunAttempt(value) {
  if (!/^[1-9][0-9]*$/u.test(value)) {
    fail("Expected release publish run attempt must be a positive integer.");
  }
  return Number(value);
}

function resolveRemoteReleaseTag(tag) {
  // Release tags may be signed annotated tags; prefer their peeled commit.
  const ref = `refs/tags/${tag}`;
  const refs = execFileSync("git", ["ls-remote", "--tags", "origin", ref, `${ref}^{}`], {
    encoding: "utf8",
    timeout: 60_000,
    maxBuffer: 1024 * 1024,
  })
    .trim()
    .split("\n")
    .map((line) => line.split(/\s+/u));
  return (
    refs.find(([, name]) => name === `${ref}^{}`)?.[0] ?? refs.find(([, name]) => name === ref)?.[0]
  );
}

if (["clawhub-bootstrap", "npm-stable-bootstrap"].includes(approvalKind) && !approvalPath) {
  fail(
    `${approvalKind === "clawhub-bootstrap" ? "ClawHub" : "Stable npm"} bootstrap approval requires an attested approval artifact.`,
  );
}

if (approvalPath) {
  const approval = JSON.parse(fs.readFileSync(approvalPath, "utf8"));
  let expectedApproval;
  let mismatchMessage;
  if (approvalKind === "clawhub-bootstrap") {
    if (!/^[a-f0-9]{40}$/u.test(childWorkflowSha)) {
      fail("Plugin ClawHub New workflow SHA must be a full lowercase commit SHA.");
    }
    expectedApproval = {
      version: 2,
      kind: "clawhub-bootstrap",
      repository: process.env.GITHUB_REPOSITORY,
      workflow: "OpenClaw Release Publish",
      parentRunId: releasePublishRunId,
      parentRunAttempt: positiveRunAttempt(expectedRunAttempt),
      workflowBranch: expectedBranch,
      parentWorkflowSha: run.headSha,
      bootstrapWorkflowSha: childWorkflowSha,
      releaseTag: process.env.RELEASE_TAG,
      targetSha: process.env.RELEASE_TARGET_SHA,
      packages: canonicalPackages(process.env.RELEASE_PACKAGES ?? ""),
    };
    mismatchMessage =
      "Attested ClawHub bootstrap approval does not match this release target and package set.";
  } else if (approvalKind === "npm-stable-bootstrap") {
    validateStablePluginNpmBootstrapApproval(approval, {
      repository: process.env.GITHUB_REPOSITORY,
      parentRunId: releasePublishRunId,
      parentRunAttempt: positiveRunAttempt(expectedRunAttempt),
      workflowBranch: expectedBranch,
      workflowFullRef: expectedWorkflowFullRef,
      parentWorkflowSha: expectedWorkflowSha,
      targetSha: process.env.RELEASE_TARGET_SHA,
      packageName: process.env.PACKAGE_NAME,
      packageVersion: process.env.PACKAGE_VERSION,
      publishTag: process.env.PUBLISH_TAG,
    });
    expectedApproval = approval;
    mismatchMessage = "Stable npm bootstrap approval mismatch.";
    if (resolveRemoteReleaseTag(approval.releaseTag) !== approval.targetSha) {
      fail("Stable npm bootstrap release tag no longer matches the approved target.");
    }
  } else {
    fail(`Unsupported release approval kind: ${approvalKind}`);
  }
  if (JSON.stringify(approval) !== JSON.stringify(expectedApproval)) {
    fail(mismatchMessage);
  }
}

const checks = [
  ["workflowName", "OpenClaw Release Publish"],
  ["headBranch", expectedBranch],
  ["event", "workflow_dispatch"],
];
if (process.env.GITHUB_REPOSITORY) {
  checks.push(["repository", process.env.GITHUB_REPOSITORY]);
}

for (const [key, expected] of checks) {
  if (run[key] !== expected) {
    fail(
      `Referenced release publish run ${releasePublishRunId} must have ${key}=${expected}, got ${run[key] ?? "<missing>"}.`,
    );
  }
}

if (expectedWorkflowSha && run.headSha !== expectedWorkflowSha) {
  fail(
    `Referenced release publish run ${releasePublishRunId} must use tooling SHA ${expectedWorkflowSha}, got ${run.headSha ?? "<missing>"}.`,
  );
}
if (expectedWorkflowFullRef) {
  const [workflowPath, workflowFullRef] = String(run.path ?? "").split("@", 2);
  if (workflowPath !== ".github/workflows/openclaw-release-publish.yml") {
    fail(`Referenced release publish run ${releasePublishRunId} has untrusted workflow path.`);
  }
  if (workflowFullRef && workflowFullRef !== expectedWorkflowFullRef) {
    fail(`Referenced release publish run ${releasePublishRunId} has untrusted workflow full ref.`);
  }
}

if (expectedRunAttempt && run.runAttempt !== positiveRunAttempt(expectedRunAttempt)) {
  fail(
    `Referenced release publish run ${releasePublishRunId} must use attempt ${expectedRunAttempt}, got ${run.runAttempt ?? "<missing>"}.`,
  );
}

if (!directRecovery) {
  if (run.status === "in_progress" && !run.conclusion) {
    console.log(`Using release publish approval run ${releasePublishRunId}: ${run.url}`);
    process.exit(0);
  }
  if (
    allowCompletedSuccessfulParent &&
    run.status === "completed" &&
    run.conclusion === "success"
  ) {
    console.log(
      `Using successful completed release publish run ${releasePublishRunId}: ${run.url}`,
    );
    process.exit(0);
  }
  if (run.status !== "in_progress") {
    fail(
      `Referenced release publish run ${releasePublishRunId} must still be in_progress, got ${run.status ?? "<missing>"}.`,
    );
  }
  if (run.conclusion) {
    fail(
      `Referenced release publish run ${releasePublishRunId} already concluded ${run.conclusion}.`,
    );
  }
}

if (run.status === "in_progress" && !run.conclusion) {
  console.log(`Using active release publish run ${releasePublishRunId}: ${run.url}`);
  process.exit(0);
}

if (run.status === "completed" && ["success", "failure"].includes(run.conclusion)) {
  console.log(
    `Using completed release publish run ${releasePublishRunId} (${run.conclusion}) for direct recovery: ${run.url}`,
  );
  process.exit(0);
}

fail(
  `Direct release recovery run ${releasePublishRunId} must be in_progress or completed with success/failure, got status=${run.status ?? "<missing>"} conclusion=${run.conclusion ?? "<missing>"}.`,
);
