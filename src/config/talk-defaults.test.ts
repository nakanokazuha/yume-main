// Verifies generated talk default config stays aligned with schema.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { FIELD_HELP } from "./schema.help.js";
import { describeTalkSilenceTimeoutDefaults } from "./talk-defaults.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
describe("talk silence timeout defaults", () => {
  it("keeps help text and docs aligned with the policy", () => {
    const defaultsDescription = describeTalkSilenceTimeoutDefaults();
    expect(FIELD_HELP["talk.silenceTimeoutMs"]).toContain(defaultsDescription);
    expect(
      fs.readFileSync(path.join(repoRoot, "docs/gateway/config-agents/messages-and-talk.md"), "utf8"),
    ).toContain(defaultsDescription);
  });
});
