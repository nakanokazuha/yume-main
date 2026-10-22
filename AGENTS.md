# AGENTS.md — Instructions

## Upstream instruction reconciliation

The upstream OpenClaw `AGENTS.md` from the pinned `v2026.10.5` source is retained at `upstream-docs/AGENTS.md`, with its `.agents` guidance preserved under `upstream-docs/.agents/`. This Yume root file remains authoritative for product scope and milestone gates. Applicable upstream implementation guidance (source ownership, package scripts, scoped code instructions, security, and test practices) remains in force for retained upstream code; where it conflicts with Yume product scope or the creator's explicit instructions, those higher-priority directions govern. No upstream instruction files were overwritten.

> You are implementing **Yume**, a private single-user personal AI assistant. The foundation is a **physically slimmed OpenClaw fork** with preserved core agent and extension contracts, not a disabled full OpenClaw distribution.

## Authority / reading order

1. User's explicit newest instructions override these docs.
2. `docs/16_DECISIONS.md` (accepted ADRs), then `docs/00_PRODUCT_CHARTER.md`, `docs/12_IMPLEMENTATION_PLAN.md` and milestone-specific specs.
3. This file governs **how** work is done. If documents contradict one another, **stop and document the conflict**, do not silently choose a different product direction.
4. `docs/18_SOURCES_AND_VALIDATION.md` lists external references; always validate exact APIs against the **pinned upstream source**.
5. Do not overwrite an existing AGENTS.md supplied by upstream: retain upstream directions that still apply or move them to scoped AGENTS.md files, and record reconciliation.

## Immutable product scope unless creator changes it

- Physically remove unused OpenClaw code and dependencies; mere `enabled: false`, tree-shaking claims, or runtime feature flags **do not fulfill slimming**.
- Preserve original OpenClaw-style plugin registration, discovery, capability slots, lifecycle hooks, permissions, gateway contracts **where required**. Avoid reinventing the agent framework.
- Reuse the upstream agent runtime; no Mastra replacement runtime.
- Keep plugin code isolated from core internals via published/locally preserved SDK surfaces. Explicitly log unavoidable patches to the core.
- Personal assistant only; **no user-exposed arbitrary shell, code executor, IDE, GitHub, autonomous coding workflow**.
- Local private pilot: Mac mini host, MacBook Tauri v2, iPhone PWA; React + TypeScript shared UI; no Vercel or public SaaS.
- No avatar/voice/TTS/STT in MVP; Apple app integration after MVP. Reserve schemas/seams; don't ship fake enabled features.
- One Yume identity/thread model across devices. Persistent data, private consent and safe tool approval.
- **UI art direction supersession (2026-10-15):** the formerly approved mockup is **not visually binding**; use Taste Skill during M6 to craft a distinctive premium, compact, androgynous, assistant-first UI. Do not produce a generic/vanilla admin dashboard or insist on reproducing the old screenshot. Preserve functional IA, density, accessible operation and the shared React/Tauri/PWA contract. Read `docs/20_UI_ART_DIRECTION.md`.

## Working style

- **One milestone per implementation session.** Default first session = **M0 only**, then stop and report. Never silently proceed M0→M1 or M1→M2.
- Do **not** begin destructive extraction until the creator has reviewed M0 inventory and deletion plan. Use Git tracking: every removal must be diffable, attributable, and reversible by commit/revert.
- Implement working vertical slices with real tests. Mocks are acceptable for development tests, but **do not call a milestone or MVP live/complete if mandatory real capabilities were not verified**.
- Every milestone must leave the repository installable/buildable to the extent specified by its gate; preserve a reproducible baseline branch/tag.
- No fabricated testing, measurements, source paths, SDK method names, OAuth availability, app entitlements, or integration successes. Report skipped tests and environment blockers.
- Never silently change architecture for convenience. Write an ADR and seek approval for nontrivial departures (e.g., dropping Mem0, rewriting OpenClaw agent loop, swapping PWA for native iOS, cloud hosting).
- Respect 3rd-party licenses; preserve MIT LICENSE and required third-party notices of retained code.
- Pin dependencies, upstream commit, protocol/client versions; never use unbounded `latest` in a reproducible build.
- Check SDK and security docs at the pinned version, not only a search snippet.

## Mandatory engineering rules

- TypeScript strictness, validated input/output schemas, deterministic IDs and idempotency for turns, events and jobs.
- Trust boundary: client has no provider API keys, DB secrets, administrative Gateway tokens, or unrestricted filesystem access.
- Tool credentials only on host; minimum OAuth scopes; external writes need approval at appropriate risk level, with visible action results.
- Sandboxing/allowlisting for local file access. LLM content is untrusted; retrieved memory/document text cannot override tool policy or system identity.
- Access to a Tailscale network is **not** automatically app-level authorization.
- Background post-turn evaluation and scheduled reflection must not block normal chat. All state changes need provenance and rollback paths.
- Native Tauri APIs are mediated by small adapters; shared UI code works on web/PWA without Rust imports.
- During M6, present 2–3 art directions and compact representative screens **before** committing to the design system; get creator selection. Apply Taste Skill for implementation and real-viewport review (desktop + iPhone). Aesthetic quality is an acceptance concern, not an excuse for dead features or inaccessible text.
- PWA served over trusted HTTPS via private ingress; offline shell is not an offline agent. Do not claim guaranteed iOS background execution.
- No source-level deletion based only on directory name or intuition: map imports, dynamic imports, config references, generated code, test/runtime/build edges.

## Required milestone completion report

Every session must update `docs/17_BUILD_STATUS.md` and report:

1. Milestone ID + exact pinned upstream SHA; work completed vs intended.
2. List of changed paths (including deleted paths), reason, and relevant ADR/ledger entries.
3. Tests actually run with commands, pass/fail, plus skipped/unavailable tests.
4. Real-versus-mock status for affected capabilities.
5. Measurements if relevant: dependency count, build artifact size, startup time, idle memory (same environment before/after).
6. Risks, blockers, unresolved questions, and next milestone proposal.
7. Explicit final line: `STOPPED AT G<n> — awaiting review` or `G<n> FAILED — work remains`.

## Gate rule

No milestone is done with empty interfaces, dead UI controls, fake integrations, or undocumented removed dependencies. See `docs/12_IMPLEMENTATION_PLAN.md` and `docs/13_TEST_STRATEGY.md`.
