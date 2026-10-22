// Control Ui I18N tests cover control ui i18n script behavior.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { execa } from "execa";
import { afterAll, describe, expect, it, vi } from "vitest";
import {
  assertControlUiGeneratedArtifactsIsolated,
  resolveAllowedGeneratedMixBranch,
  shouldStrictControlUiI18n,
} from "../../scripts/ci-changed-scope.mjs";
import {
  analyzeControlUiCatalogs,
  flattenControlUiCatalog,
  formatControlUiCatalogFallbackDriftError,
  verifyControlUiReferencedKeys,
} from "../../scripts/control-ui-i18n-verify.ts";
import {
  assertNoControlUiFallbacks,
  buildBatchPrompt,
  filterPlaceholderCompatibleTranslations,
  parseTranslationBatchReply,
} from "../../scripts/control-ui-i18n.ts";
import { loadControlUiSourceCatalog } from "../../scripts/lib/control-ui-i18n-catalog.ts";
import { collectControlUiRawCopyFromSource } from "../../scripts/lib/control-ui-i18n-raw-copy.ts";
import { flattenTranslations } from "../../scripts/lib/control-ui-i18n-sync-plan.ts";
import { createNativeTypeScriptParser } from "../../scripts/lib/native-typescript.mts";
import { resolveTestNodeExecPath } from "../../src/test-utils/node-process.js";
import { configHintTranslationKey } from "../../ui/src/i18n/lib/config-hint-translation.ts";
import { registerCodeBlocksEnglish } from "../../ui/src/i18n/locales/en-code-blocks.ts";
import { registerLabsEnglish } from "../../ui/src/i18n/locales/en-labs.ts";
import { registerSettingsEnglish } from "../../ui/src/i18n/locales/en-settings.ts";
import { registerTranscriptsEnglish } from "../../ui/src/i18n/locales/en-transcripts.ts";

vi.mock("../../scripts/lib/sleep.mjs", () => ({ sleep: async () => {} }));
const testNodeExecPath = resolveTestNodeExecPath();
const parser = createNativeTypeScriptParser();
afterAll(() => parser.close());
describe("control-ui config hint source catalog", () => {
  it("includes core config labels and help under collision-safe keys", () => {
    const source = flattenTranslations(loadControlUiSourceCatalog());

    const label = "Gateway Token";
    expect(source.get(configHintTranslationKey("gateway.auth.token", "label", label))).toBe(label);
    const helpEntry = [...source].find(([key]) =>
      key.startsWith("configHints.gateway%2Eauth%2Etoken.help."),
    );
    expect(helpEntry?.[1]).toBeTypeOf("string");
  });
});

