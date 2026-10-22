import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  applyReleaseVersionPlan,
  parseReleaseVersionArgs,
  planReleaseVersion,
} from "../../scripts/release-version.ts";
import { cleanupTempDirs, makeTempDir } from "../helpers/temp-dir.js";

const tempDirs = new Set<string>();

afterEach(() => {
  cleanupTempDirs(tempDirs);
});

function writeFixture(): string {
  const root = makeTempDir(tempDirs, "yume-release-version-");
  fs.writeFileSync(
    path.join(root, "package.json"),
    `${JSON.stringify({ name: "yume", version: "2026.6.11", private: true }, null, 2)}\n`,
  );
  return root;
}

it("rejects alpha release preparation before reading or changing packages", () => {
  expect(() => planReleaseVersion({ version: "2026.9.24-alpha.1" })).toThrow(
    "Alpha releases are retired;",
  );
});

describe("release version argument parsing", () => {
  it("keeps last-value ordering and rejects incomplete options after help", () => {
    expect(
      parseReleaseVersionArgs([
        "--write",
        "--version",
        "2026.7.1",
        "--",
        "--check",
        "--version",
        "2026.7.2",
      ]),
    ).toMatchObject({ mode: "check", version: "2026.7.2" });
    expect(() => parseReleaseVersionArgs(["--help", "--root", "-h"])).toThrow(
      "Missing value for --root.",
    );
    expect(() => parseReleaseVersionArgs(["--version=2026.7.2"])).toThrow(
      "Unknown argument: --version=2026.7.2",
    );
  });
});

describe("release version planning", () => {
  it("updates only the root package version", () => {
    const root = writeFixture();
    const plan = planReleaseVersion({ rootDir: root, version: "2026.7.2-3" });
    applyReleaseVersionPlan(plan);

    expect(plan.version).toBe("2026.7.2-3");
    expect(JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))).toMatchObject({
      name: "yume",
      private: true,
      version: "2026.7.2",
    });
    expect(plan.changes).toHaveLength(1);
  });

  it("requires a version in package.json", () => {
    const root = writeFixture();
    const packagePath = path.join(root, "package.json");
    const invalidPackage = '{"name":"yume"}\n';
    fs.writeFileSync(packagePath, invalidPackage);

    expect(() => planReleaseVersion({ rootDir: root, version: "2026.7.2-beta.1" })).toThrow(
      "Missing package.json version",
    );
    expect(fs.readFileSync(packagePath, "utf8")).toBe(invalidPackage);
  });
});
