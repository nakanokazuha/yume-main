# 19 — Codex Execution Sessions & Handoff

## Session 0: after creator makes private repository

Copy this ZIP into the new repo root. An older UI screenshot can be provided *optionally* under `assets/reference-ui/` for density/layout history; it is **not required or binding**. M6 will use Taste Skill for visual exploration. Commit planning baseline. Then send Codex:

> Read `AGENTS.md`, `README.md`, `docs/00_PRODUCT_CHARTER.md`, `docs/02_UPSTREAM_CONTRACTS.md`, `docs/03_PHYSICAL_SLIMMING.md` and `docs/12_IMPLEMENTATION_PLAN.md` in full. Implement **M0 ONLY**. Inspect/pin official OpenClaw source, run baseline tests, map exact source and dependencies into `templates/COMPONENT_INVENTORY.csv`, propose a physical deletion plan using the template ledger, and draft `M0_AUDIT_REPORT.md` + `M1_REMOVAL_PROPOSAL.md`. Do not delete upstream code in this session. Update `docs/17_BUILD_STATUS.md`; report actual commands/tests, blockers and next step; STOP at G0 and request review of extraction plan.

## Session M1: only after G0 approval

> Implement **M1 ONLY** following the approved `M1_REMOVAL_PROPOSAL.md` and `docs/03_PHYSICAL_SLIMMING.md`. Perform actual physical removal of out-of-scope source/dependencies/build artifacts in reviewable batches, keep specified SDK/agent/session/gateway/security contracts, collect absence proofs and before/after metrics, fill `templates/REMOVAL_LEDGER.csv`, run all G1 tests, write `M1_EXTRACTION_REPORT.md`, update status and STOP at G1.

## Session M2 onward

> Read `AGENTS.md`, `docs/12_IMPLEMENTATION_PLAN.md`, and the documents relevant to milestone M<n>. Implement **only M<n>**, deliver the runnable vertical slice and real gate-specific evidence. Update docs/build status and any ADRs, disclose skipped tests, and STOP at G<n> until review. Do not add future features early or claim mock as real.

## Standard final report (Codex output)

```markdown
# M<n> Implementation Report
- Pinned upstream SHA / current Yume commit:
- Scope delivered:
- Files added/changed/deleted:
- Interface/contracts preserved or modified:
- Physical removal proofs + measurements (if M1):
- Tested commands and exact outcomes:
- Real/mocked dependencies and connected providers:
- Security/privacy/license checks:
- Known limitations / release blockers:
- Required creator actions (credentials/UI image/consent/device tests):
- Gate verdict: PASS / FAIL / BLOCKED
- Next gate proposal:
STOPPED AT G<n> — awaiting review
```

## No repo yet? Fine.

This is **documentation-only**; source checkout, Taste Skill art-direction exploration and subsequent creator-approved design, provider credentials and user device environment belong to later Codex implementation. No need to invent them inside this ZIP.
