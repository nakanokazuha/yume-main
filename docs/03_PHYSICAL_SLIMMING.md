# 03 — Physical Slimming & Core Extraction Blueprint

**Objective: physically delete unnecessary OpenClaw source and runtime/build dependencies while preserving a working core and extension sockets.** A disabled module does **not** count as slimmed. Feature flags may be used temporarily as intermediate migration scaffolding, but final M1 proof requires code/artifact removal.

## 0. Safety prerequisites

1. Fork from official upstream and **pin commit SHA + release/tag + repository URL + date** in `16_DECISIONS.md`.
2. Preserve an untouched upstream baseline branch/tag and third-party licensing notices.
3. Capture reproducible baseline: clean install, build, tests, runtime smoke, artifact size, dependency inventory, idle RAM, startup. Never invent unavailable metrics.
4. Create a complete inventory using `templates/COMPONENT_INVENTORY.csv`; include static imports, dynamic imports, runtime configuration, generated schemas, hidden build hooks, worker/service entrypoints, and dev/test dependencies.
5. Produce a removal proposal **before deleting**. Explicit creator review required for M1.

## 1. Reachability model: retain dependency closure of capabilities

Protected **roots** (abstract; map actual symbols during audit):

- minimal agent loop, model stream, tool invocation/policy, session/message persistence and context;
- plugin discovery, manifest parser, SDK exports, registrar, hook lifecycles and one real provider adapter;
- minimal authenticated Gateway/client transport + tools/approvals + configuration/health;
- host runtime and durable scheduler wiring; migration, backup and critical safety primitives;
- interfaces needed for later speech, voice, avatar events (contracts only, zero heavy implementations).

Compute a dependency closure `R` of these root symbols/entrypoints. Every edge into/from a candidate-removal subtree must be classified: hard runtime dependency, optional adapter, dynamic discovery, build-time, generated artifact, test-only, or dead code. If a root imports a removed concrete implementation, invert the dependency behind the existing slot/SDK facade **before removal**.

## 2. Physical-removal priority

| Class | Candidate examples | Preserve instead |
|---|---|---|
| Channels | WhatsApp/Telegram/Discord/etc implementations | Generic channel plugin registration/contract if part of retained SDK |
| App shells | Native client shells and built-in UI not used by Yume | Gateway client/transport contracts |
| Coding tools | Git, GitHub, IDE integrations, code editing, shell exposed to agent | Generic tool registry, permission/approval engine |
| Optional media | Shipped TTS, STT, avatars, video/image transforms | Typed future voice/media contracts only |
| Unused providers | Unselected LLM/embedding providers | Generic provider slot and chosen provider(s) |
| Third-party skills | Bundled nonessential skills/onboarding | Minimal skill discovery/validation API |
| Dev/deploy bloat | Old deployment scripts/build variants/tests for deleted components | Minimal build/test/ops scripts |
| Legacy shims | Dead compatibility adapters after tests | Versioned interfaces required by live clients |

These are **candidates**, not preapproved path deletions. Removal priority is based on actual reachable dependencies and runtime footprint, not file count alone.

## 3. Procedure for every removal batch

1. **Identify** component, owner, files, import graph, runtime entrypoints, package deps and generated assets.
2. **Describe** preserved behavior/contract, inbound/outbound references, rollback commit, affected tests, license notices and confidence.
3. **Create seam** if a core module hardcodes a concrete integration; use upstream-style registry/SDK, not new independent framework.
4. **Delete physically**: source, package/lockfile dependency when unused, build targets, embedded assets, stale config, docs and obsolete tests; update retained tests.
5. **Prove absence**: clean install from lockfile, compile, static reference scan, dependency traversal, archive/bundle inspection; verify excluded packages are not transitively pulled into shipped runtime.
6. **Prove survival**: preserved contract tests and integration smoke including plugin hot path and host restart.
7. **Measure**: before/after using same host and command; artifact bytes, production dependency set, cold start, idle RAM. Explain if improvement is negligible or regressed.
8. **Record** in `templates/REMOVAL_LEDGER.csv` and `docs/17_BUILD_STATUS.md`, linking commit and tests. Revert batch on regression.

**No mass `rm -rf` pass followed by a hopeful build.** Small reviewable deletion batches are required, especially for `src/agents/`, `src/llm/`, gateway/auth and registry code.

## 4. Example (hypothetical): remove WhatsApp adapter

- Remove concrete WhatsApp plugin code, specific media/bridge dependencies, installer/onboarding and related build artifacts.
- Retain `channel` interface/registration only if part of preserved SDK; retain no WhatsApp-specific product behavior.
- Run demo channel-plugin load (if channel seam is retained), all tool/provider tests, host startup, dependency/bundle absence check.
- Mark removal **verified only after clean rebuild**; intermediate `enabled:false` is insufficient.

## 5. Minimum post-extraction system

An M1 artifact must have (a) working agent with deterministic mock, (b) durable session, (c) registered dummy tool, (d) preserved plugin install/registration, (e) selected transport endpoint, (f) authentication/policy, and (g) no dependencies on physically removed modules. A real inference smoke follows in M2; do not call mock real.

## 6. Required reports

- Inventory CSV: all relevant components, classification, concrete paths, importers and owner.
- Removal Ledger CSV: every removal batch, exact deleted paths, lockfile changes, contract preservation, measurements, tests and rollback commit.
- `M1_EXTRACTION_REPORT.md` (generated by Codex, not prefilled): actual before/after measurements, absent-package proof, known residual dependencies, security deltas, upstream divergence.
- Regression report by U-01...U-12 from `02_UPSTREAM_CONTRACTS.md`.

## 7. Stop conditions

Stop and report if agent loop must be rewritten, plugin SDK contracts become unverifiable, security protections cannot be preserved, or clean build/runtime still depends on a deleted package. A design that merely hides unused features **fails** M1, even if it starts.
