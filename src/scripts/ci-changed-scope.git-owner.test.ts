import { expect, it } from "vitest";
import { detectChangedScope } from "../../scripts/ci-changed-scope.mjs";

it("routes Git-owner lifecycle proof without selecting native app builds", () => {
  expect(detectChangedScope([".github/actions/publish-generated-pr/action.yml"])).toMatchObject({
    runNode: true,
    runMacosNode: true,
    runWindows: true,
  });
  expect(detectChangedScope([".github/actions/publish-generated-pr/action.yml"]))
    .not.toHaveProperty("runAndroid");
});
