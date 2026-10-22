import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createStablePluginNpmBootstrapApproval } from "../../scripts/plugin-npm-bootstrap-approval.mjs";
import { useAutoCleanupTempDirTracker } from "../helpers/temp-dir.js";

const SCRIPT_PATH = "scripts/validate-release-publish-approval.mjs";
const tempRoots = useAutoCleanupTempDirTracker(afterEach);

function runApprovalScript(
  run: Record<string, unknown>,
  env: {
    ALLOW_COMPLETED_SUCCESSFUL_PARENT?: string;
    APPROVAL_PATH?: string;
    CHILD_WORKFLOW_SHA?: string;
    DIRECT_RELEASE_RECOVERY?: string;
    EXPECTED_WORKFLOW_BRANCH?: string;
    EXPECTED_WORKFLOW_FULL_REF?: string;
    EXPECTED_WORKFLOW_SHA?: string;
    EXPECTED_RUN_ATTEMPT?: string;
    GITHUB_REPOSITORY?: string;
    RELEASE_APPROVAL_KIND?: string;
    RELEASE_PACKAGES?: string;
    RELEASE_TAG?: string;
    RELEASE_PUBLISH_RUN_ID?: string;
    RELEASE_TARGET_SHA?: string;
  } = {},
) {
  return spawnSync(process.execPath, [SCRIPT_PATH], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      ALLOW_COMPLETED_SUCCESSFUL_PARENT: env.ALLOW_COMPLETED_SUCCESSFUL_PARENT ?? "false",
      CHILD_WORKFLOW_SHA: env.CHILD_WORKFLOW_SHA ?? "b".repeat(40),
      DIRECT_RELEASE_RECOVERY: env.DIRECT_RELEASE_RECOVERY ?? "false",
      EXPECTED_WORKFLOW_BRANCH: env.EXPECTED_WORKFLOW_BRANCH ?? "release/2026.6.21",
      EXPECTED_WORKFLOW_FULL_REF: env.EXPECTED_WORKFLOW_FULL_REF ?? "",
      EXPECTED_WORKFLOW_SHA: env.EXPECTED_WORKFLOW_SHA ?? "",
      EXPECTED_RUN_ATTEMPT: env.EXPECTED_RUN_ATTEMPT ?? "",
      APPROVAL_PATH: env.APPROVAL_PATH ?? "",
      GITHUB_REPOSITORY: env.GITHUB_REPOSITORY ?? "openclaw/openclaw",
      RELEASE_APPROVAL_KIND: env.RELEASE_APPROVAL_KIND ?? "parent",
      RELEASE_PACKAGES: env.RELEASE_PACKAGES ?? "",
      RELEASE_TAG: env.RELEASE_TAG ?? "v2026.6.21",
      RELEASE_PUBLISH_RUN_ID: env.RELEASE_PUBLISH_RUN_ID ?? "123",
      RELEASE_TARGET_SHA: env.RELEASE_TARGET_SHA ?? "a".repeat(40),
    },
    input: JSON.stringify(run),
  });
}

function approvalRun(overrides: Record<string, unknown> = {}) {
  return {
    conclusion: null,
    event: "workflow_dispatch",
    headBranch: "release/2026.6.21",
    repository: "openclaw/openclaw",
    status: "in_progress",
    url: "https://github.com/openclaw/openclaw/actions/runs/123",
    workflowName: "OpenClaw Release Publish",
    ...overrides,
  };
}

function writeClawHubApproval(overrides: Record<string, unknown> = {}) {
  const root = tempRoots.make("clawhub-bootstrap-approval-");
  const approvalPath = path.join(root, "approval.json");
  fs.writeFileSync(
    approvalPath,
    `${JSON.stringify({
      version: 2,
      kind: "clawhub-bootstrap",
      repository: "openclaw/openclaw",
      workflow: "OpenClaw Release Publish",
      parentRunId: "123",
      parentRunAttempt: 2,
      workflowBranch: "main",
      parentWorkflowSha: "d".repeat(40),
      bootstrapWorkflowSha: "b".repeat(40),
      releaseTag: "v2026.7.1-beta.3",
      targetSha: "a".repeat(40),
      packages: ["@openclaw/meta-provider", "@openclaw/voice-call"],
      ...overrides,
    })}\n`,
  );
  return approvalPath;
}

function runClawHubApproval(
  env: Parameters<typeof runApprovalScript>[1] = {},
  approval: Record<string, unknown> = {},
) {
  return runApprovalScript(
    approvalRun({ headBranch: "main", headSha: "d".repeat(40), runAttempt: 2 }),
    {
      APPROVAL_PATH: writeClawHubApproval(approval),
      EXPECTED_WORKFLOW_BRANCH: "main",
      EXPECTED_RUN_ATTEMPT: "2",
      RELEASE_APPROVAL_KIND: "clawhub-bootstrap",
      RELEASE_PACKAGES: "@openclaw/voice-call,@openclaw/meta-provider",
      RELEASE_TAG: "v2026.7.1-beta.3",
      ...env,
    },
  );
}

describe("scripts/validate-release-publish-approval.mjs", () => {
  it("rejects approval runs from the wrong workflow branch", () => {
    const result = runApprovalScript(approvalRun({ headBranch: "main" }));

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Referenced release publish run 123 must have headBranch=release/2026.6.21, got main.",
    );
  });

  it("rejects completed runs for normal approval handoff", () => {
    const result = runApprovalScript(approvalRun({ conclusion: "success", status: "completed" }));

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Referenced release publish run 123 must still be in_progress, got completed.",
    );
  });

  it("accepts a successful completed parent for detached publication", () => {
    const result = runApprovalScript(approvalRun({ conclusion: "success", status: "completed" }), {
      ALLOW_COMPLETED_SUCCESSFUL_PARENT: "true",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "Using successful completed release publish run 123: https://github.com/openclaw/openclaw/actions/runs/123",
    );
  });

  it("rejects a ClawHub bootstrap handoff without an attested approval artifact", () => {
    const result = runApprovalScript(approvalRun({ headBranch: "main" }), {
      APPROVAL_PATH: "",
      EXPECTED_WORKFLOW_BRANCH: "main",
      RELEASE_APPROVAL_KIND: "clawhub-bootstrap",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "ClawHub bootstrap approval requires an attested approval artifact.",
    );
  });

  it("rejects a ClawHub bootstrap approval for another package set", () => {
    const result = runClawHubApproval({}, { packages: ["@openclaw/meta-provider"] });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Attested ClawHub bootstrap approval does not match this release target and package set.",
    );
  });
});

describe("stable npm bootstrap profile authority", () => {
  it("rejects historical sealed waivers for beta-profile stable bootstrap", () => {
    expect(() =>
      createStablePluginNpmBootstrapApproval({
        releaseTag: "v2026.9.6",
        publishTag: "latest",
        releaseProfile: "beta",
        stableSoakWaiver: "2026.9.6 approved",
        stableSoakWaiverSource: "sealed",
      }),
    ).toThrow("stable/full validation");
  });
});
