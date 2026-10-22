import { detectChangedLanes } from "../changed-lanes.mts";
import {
  getChangedPathFacts,
  isTestFileTarget,
  isTestSupportFileTarget,
  normalizeChangedPath,
} from "./changed-path-facts.mjs";

const CHECK_TASKS = ["guards", "npm-lock", "bundled-channel-config-metadata", "dependencies"];
const ADDITIONAL_GROUPS = [
  "boundaries",
  "source-contracts",
  "extension-package-boundary",
  "runtime-topology-architecture",
];
const CODE_PATH_RE = /\.[cm]?[jt]sx?$/u;
const SOURCE_PATH_RE = /^(?:src|extensions|packages)\//u;

type CiCheckFamilyScope = {
  mode: "full" | "scoped";
  checkTasks: string[];
  fastTasks: string[];
  additionalGroups: string[];
  baselineRatchets: boolean;
  madgeImportCycles: boolean;
  kyselyGuardrails: boolean;
  lint: boolean;
  types: boolean;
};

/** Selects check families after the caller admits a complete, narrow PR diff. */
export function resolveCiCheckFamilyScope(changedPaths: readonly string[]): CiCheckFamilyScope {
  const facts = changedPaths.map((path) => getChangedPathFacts(normalizeChangedPath(path)));
  const bunLauncher = changedPaths.some(
    (file) =>
      file === "openclaw.mjs" ||
      file === "test/openclaw-launcher.e2e.test.ts" ||
      /^src\/plugins\/plugin-module-generation(?:\.|-)/u.test(file),
  );
  // Configuration and shared fixtures can change scanner inputs or arbitrary
  // consumers; path ownership alone cannot establish their import closure.
  const full =
    facts.length === 0 ||
    changedPaths.some((path) => path !== path.trim() || path.startsWith("/")) ||
    facts.some(
      ({ path, surface, isTestOnly }) =>
        !path ||
        /(?:^|\/)\.\.(?:\/|$)/u.test(path) ||
        ["rootGlobal", "rootTooling", "unknown"].includes(surface) ||
        /(?:^|\/)(?:package\.json|tsconfig[^/]*\.json)$/u.test(path) ||
        isTestSupportFileTarget(path) ||
        (isTestOnly && !isTestFileTarget(path)) ||
        surface === "testFixture",
    );
  if (full) {
    return {
      mode: "full",
      checkTasks: [...CHECK_TASKS],
      fastTasks: ["bundled-protocol", ...(bunLauncher ? ["bun-launcher"] : [])],
      additionalGroups: [...ADDITIONAL_GROUPS],
      baselineRatchets: true,
      madgeImportCycles: true,
      kyselyGuardrails: true,
      lint: true,
      types: true,
    };
  }

  const paths = facts.map(({ path }) => path);
  const matches = (pattern: RegExp) => paths.some((path) => pattern.test(path));
  const code = matches(CODE_PATH_RE);
  const source = facts.some(({ path, surface }) => surface !== "docs" && SOURCE_PATH_RE.test(path));
  const runtimeSource = facts.some(
    ({ path, surface }) =>
      surface !== "docs" && SOURCE_PATH_RE.test(path) && !isTestFileTarget(path),
  );
  const schemaBaseline = paths.includes(
    "docs/.generated/sqlite-session-transcript-schema-baseline.sha256",
  );
  const inventoryDocs = matches(/^docs\/(?:channels|providers|plugins|\.generated)\//u);
  const { lanes } = detectChangedLanes(paths);
  // Protocol generation also reads source text instead of importing it.
  const protocolInput =
    paths.some((file) => file.startsWith("packages/gateway-protocol/")) ||
    paths.includes("src/gateway/methods/core-descriptors.ts");
  const types =
    code || (matches(/\.json$/u) && (source || facts.some(({ surface }) => surface === "ui")));

  return {
    mode: "scoped",
    // The required planner owns conflict markers and wall-clock deprecation checks on
    // narrow PRs; the remaining guard row follows its scanned source inputs.
    checkTasks: CHECK_TASKS.filter(
      (task) =>
        (task === "guards" &&
          (code || runtimeSource)) ||
        (task === "npm-lock" && matches(/^packages\/normalization-core\//u)) ||
        (task === "bundled-channel-config-metadata" && lanes.bundledChannelConfigMetadata) ||
        (task === "dependencies" && code),
    ),
    // PR protocol generation stays blocking; its bundled runtime tests use the
    // same changed-owner Node plan as every other runtime family.
    fastTasks: [
      ...(protocolInput ? ["bundled-protocol"] : []),
      ...(bunLauncher ? ["bun-launcher"] : []),
    ],
    additionalGroups: ADDITIONAL_GROUPS.filter(
      (group) =>
        (group === "boundaries" && code) ||
        (group === "source-contracts" && (source || schemaBaseline)) ||
        (group === "extension-package-boundary" && runtimeSource) ||
        (group === "runtime-topology-architecture" && (source || code)),
    ),
    baselineRatchets: code || runtimeSource || inventoryDocs,
    madgeImportCycles: matches(/\.(?:[cm]?ts|tsx)$/u),
    kyselyGuardrails: paths.some(
      (path) => SOURCE_PATH_RE.test(path) && /\.(?:[cm]?ts|tsx)$/u.test(path),
    ),
    // The changed-lint row also owns formatting for YAML, JSON5, and other data.
    lint: true,
    types,
  };
}
