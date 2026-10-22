import { describe, expect, it } from "vitest";
import { detectChangedScope } from "../../scripts/ci-changed-scope.mjs";

describe("shared runtime contract fixture CI scope", () => {
  it("runs the Node suite for the shared Talk fixture", () => {
    const fixturePath = "test/fixtures/talk-config-contract.json";
    expect(detectChangedScope([fixturePath])).toMatchObject({ runNode: true });
    expect(detectChangedScope([fixturePath])).not.toHaveProperty("runAndroid");
    expect(detectChangedScope([fixturePath])).not.toHaveProperty("runIosBuild");
  });

  it.each([
    "src/agents/github-exec-launcher.ts",
    "src/agents/github-exec-credential.ts",
    "src/shared/worker-bundle-hash.ts",
    "src/worker/workspace-rsync-receiver.ts",
    "src/gateway/worker-environments/workspace-sync.ts",
    "src/gateway/worker-environments/workspace-sync-helpers.ts",
    "src/gateway/worker-environments/workspace-accepted-sync.ts",
    "src/gateway/worker-environments/workspace-accepted-remote-script.ts",
    "src/gateway/worker-environments/workspace-mutation-remote-script.ts",
    "src/gateway/worker-environments/workspace-rsync-path.test.ts",
  ])("routes worker deploy artifact owner %s through Node CI", (ownerPath) => {
    expect(detectChangedScope([ownerPath])).toMatchObject({ runNode: true });
  });
});
