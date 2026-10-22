# 17 — Build Status / Implementation Evidence

**Current status:** M1 physical extraction is in progress under the creator's direct 2026-10-23 instruction. G0 remains incomplete and G1 has not passed; no product-specific Yume runtime or UI implementation has started.

**M0 audit activity (2026-10-22):** Official OpenClaw `v2026.10.5` commit `1b58cb9a1b4f4353e1add63c8506db4d890962e8` resolved and shallow checked out under `/private/tmp/openclaw-yume-m0`. Frozen install passed using pnpm 12.9.0. Focused baseline tests passed: 40 tests in `packages/agent-core/src/agent-loop.test.ts`, `packages/plugin-sdk/tests/security-runtime.test.ts`, and `packages/gateway-protocol/src/frame-guards.test.ts`. The first full build generated main/package/extension bundles, then stalled in `write-unified-entry-dts`; it was interrupted after 110.5 seconds without output. A retry was blocked by the retained `.artifacts/dist-artifacts.lock`; the owner PID was absent, but process-list inspection was denied, so the lock was not removed. This initial baseline build attempt did not pass. Inventory and removal proposal were initial drafts; importer, dynamic-discovery, contract, and full license mapping remain incomplete. Target Mac mini hardware, Rust toolchain, model credentials, Google OAuth and device access remain unverified.

| Milestone                    | State       | Gate | Notes                                                                                                                             |
| ---------------------------- | ----------- | ---- | --------------------------------------------------------------------------------------------------------------------------------- |
| M0 Audit & baseline          | INCOMPLETE  | G0   | Fresh pinned install/build now pass; complete import/reachability audit, license map, runtime metrics and host checks remain open |
| M1 Physical extraction       | IN PROGRESS | G1   | B-001 verified; B-002 source/build closure removed and Node 24 build passes; minimal-core smoke and broader extraction remain open |
| M2 Runtime & extensions      | NOT STARTED | G2   | Real inference required                                                                                                           |
| M3 Character & memory        | NOT STARTED | G3   | Persistent grounded memory required                                                                                               |
| M4 Personal tools            | NOT STARTED | G4   | T01–T10 and T13–T14; T11–T12 pending M5                                                                                           |
| M5 Scheduler & evolution     | NOT STARTED | G5   | T11–T12 real scheduling proof; host-run jobs & reflection                                                                         |
| M6 Full functional UI        | NOT STARTED | G6   | Shared React UI                                                                                                                   |
| M7 Local Tauri/PWA packaging | NOT STARTED | G7   | Mac mini, MacBook, iPhone Tailscale                                                                                               |
| M8 MVP acceptance            | NOT STARTED | G8   | All mandatory tests real                                                                                                          |

**Current pinned upstream:** official OpenClaw `v2026.10.5`, commit `1b58cb9a1b4f4353e1add63c8506db4d890962e8`. The initial import is `8983526a`; the reproducible source baseline with its pinned lockfile is `2272ab4f`, tagged `upstream-v2026.10.5-baseline-locked`. That corrected baseline tag has been pushed to the specified public repository. The public `origin` remote tracks this repository's `main`.

**Execution authorization:** on 2026-10-23 the creator instructed direct import and physical deletion in this repository. This supersedes the initial proposal's review hold for this execution. G0 remains incomplete and per-batch evidence requirements still apply.

### M1 extraction activity — 2026-10-23

- B-001 removed the SenseAudio provider at commit `fe376204`. The full path list, reference mapping, rollback anchor, dependency result, test commands and per-batch status are recorded in `templates/REMOVAL_LEDGER.csv`.
- Removed 97,748 tracked source/asset bytes, including its 92,505-byte icon. Workspace projects decreased from 189 to 188. The tracked lockfile now differs from the pinned baseline only by the six-line SenseAudio importer removal; no external package resolution changed. The package had only a workspace plugin-SDK development dependency and no external runtime dependency.
- The fresh-worktree frozen install (`--ignore-scripts`, shared warm content store) and full `pnpm build` passed for both baseline and extracted source. Build durations were 3m28.6s and 3m31.3s. The focused suites passed 140 tests across five files. Targeted `oxfmt --check`, JSON parsing, `git diff --check`, and source/`dist` reference scans passed.
- The baseline `dist` contains 20,051 files / 380,143,683 bytes; the extracted build contains 20,044 files / 380,048,095 bytes: a 95,588-byte reduction. Startup JavaScript gzip changed from 374,204 to 374,192 bytes (12 bytes smaller). Both builds print the same existing budget violation: the 373,454-byte limit is exceeded by 750 bytes at baseline and 738 bytes after B-001; `pnpm build` still exits 0.
- The initial root import omitted Git tracking for `pnpm-lock.yaml` because the inherited ignore rule suppressed it. The lockfile has been restored from the exact upstream checkout, the corrected locked baseline was tagged/pushed, and the extracted lockfile is committed at `085a1b89`. A fresh empty package store was not used; native lifecycle scripts were disabled. The minimal-core dummy provider/tool/client smoke, broader M1 removals, full contract/license mapping and idle-RSS/runtime measurements remain open. No live provider or device capability was tested.

### B-002 native application source and build-closure removal — 2026-10-23

