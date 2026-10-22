# Yume — Private Pilot Architecture & Codex Handoff

**Spec version:** 2.1 (2026-10-15, Asia/Tokyo)  
**Status:** implementation-ready planning package; **no extraction has been executed**.  
**Maintainer:** Yume creator. **Audience:** Codex (builder) and creator (reviewer).

## Start here

This ZIP contains **planning and instruction files, not an implemented OpenClaw fork**. Create an empty private repository and copy all files into its root. **The previous Yume UI mockup is no longer the mandatory visual reference.** At M6, use **Taste Skill** in Codex to explore and implement a distinctive, compact, androgynous visual direction. Optional previous images can be placed in `assets/reference-ui/` **as density/composer references only**. See `docs/20_UI_ART_DIRECTION.md`.

Codex should read, in order:

1. [`AGENTS.md`](AGENTS.md) — non-negotiable operating rules; scope and milestone stopping rule.
2. [`docs/00_PRODUCT_CHARTER.md`](docs/00_PRODUCT_CHARTER.md) — product and MVP boundaries.
3. [`docs/01_SYSTEM_ARCHITECTURE.md`](docs/01_SYSTEM_ARCHITECTURE.md) — local-only topology and ownership.
4. [`docs/02_UPSTREAM_CONTRACTS.md`](docs/02_UPSTREAM_CONTRACTS.md) — OpenClaw mechanisms to preserve.
5. [`docs/03_PHYSICAL_SLIMMING.md`](docs/03_PHYSICAL_SLIMMING.md) — **real removal**, not feature toggles.
6. [`docs/12_IMPLEMENTATION_PLAN.md`](docs/12_IMPLEMENTATION_PLAN.md) — M0–M8 gated roadmap.
7. Relevant feature specs and templates, before touching that feature.

Read [`docs/18_SOURCES_AND_VALIDATION.md`](docs/18_SOURCES_AND_VALIDATION.md) for upstream references. OpenClaw releases, symbols, and directories may change: inspect the **pinned upstream commit**, not current `main`, before asserting what code exists.

## Locked direction

- **Physically extract and slim OpenClaw** to its required agentic core: remove unused source, packages, shipped integrations, dependencies, assets, scripts, and build targets. Preserve its extension architecture/attachment mechanisms, **not** the unnecessary implementations.
- **Modular Yume**: separate personality, mood, relationship, memory, reflection, tools, UI, and future voice/avatar integrations.
- **Private, single-user MVP** before thinking about OSS, sales, public hosting, or SaaS.
- **Mac mini as always-on personal host** (verify target hardware at setup); **MacBook client via Tauri v2**; **iPhone installable PWA**; shared React/TypeScript UI. **No Vercel, no public deployment**.
- User-facing **personal assistant**, not coding agent. No GitHub/coding shell/IDE/developer-workflow tools in MVP. Runtime may internally require trusted host operations; those are not LLM-exposed shell tools.
- MVP needs **real chat, complete usable UI, real personal tools, persistent memory, weighted personality, bounded evolution, scheduling/proactivity, cross-device use**, testing and recovery.
- **No avatar, STT, TTS, or live voice in MVP**. Preserve typed extension seams for later. Apple ecosystem integrations are post-MVP.
- **Taste Skill–led UI direction at M6:** functional spec is fixed, visual execution is deliberately open. Prior mockup is *not* a design lock; compact density and assistant-first interaction remain requirements.
- **Local-hosted ≠ offline LLM**: remote model or embedding providers are allowed with consent, securely managed credentials, explicit network data flow, and no misleading offline claim.

## Package map

| File | Why it exists |
|---|---|
| `AGENTS.md` | Codex working contract and stop gates |
| `docs/00_PRODUCT_CHARTER.md` | Vision, scope, non-goals, success |
| `docs/01_SYSTEM_ARCHITECTURE.md` | Runtime, deployment, data boundaries |
| `docs/02_UPSTREAM_CONTRACTS.md` | Upstream APIs/interfaces that must survive |
| `docs/03_PHYSICAL_SLIMMING.md` | Auditable hard removal playbook |
| `docs/04_MODULE_CONTRACTS.md` | Lifecycle, schemas, versioning, boundaries |
| `docs/05_INTELLIGENCE.md` | Personality/state/evolution rules |
| `docs/06_MEMORY_AND_DATA.md` | Canonical stores, migrations, privacy |
| `docs/07_MVP_TOOLS.md` | Personal tool manifest and acceptance |
| `docs/08_UI_TAURI_PWA.md` | Shared UI + MacBook Tauri + iPhone PWA |
| `docs/09_LOCAL_SECURITY_DEPLOYMENT.md` | Mac mini, Tailscale, auth, backup |
| `docs/10_API_EVENTS.md` | Typed application-facing envelopes |
| `docs/11_FUTURE_EXTENSIONS.md` | Apple integrations, voice, avatar after MVP |
| `docs/12_IMPLEMENTATION_PLAN.md` | M0–M8 scopes, deliverables and gates |
| `docs/13_TEST_STRATEGY.md` | Test matrix and quantitative evidence |
| `docs/14_UPSTREAM_MAINTENANCE.md` | Origin tracking, fixes, license compliance |
| `docs/15_MIGRATION_FROM_V0.md` | Preserved/replaced prior pilot decisions |
| `docs/16_DECISIONS.md` | ADRs and open research questions |
| `docs/17_BUILD_STATUS.md` | Session-by-session status and evidence |
| `docs/18_SOURCES_AND_VALIDATION.md` | Upstream authoritative links |
| `docs/19_CODEX_SESSION_GUIDE.md` | Start prompts, handoff format, gate discipline |
| `templates/COMPONENT_INVENTORY.csv` | M0 artifact template |
| `templates/REMOVAL_LEDGER.csv` | M1 deletion audit template |
| `templates/CAPABILITY_MATRIX.csv` | MVP tool proof template |
| `assets/reference-ui/README.md` | Optional older UI screenshots; not binding visual designs |
| `docs/20_UI_ART_DIRECTION.md` | Taste Skill workflow, design explorations, anti-vanilla visual bar |

## Important distinction

**Blueprint ≠ proof.** Statements marked *proposed*, *candidate*, or *verify at M0* require source inspection and tests. The source inventory and deletion ledger are intentionally **templates**; no fake source-level audit is included. Do not treat TODOs as completed features.

## First Codex run

Begin with **M0 only**; do not execute core removals in that session. Create the repo, pin the upstream commit, inventory it, run a baseline, and submit a reviewable report. Proceed to M1 only after approval of the removal plan. See [`docs/19_CODEX_SESSION_GUIDE.md`](docs/19_CODEX_SESSION_GUIDE.md).