describe("control-ui-i18n generated ownership", () => {
  it("includes lazy page copy and shared search labels in the generator catalog", () => {
    const result = spawnSync(
      testNodeExecPath,
      [
        "--import",
        "./scripts/tsx.mjs",
        "--input-type=module",
        "--eval",
        [
          'import { loadControlUiSourceCatalog } from "./scripts/lib/control-ui-i18n-catalog.ts";',
          "const catalog = loadControlUiSourceCatalog();",
          "console.log(JSON.stringify(catalog));",
        ].join("\n"),
      ],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    expect(result.status, result.stderr).toBe(0);
    const catalog: unknown = JSON.parse(result.stdout);
    const source = flattenControlUiCatalog(catalog, "en");
    for (const fragment of [
      registerCodeBlocksEnglish.catalog,
      registerLabsEnglish.catalog,
      registerSettingsEnglish.catalog,
      registerTranscriptsEnglish.catalog,
    ]) {
      const lazyCopy = flattenControlUiCatalog(fragment, "lazy copy");
      for (const [key, value] of lazyCopy) {
        expect(source.get(key), key).toBe(value);
      }
    }
    expect(source.get("meetingCapture.title")).toBe("Meeting capture");
    expect(source.get("meetingCapture.sources")).toBe("Auto-start sources");
  });

  it("keeps generated locale snapshots out of source PRs", () => {
    expect(() =>
      assertControlUiGeneratedArtifactsIsolated([
        "ui/src/i18n/locales/en.ts",
        "ui/src/i18n/locales/de.ts",
        "ui/src/i18n/.i18n/de.meta.json",
      ]),
    ).toThrow("Control UI generated locale artifacts must be isolated from source changes");

    expect(() =>
      assertControlUiGeneratedArtifactsIsolated([
        "ui/src/i18n/.i18n/catalog-fallbacks.json",
        "ui/src/i18n/.i18n/de.meta.json",
        "ui/src/i18n/.i18n/de.tm.jsonl",
      ]),
    ).not.toThrow();

    expect(() =>
      assertControlUiGeneratedArtifactsIsolated([
        "ui/src/i18n/locales/de.ts",
        "ui/src/i18n/.i18n/glossary.de.json",
      ]),
    ).not.toThrow();

    expect(() =>
      assertControlUiGeneratedArtifactsIsolated([
        "ui/src/i18n/.i18n/catalog-fallbacks.json",
        "ui/src/i18n/.i18n/raw-copy-baseline.json",
      ]),
    ).toThrow("Control UI generated locale artifacts must be isolated from source changes");

    expect(() =>
      assertControlUiGeneratedArtifactsIsolated([
        "ui/src/i18n/locales/en.ts",
        "ui/src/i18n/.i18n/raw-copy-baseline.json",
      ]),
    ).not.toThrow();

    expect(() =>
      assertControlUiGeneratedArtifactsIsolated(
        ["package.json", "ui/src/i18n/locales/de.ts"],
        "release/2026.7.3",
      ),
    ).not.toThrow();
    expect(() =>
      assertControlUiGeneratedArtifactsIsolated(
        ["package.json", "ui/src/i18n/locales/de.ts"],
        "main",
      ),
    ).not.toThrow();

    expect(shouldStrictControlUiI18n(["ui/src/i18n/locales/de.ts"])).toBe(false);
    expect(shouldStrictControlUiI18n(["ui/src/i18n/.i18n/de.tm.jsonl"])).toBe(true);
    expect(shouldStrictControlUiI18n(["ui/src/i18n/locales/en.ts"])).toBe(false);
    expect(shouldStrictControlUiI18n(null)).toBe(true);
  });

  it("allows only a complete canonical translation-memory ownership migration", () => {
    const locales = readdirSync(path.resolve("ui/src/i18n/.i18n"))
      .filter((fileName) => fileName.endsWith(".tm.jsonl"))
      .map((fileName) => fileName.slice(0, -".tm.jsonl".length));
    const owners = [
      ".gitattributes",
      "scripts/ci-changed-scope.mjs",
      "scripts/control-ui-i18n.ts",
      "scripts/control-ui-i18n-verify.ts",
      "scripts/lib/control-ui-i18n-catalog.ts",
      "scripts/lib/control-ui-i18n-catalog-values.ts",
      "scripts/lib/control-ui-i18n-sync-plan.ts",
      "ui/AGENTS.md",
      "ui/config/control-ui-locales.ts",
      "ui/vite.config.ts",
    ];
    const adapters = locales.map((locale) => `ui/src/i18n/locales/${locale}.ts`);
    const generated = [
      "ui/src/i18n/.i18n/catalog-fallbacks.json",
      ...locales.flatMap((locale) => [
        `ui/src/i18n/.i18n/${locale}.tm.jsonl`,
        `ui/src/i18n/.i18n/${locale}.meta.json`,
      ]),
    ];
    const migration = [...owners, ...adapters, ...generated];

    expect(() => assertControlUiGeneratedArtifactsIsolated(migration)).not.toThrow();
    expect(() => assertControlUiGeneratedArtifactsIsolated(migration.slice(1))).toThrow(
      "Control UI generated locale artifacts must be isolated",
    );
    expect(() =>
      assertControlUiGeneratedArtifactsIsolated(
        migration.filter((filePath) => filePath !== generated[1]),
      ),
    ).toThrow("Control UI generated locale artifacts must be isolated");
    expect(() =>
      assertControlUiGeneratedArtifactsIsolated([...migration, "ui/src/i18n/.i18n/other.tm.jsonl"]),
    ).toThrow("Control UI generated locale artifacts must be isolated");
  });

  it("allows generated release output on trusted release and main runs only", () => {
    const trustedActions = {
      GITHUB_ACTIONS: "true",
      OPENCLAW_ALLOW_RELEASE_GENERATED_MIX: "true",
    };

    expect(
      resolveAllowedGeneratedMixBranch(
        {
          ...trustedActions,
          GITHUB_EVENT_NAME: "push",
          GITHUB_REF: "refs/heads/main",
        },
        "main",
      ),
    ).toBe("main");
    expect(
      resolveAllowedGeneratedMixBranch(
        {
          ...trustedActions,
          GITHUB_EVENT_NAME: "pull_request",
          GITHUB_REF: "refs/pull/1/merge",
        },
        "main",
      ),
    ).toBe("");
    expect(resolveAllowedGeneratedMixBranch(trustedActions, "release/2026.7.3")).toBe(
      "release/2026.7.3",
    );
    expect(resolveAllowedGeneratedMixBranch({ GITHUB_ACTIONS: "true" }, "release/2026.7.3")).toBe(
      "",
    );
  });
});

describe("control-ui-i18n catalog validation", () => {
  it("points strict catalog drift at the generated release repair", () => {
    const message = formatControlUiCatalogFallbackDriftError();

    expect(message).toContain("pnpm ui:i18n:sync");
    expect(message).toContain("pnpm release:prep");
    expect(message).not.toContain("pnpm ui:i18n:baseline");
  });

  it("builds a deterministic fallback list without accepting catalog drift", () => {
    const source = flattenControlUiCatalog(
      { group: { first: "First {count}", second: "Second" } },
      "en",
    );
    const missingAnalysis = analyzeControlUiCatalogs(
      source,
      new Map([
        ["de", new Map([["group.first", "Erste {count}"]])],
        ["fr", new Map([["group.first", "Premiere {count}"]])],
      ]),
    );

    expect(missingAnalysis).toEqual({
      errors: [],
      fallbacks: { "group.second": ["de", "fr"] },
    });

    const driftAnalysis = analyzeControlUiCatalogs(
      source,
      new Map([
        [
          "fr",
          new Map([
            ["group.second", "Deuxieme"],
            ["group.first", "Premiere"],
            ["group.orphan", "Orpheline"],
          ]),
        ],
      ]),
    );
    expect(driftAnalysis.errors).toEqual([
      "fr: orphan keys: group.orphan",
      "fr: keys are not in English catalog order",
      "fr:group.first expected {count} got {}",
    ]);
    expect(driftAnalysis.fallbacks).toEqual({});
  });

  it("rejects invalid catalog leaf values", () => {
    expect(() => flattenControlUiCatalog({ group: { title: 42 } }, "fr")).toThrow(
      "fr:group.title must be a string or object",
    );
  });

  it("rejects literal keys and template prefixes missing from the English catalog", () => {
    const source = flattenControlUiCatalog(
      { common: { ok: "OK" }, workboard: { status: { ready: "Ready" } } },
      "en",
    );
    const content = [
      't("common.ok");',
      't("common.missing");',
      "t(`workboard.status.${status}`);",
      "t(`workboard.missing.${status}`);",
    ].join("\n");

    expect(() =>
      verifyControlUiReferencedKeys(source, [{ content, relativeFile: "ui/src/pages/example.ts" }]),
    ).toThrowError(
      [
        "control-ui referenced translation key verification failed.",
        'ui/src/pages/example.ts:2: missing English catalog key "common.missing"',
        'ui/src/pages/example.ts:4: missing English catalog subtree "workboard.missing."',
      ].join("\n"),
    );
  });

  it("finds raw text and attributes split by template interpolation", () => {
    const source =
      'const jsx = <button aria-label="Archive" />; const view = html`<button title="Delete ${name}">Delete ${name}</button>`; const image = html`<img alt="Preview" />`; menu.setAttribute("aria-label", "Selection actions"); reply.setAttribute("aria-label", `Reply to ${name}`); file.setAttribute("title", "Open " + fileName);';
    const sourceFile = parser.parseSourceFile("ui/src/pages/example.tsx", source);

    expect(
      collectControlUiRawCopyFromSource(sourceFile).map(({ kind, text }) => ({ kind, text })),
    ).toEqual([
      { kind: "html-attribute", text: "Archive" },
      { kind: "html-attribute", text: "Preview" },
      { kind: "html-attribute", text: "Delete" },
      { kind: "html-text", text: "Delete" },
      { kind: "html-attribute", text: "Selection actions" },
      { kind: "html-attribute", text: "Reply to" },
      { kind: "html-attribute", text: "Open" },
    ]);
  });

  it("keeps verification keyless even when provider credentials exist", () => {
    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", "scripts/control-ui-i18n-verify.ts", "verify"],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        env: {
          ...process.env,
          ANTHROPIC_API_KEY: "redacted",
          OPENAI_API_KEY: "redacted",
        },
      },
    );

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("source:");
    expect(result.stdout).not.toContain("provider=openai");
    expect(result.stdout).not.toContain("provider=anthropic");
  });

  it("rejects placeholder-corrupt batch replies before they leave the retry loop", () => {
    const items = [
      {
        cacheKey: "cache-key",
        key: "configView.viewPendingChange",
        text: "View pending change ({count})",
        textHash: "text-hash",
      },
    ];

    expect(() =>
      parseTranslationBatchReply(
        JSON.stringify({ "configView.viewPendingChange": "Pending change" }),
        items,
        "ar",
      ),
    ).toThrow("ar:configView.viewPendingChange expected {count} got {}");
    expect(
      parseTranslationBatchReply(
        JSON.stringify({ "configView.viewPendingChange": "Pending change ({count})" }),
        items,
        "ar",
      ),
    ).toEqual(new Map([["configView.viewPendingChange", "Pending change ({count})"]]));
  });

  it("runs an optional result validator before accepting a batch reply", () => {
    const items = [
      {
        cacheKey: "cache-key",
        key: "native.apple.progress",
        text: "Processed %lld of %@",
        textHash: "text-hash",
      },
    ];

    expect(() =>
      parseTranslationBatchReply(
        JSON.stringify({ "native.apple.progress": "Bearbetade %@" }),
        items,
        "sv",
        (source, translated, key, locale) => {
          if (source.includes("%lld") && !translated.includes("%lld")) {
            throw new Error(`invalid structural tokens for ${locale}:${key}`);
          }
        },
      ),
    ).toThrow("invalid structural tokens for sv:native.apple.progress");
  });

  it("makes placeholder-incompatible existing copy pending for bot repair", () => {
    const reusable = filterPlaceholderCompatibleTranslations(
      new Map([
        ["changed", "Waiting for {total}"],
        ["same", "Waiting for {count}"],
      ]),
      new Map([
        ["changed", "Warten auf {count}"],
        ["same", "Warten auf {count}"],
      ]),
    );

    expect([...reusable]).toEqual([["same", "Warten auf {count}"]]);
  });

  it("feeds the exact validation failure back into a retry prompt", () => {
    const items = [
      {
        cacheKey: "cache-key",
        key: "configView.viewPendingChange",
        text: "View pending change ({count})",
        textHash: "text-hash",
      },
    ];
    const validationError = "ar:configView.viewPendingChange expected {count} got {}";

    expect(buildBatchPrompt(items, validationError)).toContain(
      `failed validation. Correct that exact failure in the new response:\n${validationError}`,
    );
  });

  it("ships no recorded English fallbacks", () => {
    const metaDir = path.resolve("ui/src/i18n/.i18n");
    const fallbacks = readdirSync(metaDir)
      .filter((fileName) => fileName.endsWith(".meta.json"))
      .flatMap((fileName) => {
        const meta = JSON.parse(readFileSync(path.join(metaDir, fileName), "utf8")) as {
          fallbackKeys?: string[];
          locale?: string;
        };
        return (meta.fallbackKeys ?? []).map((key) => `${meta.locale ?? fileName}:${key}`);
      });

    expect(fallbacks).toEqual([]);
  });

  it("makes the strict gate reject recorded English fallbacks", () => {
    expect(() =>
      assertNoControlUiFallbacks([
        { fallbackCount: 0, locale: "de" },
        { fallbackCount: 2, locale: "fr" },
      ]),
    ).toThrow("fr: 2 fallback keys");
    expect(() =>
      assertNoControlUiFallbacks([
        { fallbackCount: 0, locale: "de" },
        { fallbackCount: 0, locale: "fr" },
      ]),
    ).not.toThrow();
  });
});
