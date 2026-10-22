# 15 — Migration of Previous Yume v0 Pilot Requirements

This document keeps valuable **behavioral requirements** from the October 9–10 Yume v0 plan without accidentally retaining its superseded technology stack.

## Preserved in new architecture

| Previous plan concept | New ownership / milestone |
|---|---|
| Immutable core identity (`tsundere`, `playful`, `direct`, `caring`, `curious`) | Character extension M3 |
| Weighted effective personality + dynamic mood | Context/state engine M3 |
| Relationship (`familiarity`, `trust`, `attachment`, `comfort`, `unresolved_conflict`) | State M3, validated evaluator M5 |
| Slow character (`openness`, `expressiveness`, `patience`, `vulnerability`, `confidence`, `assertiveness`) | Store M3, reflection M5 |
| Evidence-based reflection, NO_CHANGE, caps, idempotency, snapshots/rollback | M5 + state inspector M6 |
| Mem0 OSS episodic memory with grounded retrieval/correction | Single memory adapter M3 |
| Structured expression metadata for future voice/avatar | Typed event seam M3, no renderer in MVP |
| Durable reminders, schedules, opt-in proactivity, quiet hours | M5 |
| Single main Yume identity + practical utility | All milestones |
| 28-day personal pilot, utility vs continuity | Optional after G8, tracked as observation |

## Replaced / superseded decisions

| Previous v0 decision | New locked decision |
|---|---|
| Node + Mastra as new agent engine | Extracted **OpenClaw agentic core** and preserved extension SDK |
| Full Tauri client with React/Vite only | Shared React/Vite/TS UI; **MacBook Tauri** + **iPhone PWA** |
| Some early references to Vercel/web deployment | **Private locally hosted Mac mini only**, Tailscale private access; **no Vercel** |
| Voice within pilot scope | **No STT/TTS/live voice in MVP**, future phase |
| UI mock test could be early pilot outcome | **Full functional UI** mandatory by G8 |
| General-purpose tool/agent capabilities implied | Personal tools only; **coding/GitHub/shell excluded** |
| Apple ecosystem connections possibly part of personal assistant scope | **Post-MVP** phase |

## Legacy rules still useful

- Persist user message before model invocation; no long DB transactions over inference.
- Prompt/model/identity/state version tracing for replay.
- LLM event output is a proposal to validator, not a direct SQL update.
- Freeze controls, truthful offline/live status, opt-in proactivity and user control.
- External inference may see selected context; local-first is not necessarily offline-only.

## Legacy assets

If the creator has the former `YUME_V0_PILOT_PLAN.md`, it may be kept under `archive/` as historical reference, but **these new docs and accepted ADRs are authoritative** when conflicts arise. The old UI screenshot is optional and no longer a design lock; Taste Skill design exploration and creator approval at M6 govern the actual visual system (see `20_UI_ART_DIRECTION.md`).
