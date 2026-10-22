import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, copyFileSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseArgs } from "../../scripts/check-release-metadata-only.mts";
import { createPnpmRunnerSpawnSpec } from "../../scripts/pnpm-runner.mts";
import {
  resolveRuntimeWorkerArgv,
  resolveRuntimeWorkerUrl,
} from "../../src/infra/runtime-worker-url.js";
import { useAutoCleanupTempDirTracker } from "../helpers/temp-dir.js";
import { toolingMtsEntrypoints } from "./tooling-mts-runtime.test-support.mts";

const scriptPath = path.resolve(
  import.meta.dirname,
  "../../scripts/check-release-metadata-only.mts",
);
const scriptArgs = resolveRuntimeWorkerArgv(
  resolveRuntimeWorkerUrl(toolingMtsEntrypoints.releaseMetadata),
);
const tsconfigPath = path.resolve(import.meta.dirname, "../../tsconfig.json");
const tempDirs = useAutoCleanupTempDirTracker(afterEach);
const itUnix = process.platform === "win32" ? it.skip : it;

describe("check-release-metadata-only", () => {
  it("parses refs and explicit paths", () => {
    expect(
      parseArgs([
        "--base",
        "origin/release",
        "--head",
        "HEAD",
        "./package.json",
        "docs\\install\\updating.md",
      ]),
    ).toEqual({
      staged: false,
      base: "origin/release",
      head: "HEAD",
      paths: ["package.json", "docs/install/updating.md"],
    });
  });

  it("rejects missing ref option values and unknown options", () => {
    expect(() => parseArgs(["--base", "--head", "HEAD"])).toThrow("Expected --base <ref>.");
    expect(() => parseArgs(["--base", "-h"])).toThrow("Expected --base <ref>.");
    expect(() => parseArgs(["--head"])).toThrow("Expected --head <ref>.");
    expect(() => parseArgs(["--head", "-h"])).toThrow("Expected --head <ref>.");
    expect(() => parseArgs(["--base", ""])).toThrow("Expected --base <ref>.");
    expect(() => parseArgs(["--stgaed"])).toThrow("Unknown option: --stgaed");
  });

  it("preserves option-shaped paths after the separator", () => {
    expect(parseArgs(["--staged", "--", "--head"])).toEqual({
      staged: true,
      head: "HEAD",
      paths: ["--head"],
    });
  });

  it("permits only the root package version to change in metadata-only commits", () => {
    const root = tempDirs.make("yume-release-metadata-");
    const repoRoot = path.resolve(import.meta.dirname, "../..");
    const fixtureTsconfigPath = path.join(root, "tsconfig.json");
    const { scripts } = JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8"));
    const manifestPath = path.join(root, "package.json");
    const writePackage = (version: string, extra: Record<string, unknown> = {}) =>
      writeFileSync(
        manifestPath,
        JSON.stringify({
          name: "yume",
          private: true,
          version,
          scripts: {
            "release-metadata:check": scripts["release-metadata:check"],
          },
          ...extra,
        }),
      );
    writePackage("2026.8.1");
    copyFileSync(tsconfigPath, fixtureTsconfigPath);
    mkdirSync(path.join(root, "scripts"));
    copyFileSync(scriptPath, path.join(root, "scripts/check-release-metadata-only.mts"));
    for (const file of ["tsx.mjs", "changed-lanes.mts"]) {
      symlinkSync(path.join(repoRoot, "scripts", file), path.join(root, "scripts", file), "file");
    }
    symlinkSync(path.join(repoRoot, "scripts/lib"), path.join(root, "scripts/lib"), "junction");
    symlinkSync(path.join(repoRoot, "packages"), path.join(root, "packages"), "junction");
    const runMetadata = (args: string[]) => {
      const spec = createPnpmRunnerSpawnSpec({
        cwd: root,
        pnpmArgs: ["run", "release-metadata:check", ...args],
        env: { ...process.env, TSX_TSCONFIG_PATH: fixtureTsconfigPath },
        stdio: "pipe",
      });
      return spawnSync(spec.command, spec.args, { ...spec.options, encoding: "utf8" });
    };
    execFileSync("git", ["init", "-q"], { cwd: root });
    execFileSync("git", ["add", "package.json"], { cwd: root });
    execFileSync(
      "git",
      ["-c", "user.name=Yume Test", "-c", "user.email=test@yume.invalid", "commit", "-qm", "baseline"],
      { cwd: root },
    );

    writePackage("2026.8.2");
    const accepted = runMetadata(["--base", "HEAD", "--head", "HEAD", "--", "package.json"]);
    expect(accepted.status, accepted.stderr).toBe(0);
    expect(accepted.stderr).toContain("[release-metadata] ok (1 files)");

    execFileSync("git", ["add", "package.json"], { cwd: root });
    writePackage("2026.8.3", { channel: "stable" });
    const staged = runMetadata(["--staged"]);
    expect(staged.status, staged.stderr).toBe(0);
    const rejected = runMetadata(["--base", "HEAD", "--head", "HEAD"]);
    expect(rejected.status).toBe(1);
    expect(rejected.stderr).toContain("package.json changed outside the top-level version field");
  });

  itUnix("fails with an actionable timeout when git diff hangs", () => {
    const tempDir = tempDirs.make("yume-release-metadata-git-");
    const gitPath = path.join(tempDir, "git");
    writeFileSync(
      gitPath,
      `#!/usr/bin/env node
if (process.argv.includes("diff")) {
  setInterval(() => {}, 1000);
} else {
  process.exit(0);
}
`,
      "utf8",
    );
    chmodSync(gitPath, 0o755);

    const result = spawnSync(process.execPath, scriptArgs, {
      cwd: path.resolve(import.meta.dirname, "../.."),
      env: {
        ...process.env,
        OPENCLAW_RELEASE_METADATA_GIT_TIMEOUT_MS: "500",
        PATH: `${tempDir}${path.delimiter}${process.env.PATH ?? ""}`,
      },
      encoding: "utf8",
      timeout: 5_000,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "release metadata guard: git diff --name-only --diff-filter=ACMR origin/main...HEAD timed out after 500ms.",
    );
  });
});