- Deleted `apps/android`, `apps/ios`, `apps/macos`, `apps/macos-mlx-tts`, `apps/shared`, `apps/swabble`, and `apps/.i18n/native`; retained `apps/linux` Tauri. The six native package roots contained 2,878 tracked files / 47,977,106 bytes at the pinned baseline. The complete working diff currently contains 3,146 deletions across source, native-only tests/assets, workflows and helpers.
- Moved shared tool-display metadata to `ui/src/lib/chat/tool-display.json`, preserved the Apple device identifier attribution beside its retained UI helper, and retained the Mermaid notices while deleting only the Apple renderer. Removed native-only protocol generation/build hooks and app-only workflows/jobs. Shared Node/core security checks, Tauri release, Docker, non-native release validation and Mac host Node tests remain.
- No pnpm workspace project or external Node dependency was removed. A fresh frozen install with lifecycle scripts disabled passed on Node 26.3.1 (1,473 packages, 188 workspaces). A full build on Node 26.3.1 passed in 1m52.2s. The generated `dist` has 20,044 files / 380,031,790 bytes; this is not a controlled before/after native-pruning comparison. Startup JavaScript remains 374,181 bytes gzip against the 373,454-byte budget.
- Focused core/plugin/Gateway/config/security/UI/build tests passed 109 tests across 8 files. Targeted package-script, release-preflight, workflow absence, release-plan, native release preparation, and CI planner suites passed; full release continuation passed 21 tests. `test/scripts/ci-pruned-native-workflows.test.ts` checks removed app paths and retained shared jobs.
- The first Node 24.21.0 build reached the final build-stamp step but failed the repository input-stability check (`Build inputs changed during preparation; rerun the build`). After the working tree stabilized, a complete rerun passed in 3m06.6s. The Node 22.23.1 declaration-input regression test passes after explicitly recognizing experimental `node:sqlite`, which Node 22 omits from `builtinModules`.
- `ci-workflow-guards` passed 140 tests; 9 checkout-fixture cases failed because sandbox process-census calls returned `EPERM`, and 8 were skipped. Its ignored `.artifacts/ci-checkout` fixtures were left untouched. An earlier broad run (658 passed / 457 failed / 10 skipped) predates workflow cleanup and is historical only.
- Real versus mock: no inference, persistent memory, or device capability was exercised. No hosted CI or hardware smoke ran. B-002 is locally verified; G1 remains incomplete pending the minimal-core dummy agent/session/tool/plugin/Gateway smoke, security-contract checks, final absence scans, controlled artifact comparison, and extraction report. No incomplete milestone has been pushed.

### B-003 bundled GitHub link-reader plugin — 2026-10-23

- Removed the `@openclaw/github` plugin source, icon/activity assets, package manifest, plugin reference/guide and its labeler rule. The package had only `@openclaw/plugin-sdk` as a workspace development dependency and no external runtime dependency. Its baseline footprint was 23 tracked files / 221,713 bytes; the lockfile importer was removed, leaving 187 workspace projects and unchanged dependency resolutions.
- Regenerated and checked the bundled plugin inventory; removed the obsolete GitHub-reader panel documentation and replaced stale plugin examples in active CLI docs. The generic plugin link-reader SDK/capability remains available for external plugins. This batch removes the reader extension, not the separate core GitHub publication workflows, which remain mapped for a later tool-pruning batch.
- `pnpm plugins:inventory:check` passed. Targeted Vitest suites passed 122 tests across plugin build-entry, install/uninstall, and UI skill catalog files. The default sandbox run had one OS process-census `EPERM`; that exact test passed on a retry with the required process-inspection permission. Frozen install passed at 187 workspaces. Full Node 24.21.0 build passed in 3m47.2s; the existing startup JavaScript warning remains at 374,181 bytes gzip against a 373,454-byte budget. `git diff --check` passed.
- Real versus mock: this batch contains no inference or external GitHub API check. G1 remains open for the final clean build, broader coding/channel/media pruning, minimal-core smoke, policy checks, artifact comparison, and extraction report.

## First-session evidence to fill

### Planning correction — 2026-10-22

- Creator-authorized sequencing clarification: G4 accepts T01–T10 and T13–T14; T11–T12 remain pending M5 and require real proof at G5. All T01–T14 remain mandatory at G8, including final UI and real-device verification.
- Updated the implementation plan, tool manifest, test strategy and capability matrix to use this allocation. The matrix contains planning statuses only; no capability is verified.
- Documentation-only correction; no implementation milestone started, upstream SHA pinned, runtime tests run or live capability claimed.
- Validation: Python `csv.DictReader` assertions passed for 14 rows, correct G4/G5 allocation, consistent columns and all capabilities `NOT_STARTED` with empty verification dates/evidence. `rg -n` review confirmed consistent gate wording across the four updated documents. Runtime tests are not applicable to this planning correction.

### Implementation evidence template

```text
Date/time:
Executor / code branch:
Milestone:
Upstream URL/tag/full SHA:
Host/OS/runtime versions:
Changes and deletions (paths + commit refs):
Artifact paths / build commands:
Tests run and actual result:
Tests skipped and why:
Live vs mock features:
Baseline vs extracted resource numbers:
Security and license checks:
Known failures / unresolved risks:
Next milestone proposal:
STOPPED AT G? — awaiting review
```

## Release blockers tracker

| ID    | Blocker                                                      | Affects | State                      | Owner/evidence                                                                                                  |
| ----- | ------------------------------------------------------------ | ------- | -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| B-001 | Complete importer, dynamic-discovery, contract and license map | M0/M1   | Open                       | Codex to resolve                                                                                               |
| B-002 | Taste Skill visual direction not yet selected                | M6      | Planned art-direction gate | Build 2–3 options, creator selects, document tokens in `docs/UI_DESIGN_SYSTEM.md`; previous screenshot optional |
| B-003 | Private model + Google OAuth credentials not yet provisioned | M2/M4   | To verify                  | Creator/Codex guided setup                                                                                      |
| B-004 | Actual MacBook/iPhone/Tailscale/PWA acceptance not run       | M7      | To verify                  | Device tests                                                                                                    |

Mark each resolved only with actual evidence. Never pre-mark passing tests.

G1 FAILED — work remains
