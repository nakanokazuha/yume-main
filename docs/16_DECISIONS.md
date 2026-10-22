# 16 — Architecture Decision Register

## Accepted decisions (2026-10-15)

| ADR | Decision | Why |
|---|---|---|
| ADR-001 | Use OpenClaw source as donor for minimal agentic core | Avoid rebuilding proven agent loop, tools, sessions from zero |
| ADR-002 | **Physical slimming**, not disabling features | Delete unneeded source/dependencies/assets while retaining extension sockets |
| ADR-003 | Preserve validated OpenClaw-style plugin SDK, Gateway and lifecycle contracts | Attach/detach modules without a new framework |
| ADR-004 | Isolate Yume personality/memory/reflection as modules | Replaceable and testable; future extensibility |
| ADR-005 | Private/single-user pilot on **personal Mac mini**; no Vercel/public hosting | Controlled environment before OSS/sale decision |
| ADR-006 | **MacBook Tauri v2** desktop, **iPhone PWA**; shared React + TypeScript | One functional UI codebase; no separate iOS native build initially |
| ADR-007 | MVP includes complete functional UI and **real personal assistant tools** | Useful daily-life assistant, not a CLI demo |
| ADR-008 | No user-facing coding, GitHub, IDE or arbitrary shell tools | Personal assistant scope; smaller and safer extracted core |
| ADR-009 | Apple app integrations, voice/TTS/STT and avatar **after MVP** | Modular extension approach and scope control |
| ADR-010 | Canonical sessions/state local; episodic memory via single adapter, Mem0 OSS target | Continuity and control; no duplicated memory truth |
| ADR-011 | Local-first may use remote model/embeddings with explicit disclosure | Host/data control ≠ model offline; no entitlement assumptions |
| ADR-012 | M0 requires source audit and removal-plan review before M1 physical deletion | Evidence-based safe extraction |
| ADR-013 | M8/G8 is **only** MVP acceptance gate | No fake completion of partial milestones |
| ADR-014 | **M6 UI art direction reopened**; use Taste Skill, not old mockup fidelity | Last UI was too vanilla/generic; preserve compact assistant-first UX but pursue distinctive premium design, creator chooses among candidate directions |

## Open technical questions (must resolve at specified gate)

| Question | Resolve at | Decision criteria |
|---|---|---|
| Exact pinned OpenClaw SHA/release and license inventory | M0 | Official stable source selected for audit: `v2026.10.5`, commit `1b58cb9a1b4f4353e1add63c8506db4d890962e8`; tag and detached checkout verified. Full license inventory and compatibility/build audit remain open before G0. |
| Exact minimum transport/Gateway subset | M0–M2 | Needed UI methods only, authenticated, preserves client behavior |
| Post-extraction package layout | M1 | Lowest divergence and passing tests, not aesthetics |
| Primary real LLM/tool-capable provider | M2 | Authorized API, budget, streaming/tool reliability |
| Mem0 OSS store + embeddings configuration | M3 | Verified package version, persistence/provenance/privacy/footprint |
| Google OAuth callback and scopes | M4 | Works from private HTTPS host with approved scopes |
| Reminder notifications on iPhone PWA | M5–M7 | Real device web push permission/behavior test; fallback documented |
| Tailscale Serve vs private TLS reverse proxy on Mac mini | M7 | Secure HTTPS, auth, WSS, correct macOS variant, iPhone access |
| Native Capacitor wrapper | Post-MVP only | Needed native capabilities, separate ADR |
| Taste Skill variant/version and final visual direction | M6 design spike | Verify official install; compare 2–3 proposals; creator approval, real-viewport checks |

## ADR addition template

```text
ADR-### — <short name>
Date / status: proposed | accepted | superseded
Context:
Options evaluated:
Decision:
Consequences / deleted dependencies / security:
Tests and evidence:
Affects milestone(s):
Approval:
```

Do not replace a locked decision silently. Record objections and seek creator approval for scope changes.
