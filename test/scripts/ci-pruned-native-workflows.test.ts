import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";

const workflowDir = ".github/workflows";
const retiredWorkflows = [
  "android-emulator-diagnostic.yml",
  "android-release.yml",
  "android-store-release.yml",
  "codeql-android-critical-security.yml",
  "codeql-macos-critical-security.yml",
  "ios-periphery-comment.yml",
  "ios-periphery.yml",
  "ios-release-e2e.yml",
  "ios-store-release.yml",
  "macos-periphery.yml",
  "macos-release.yml",
  "native-app-locale-refresh.yml",
  "shared-openclawkit-periphery.yml",
];
const readWorkflow = (name: string) =>
  parse(readFileSync(join(workflowDir, name), "utf8")) as {
    jobs: Record<string, { needs?: string[] | string }>;
  };

describe("native app workflow removal", () => {
  it("removes workflows owned only by deleted native clients", () => {
    const active = new Set(readdirSync(workflowDir));
    for (const name of retiredWorkflows) expect(active.has(name), name).toBe(false);
  });

  it("keeps shared CI, core security scans, and non-native release paths", () => {
    const ci = readWorkflow("ci.yml");
    const gateNeeds = ci.jobs["ci-gate"].needs as string[];
    for (const name of [
      "security-fast",
      "checks-fast-core",
      "macos-node",
      "checks-windows",
      "docker-seed-e2e",
    ]) {
      expect(ci.jobs).toHaveProperty(name);
      expect(gateNeeds).toContain(name);
    }
    for (const name of [
      "native-i18n",
      "macos-swift",
      "ios-build",
      "ios-screenshot-shard",
      "android",
      "android-screenshots",
      "android-access-native",
    ]) {
      expect(ci.jobs).not.toHaveProperty(name);
    }
    for (const [jobName, job] of Object.entries(ci.jobs)) {
      const needs = Array.isArray(job.needs) ? job.needs : job.needs ? [job.needs] : [];
      for (const dependency of needs) {
        expect(ci.jobs, `${jobName} needs ${dependency}`).toHaveProperty(dependency);
      }
    }

    const codeql = readdirSync(workflowDir);
    expect(codeql).toContain("codeql.yml");
    expect(codeql).toContain("codeql-critical-quality.yml");
    const release = readWorkflow("openclaw-release-publish.yml");
    for (const name of ["publish", "publish_docker", "publish_linux", "publish_windows"]) {
      expect(release.jobs).toHaveProperty(name);
    }
    expect(release.jobs).not.toHaveProperty("publish_android");
  });

  it("keeps the Mac host runtime test lane without Swift app targets", () => {
    const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts as Record<
      string,
      string
    >;
    expect(scripts["test:macos:ci"]).toContain("test:macos:ci:1");
    expect(scripts["test:macos:ci"]).toContain("test:macos:ci:2");
    const hostTests = [scripts["test:macos:ci:1"], scripts["test:macos:ci:2"]].join(" ");
    for (const path of ["src/daemon/launchd.test.ts", "src/infra/brew.test.ts"]) {
      expect(hostTests).toContain(path);
    }
    expect(hostTests).not.toMatch(/apps\/(?:android|ios|macos|shared|swabble)|swift|gradle/u);
  });

  it("leaves no active workflow path pointing at deleted client trees", () => {
    const active = readdirSync(workflowDir).filter((name) => /\.ya?ml$/u.test(name));
    const stalePath = /apps\/(?:android|ios|macos|macos-mlx-tts|shared|swabble)(?:\/|$)/u;
    for (const name of active) {
      expect(readFileSync(join(workflowDir, name), "utf8"), name).not.toMatch(stalePath);
    }
  });
});
