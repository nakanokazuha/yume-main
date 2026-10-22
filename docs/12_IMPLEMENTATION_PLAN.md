# 12 — Implementation Plan: M0–M8 (Private MVP v0.1)

## Execution model

- Milestones are **sequential acceptance gates**, but each milestone produces a tested vertical slice rather than only interfaces.
- **One milestone per Codex implementation session by default**. For initial repository setup, do M0 only; stop and submit audit for approval. Do not treat this document as blanket authorization to delete upstream source.
- Each gate requires: working artifact, tests **actually run**, risk/update report, updated `17_BUILD_STATUS.md`, and no hidden mock feature classified as working.
- The creator approves M0's deletion proposal before M1 extraction. A subsequent major architecture departure needs a new ADR.
- **Only G8 is MVP**, not G2 (agent runs), G3 (memory), or G6 (UI shell).

## Dependency / release flow

```text
M0 Audit → G0 (approve removal map)
   ↓
M1 Physical core extraction → G1
   ↓
M2 Real agent + plugin/gateway runtime → G2
   ↓
M3 Personality + memory → G3
   ↓
M4 Real personal tools → G4
   ↓
M5 Scheduler + evidence-based reflection → G5
   ↓
M6 Fully wired shared UI → G6
   ↓
M7 Private MacBook Tauri + iPhone PWA deployment → G7
   ↓
M8 End-to-end acceptance + hardening → G8 = PRIVATE MVP
```

### M0 — Pin, Inspect, Baseline, Inventorize

**Objective:** know exactly which OpenClaw capabilities form the minimal agentic foundation, and what must be physically removed.

- Choose and pin upstream **actual immutable SHA**, tag/release, relevant Node/pnpm/Rust requirements. Verify licensing, notices and compatibility.
- Obtain source, build/test untouched version, collect baseline dependencies, artifact sizes, startup and memory metrics where feasible.
- Inventory actual modules/dependencies/dynamic imports/build scripts and annotate `KEEP/EXTRACT/REMOVE/REPLACE` in `templates/COMPONENT_INVENTORY.csv`.
- Map exact agent loop, provider transport, sessions, tool/skill registry, SDK/plugin manifest, Gateway client, permissions, scheduler roots. Cross-check U-01...U-12.
- Produce proposed `M0_AUDIT_REPORT.md`, `M1_REMOVAL_PROPOSAL.md`, issue/ADR list and initial `REMOVAL_LEDGER.csv` with no claims of executed deletion.
- Verify private Mac mini/MacBook/iPhone environment and provider connectivity requirements. Check UI reference file availability.

**G0 PASS iff:** pinned source + baseline reproducible, inventory and import graph sufficiently complete, deletion plan reviewed, critical interface tests identified, legal notices accounted for. **Creator approval before M1**.

### M1 — Physical Slimming & Core Extraction

**Objective:** deliver a genuinely smaller source/build artifact, not full OpenClaw with disabled features.

- Work in reviewable deletion batches. Remove out-of-scope channels/apps/coding tools/media engines/unselected providers/onboarding/assets/build targets and orphan dependencies.
- Rework only necessary hardcoded imports to preserved upstream-style SDK boundaries. Maintain physical absence proofs and rollback commits.
- Preserve full minimal agent/policy/session/plugin/gateway seam; create tiny dummy provider/tool/safe client smoke.
- Clean lockfile install and build; static ref checks and artifact/bundle contents; compare before/after real measurements.

**G1 PASS iff:** reduced sources and shipped artifacts verified, no imports to removed paths, baseline core tests pass, plugin attachment works, security policies preserved, `M1_EXTRACTION_REPORT.md` and ledger complete. A mock agent smoke here is acceptable; real provider comes in M2.

### M2 — Core Runtime, Real Inference & Extension Host

**Objective:** usable end-to-end agent **before** full Yume intelligence.

- Configure one authorized real model/provider, token-safe host secret management, streaming, timeout/cancel, selected tool protocol, approvals and persistent thread history.
- Retain minimal external Gateway client API or a compatible narrow facade; connect diagnostic web chat.
- Register/deregister a separately packaged dummy plugin; run policy, version mismatch and restart tests.
- Never claim ChatGPT consumer subscription equals generic model API credentials. If real provider isn't connected, **G2 blocked**.

**G2 PASS iff:** real model replies in diagnostic UI, stream/tool-calling works with approved dummy tool, sessions survive restart and cancellation/reconnection, tool policy enforced, extensibility conformance proven.

### M3 — Yume Identity, Weighted Personality & Memory

**Objective:** establish coherent personal continuity.

- Implement versioned core identity + editable baseline weights; dynamic mood state + relationship/character storage and validated context builder.
- Integrate **one** persistent episodic memory provider (Mem0 OSS target) through retained extension seam; retrieval, provenance, correction/delete, migration.
- Define/emit optional expression metadata without actual speech/avatar renderer.
- Build diagnostic memory/character panel or tests now, before final UI, to prove real behavior.

**G3 PASS iff:** persistent memory recall and correction across sessions/restarts; personality weights reliably affect response; state remains bounded, identity remains consistent; retrieved instructions cannot bypass tool policy.

