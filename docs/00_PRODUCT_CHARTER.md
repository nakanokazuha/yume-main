# 00 — Product Charter & MVP Contract

## Identity

**Yume** is a long-lived, single-user, local-first **personal AI assistant** that helps with daily life rather than coding. Its distinguishing capabilities are practical tools, persistent grounded memory, a coherent weighted personality, and bounded evidence-based evolution. Yume is not a human or sentient being; mood/relationship fields are software state used for consistent expression, not literal emotions.

Design principle: **extract OpenClaw's proven agentic core; keep its sockets; remove unnecessary devices; attach Yume-specific modules**.

## MVP (v0.1) required outcomes

- Use real remote LLM inference (or later approved provider) with transparent provider/model status, streaming responses, conversation persistence, cancellation and retries.
- One coherent Yume identity on MacBook **Tauri desktop** and iPhone **installable PWA**, both connecting to the local Mac mini host.
- Full functional compact UI: chat, threads, tool executions/approval, memory controls, personality/character inspector, schedules, settings/status, recoverable errors.
- Weighted stable identity + dynamic fast mood + medium relationship + slow character; evaluation and rollback mechanisms; meaningful change only with evidence.
- Persistent conversation and personal episodic memory with search, correction/deletion, provenance and model-context retrieval.
- Personal-assistant tools listed **required** in `07_MVP_TOOLS.md`, genuinely integrated and tested; scheduling/reminders survive UI closure and host restart.
- Core and plugin system physically slimmed: **deleted** unwanted code, packages, assets and build targets, while preserved extension contracts pass tests.
- Single-user private setup, backups, authentication, permissions, privacy controls, documented recovery and bounded diagnostics.

## Non-goals for MVP

- No sale, public hosting, cloud frontend deployment, user registration/multi-tenant SaaS, payments, public app store release, published OSS distribution requirement.
- No GitHub, IDE, arbitrary shell as assistant tool, code execution workflows, agentic software engineering, or general-purpose automation marketplace.
- No Apple Calendar/Reminders/Notes/Shortcuts integrations yet. Future phase only.
- No speech-to-text, text-to-speech, realtime conversation, avatar renderer, camera, continuous audio or live video.
- No magical full offline intelligence: private hosting does not eliminate external LLM/embedding network flows.
- No unbounded self-editing prompts, forced personality drift or engagement/attachment optimization.

## Acceptance definition

Only **G8** in `12_IMPLEMENTATION_PLAN.md` earns the term "MVP complete". A running CLI agent, working Tauri shell, or attractive mocked UI by themselves are **not** MVP.

## Product requirements by priority

| Priority | Requirement | Acceptance owner |
|---|---|---|
| P0 | Safe minimal agent core + extension compatibility | G1–G2 |
| P0 | Real personal tools with scoped permissions | G4 |
| P0 | Memory + weighted personality + identity continuity | G3 |
| P0 | Durable scheduler + bounded evolution | G5 |
| P0 | Functional MacBook UI + iPhone PWA | G6–G7 |
| P0 | Security, restart, backups, no public exposure | G7–G8 |
| P1 | Observable expression metadata for later renderers | G3 |
| P1 | Pilot metrics, feedback, replay quality evaluation | G8 |
| Post-MVP | Apple integrations, audio, avatar, sellable/OSS | Future |

## Operating assumptions to validate at M0

- One private host (proposed Mac mini M1 16 GB); verify CPU, storage, OS, uptime capabilities and free resources.
- MacBook has compatible macOS/Xcode/Rust/Tauri toolchain; iPhone supports Home Screen PWA and is enrolled in the private tailnet.
- Provider API entitlements and OAuth grants must be verified; no assumption that a ChatGPT subscription is a generic model/embedding API.
- Prior approved Yume UI imagery is **optional, nonbinding visual reference**. The creator rejected its overly generic/vanilla look. At M6, use Taste Skill and the directions in `20_UI_ART_DIRECTION.md` to create/approve a revised visual identity. Preserve compactness, integrated composer and assistant-first product behavior.

## Change management

Any scope or provider change affecting core architecture requires a dated ADR in `16_DECISIONS.md` and a related milestone/gate update. Prefer smaller changes that preserve replacement/attachment seams.
