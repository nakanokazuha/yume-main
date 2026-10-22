# 17 — Build Status / Implementation Evidence

**Current status:** M0 audit in progress; G0 not passed. No Yume source extraction or application implementation has occurred.

**M0 audit activity (2026-10-22):** Official OpenClaw `v2026.10.5` commit `1b58cb9a1b4f4353e1add63c8506db4d890962e8` resolved and shallow checked out under `/private/tmp/openclaw-yume-m0`. Frozen install passed using pnpm 12.9.0. Focused baseline tests passed: 40 tests in `packages/agent-core/src/agent-loop.test.ts`, `packages/plugin-sdk/tests/security-runtime.test.ts`, and `packages/gateway-protocol/src/frame-guards.test.ts`. Full build generated main/package/extension bundles, then stalled in `write-unified-entry-dts`; it was interrupted after the runner reported 110.5 seconds without output. A retry was blocked by the retained `.artifacts/dist-artifacts.lock`; the owner PID was absent, but process-list inspection was denied, so the lock was not removed. Full build did not pass. Inventory and removal proposal are initial drafts; importer, dynamic-discovery, contract, and full license mapping remain incomplete. No upstream source was deleted. Target Mac mini hardware, Rust toolchain, model credentials, Google OAuth and device access remain unverified.

| Milestone | State | Gate | Notes |
|---|---|---|---|
| M0 Audit & baseline | INCOMPLETE | G0 | Pin/install and focused tests evidenced; full build and complete import/license audit outstanding; removal proposal awaits review |
| M1 Physical extraction | NOT STARTED | G1 | Requires deletion ledger + absence proof |
| M2 Runtime & extensions | NOT STARTED | G2 | Real inference required |
| M3 Character & memory | NOT STARTED | G3 | Persistent grounded memory required |
| M4 Personal tools | NOT STARTED | G4 | T01–T10 and T13–T14; T11–T12 pending M5 |
| M5 Scheduler & evolution | NOT STARTED | G5 | T11–T12 real scheduling proof; host-run jobs & reflection |
| M6 Full functional UI | NOT STARTED | G6 | Shared React UI |
| M7 Local Tauri/PWA packaging | NOT STARTED | G7 | Mac mini, MacBook, iPhone Tailscale |
| M8 MVP acceptance | NOT STARTED | G8 | All mandatory tests real |

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

| ID | Blocker | Affects | State | Owner/evidence |
|---|---|---|---|---|
| B-001 | Upstream source not yet pinned/audited | M0 | Open | Codex to resolve |
| B-002 | Taste Skill visual direction not yet selected | M6 | Planned art-direction gate | Build 2–3 options, creator selects, document tokens in `docs/UI_DESIGN_SYSTEM.md`; previous screenshot optional |
| B-003 | Private model + Google OAuth credentials not yet provisioned | M2/M4 | To verify | Creator/Codex guided setup |
| B-004 | Actual MacBook/iPhone/Tailscale/PWA acceptance not run | M7 | To verify | Device tests |

Mark each resolved only with actual evidence. Never pre-mark passing tests.

G0 FAILED — work remains