### M4 — Personal Assistant Tools & Google Integrations

**Objective:** real personal tools T01–T10 and T13–T14, independent from coding workflows. Durable reminders and recurring schedules (T11–T12) are implemented and accepted at M5/G5.

- Implement/attach web search/fetch, private notes, scoped local document read, Gmail, Google Calendar, Google Drive, generic MCP/HTTP capability seam and approval UI.
- OAuth is host-side with minimum scopes; create connector status and exact action previews.
- Expose no GitHub/shell/coding tools. Tool installation is operator-only.
- Record real per-tool results and acceptance gates in `templates/CAPABILITY_MATRIX.csv`; T11–T12 remain pending M5 at G4.

**G4 PASS iff:** T01–T10 and T13–T14 meet their required integration scenarios (including the test-only SDK demonstration allowed for T13), no write action bypasses approval, and removed coding tools are absent from user-facing registry and shipped runtime dependencies. T11–T12 are pending M5, not failed or complete at G4; all T01–T14 remain mandatory for G8.

### M5 — Durable Scheduler, Reflection & Proactivity

**Objective:** Yume remains useful and stateful without an open UI.

- Implement and record real capability proof for T11–T12: durable reminders/timers/recurring schedules and daily agenda, original timezone + UTC, quiet hours, backoff, host restarts and dedupe.
- Add post-turn evaluator (async) with sourced interaction events, evidence validator and bounded relationship update.
- Add scheduled slow reflection, NO_CHANGE, snapshot, freeze, rollback and inspector audit.
- Opt-in proactive actions only; no engagement nudges.

**G5 PASS iff:** T11–T12 meet their real integration scenarios, including live reminders/timers and recurring jobs firing on the host while clients are closed, reboot missed-job reconciliation without duplicate action, correct timezone and quiet-hours behavior, and working agenda/create/list/update/cancel operations with required confirmations. Reflection accepts/rejects evidence correctly, rollback is exact and chat is unaffected by evaluator failure. Record T11–T12 results in `templates/CAPABILITY_MATRIX.csv`; final UI and real-device verification remain required at G6–G8.

### M6 — Complete Functional UI (shared React)

**Objective:** full everyday interface, not a mock or dead wireframe.

- **Reopen art direction** per `20_UI_ART_DIRECTION.md`: install/verify Taste Skill, explore 2–3 coherent visual directions from realistic chat/phone/secondary screens and record creator approval before final token system. The old screenshot is optional historical reference for compactness, **not a visual lock**. One React/Vite/TS app for MacBook Tauri and iPhone PWA.
- All six UI sections working: chat, tools, memory, character, agenda, settings/status. Real streaming/approvals, errors, network states, accessible responsive mobile.
- Implement API/event adapters rather than importing backend source. Only show supported features; hide unfinished voice/avatar controls.

**G6 PASS iff:** all MVP user journeys work via connected actual UI on desktop/mobile browser; no mandatory action requires manual CLI; a creator-approved Taste Skill visual direction and `docs/UI_DESIGN_SYSTEM.md` exist; visual anti-vanilla rubric, accessibility, real viewport review and functional flows pass. The former screenshot is optional and its absence is not a blocker.

### M7 — Fully Local Packaging & Cross-Device Access

**Objective:** Mac mini host + MacBook Tauri + iPhone installed PWA, all privately connected.

- Auto-start and supervise host on Mac mini; serve PWA assets and protected API through validated private HTTPS/Tailscale ingress.
- Package/launch MacBook Tauri v2 app; configure iPhone PWA manifest/service worker/installability and real device pairing.
- One thread/memory/agenda across devices; explicit host-down/offline status; secure local backups and restore; OAuth token refresh and credential store.
- Test Wi-Fi/mobile tailnet, service restart, client reopen and access revocation; confirm no public exposure.

**G7 PASS iff:** actual MacBook and iPhone clients work end-to-end, data syncs through one host, host survives client closure and restarts, auth/network restrictions hold, backup/restore rehearsal passes.

### M8 — Private Pilot Acceptance & Release

**Objective:** prove real complete MVP in creator's environment, no new major features.

- Run `13_TEST_STRATEGY.md` mandatory scenarios end-to-end; ensure T01–T14 real proof and full UI functionality.
- Threat model check, plugin isolation, session/memory/approval/job idempotency, resource measurements and startup stability.
- Resolve release blockers, tag immutable pilot version, record provider/config hashes, take baseline state/data backup.
- Prepare small feedback/pilot log; optional later 28-day observational personal pilot, no scientifically overstated causal claims.

**G8 PASS iff:** all mandatory scenarios pass on real devices/providers, no placeholder/mock critical path, documented residual non-blocking risks, recovery and consent complete. **Only then label Yume Private MVP v0.1.**

## Cross-milestone Definition of Done

- Commands and outcomes logged, no invented test passes.
- Changed + deleted paths documented; no unapproved scope expansion.
- Auth, credentials, model/tool external data flow reviewed.
- Fast core tests + integration tests relevant to the milestone pass.
- Documentation, migration and ADR updates included; next milestone gated explicitly.
