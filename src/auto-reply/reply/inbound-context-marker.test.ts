/** Verifies the hand-maintained marker copies stay equal to the core constant. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { INBOUND_CONTEXT_MARKER, markInboundContextLabel } from "./inbound-context-marker.js";

const REPO_ROOT = path.resolve(import.meta.dirname, "../../..");

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

describe("inbound context marker", () => {
  it("appends the marker as a space-separated suffix", () => {
    expect(markInboundContextLabel("Sender:")).toBe(`Sender: ${INBOUND_CONTEXT_MARKER}`);
  });

  // The extension copy cannot import core. Drift is silent, so pin it here instead.
  it("matches the memory-lancedb copy", () => {
    expect(readRepoFile("extensions/memory-lancedb/memory-capture-sanitization.ts")).toContain(
      INBOUND_CONTEXT_MARKER,
    );
  });

});
