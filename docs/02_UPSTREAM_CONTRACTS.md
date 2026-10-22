# 02 — Upstream OpenClaw Preservation Contract

> **Preserve the architectural *connectors*, not every attached feature.** Exact code symbols and file paths must be confirmed on the pinned commit at M0.

## Must-preserve behavior

| Contract ID | Preserve | Proof required |
|---|---|---|
| U-01 | One-turn agent loop, stop/cancel, model stream, tool call loop | Real model + deterministic mock agent-turn tests |
| U-02 | Durable session/message lifecycle & replay after restart | Restart/reconnect tests incl partial stream |
| U-03 | Model-provider attach/detach, capability declaration | Dummy provider + one real provider |
| U-04 | Tool/skill registration, discovery, schema and result handling | Demo tool installed separately, invoked, removed |
| U-05 | Manifest discovery + validation before plugin execution | Malformed/disabled manifest tests |
| U-06 | Hook registration, invocation order, lifecycle, teardown | Typed hook conformance tests |
| U-07 | Memory and context slot seams, if exposed in pinned version | Replaceable test adapter; documented ownership |
| U-08 | Auth + tool permissions + approval policy | Denied tool cannot execute; approval required |
| U-09 | Minimal external Gateway/API streaming protocol | Reconnect/history/approval/client version tests |
| U-10 | Error handling, configuration, secrets, observability needed for safety | Broken plugin/LLM/cold restart smoke tests |
| U-11 | Host-side scheduler integration seam | Register/cancel handler without modifying core |
| U-12 | Future voice/avatar extension seam through typed events/providers | Compile-time contract sample only; no engine in MVP |

## Source orientation (unverified until M0)

- OpenClaw architecture reference: agent code at `src/agents/`, transport at `src/llm/`, reusable `packages/agent-core/`.
- Plugin SDK (`openclaw/plugin-sdk/*`) describes registration for tools, providers, context and memory slots, hooks, HTTP/Gateway methods and services.
- Gateway clients use WS/RPC rather than importing in-process plugin SDK. Maintain this separation in Yume.
- Native plugin manifest convention may be `openclaw.plugin.json`; copy/trim schema and loader *compatibly*, not by inventing a new incompatible manifest by default.

These are reference hints, not authorization to delete code. Codex must write exact pinned symbol/path/import mappings and test results in the inventory.

## Preserved minimal plugin life cycle

1. Discover manifest **without running arbitrary code**.
2. Validate ID, API compatibility, config schema, declared capabilities and permissions.
3. Check dependency and capability conflicts; exclusive slots cannot be double owned.
4. Load/register against vetted SDK exports.
5. Activate and report health; support process restart-based reload where necessary.
6. Enforce tool approval and scoped access during execution.
7. Deactivate/unload where supported; if hot-unload cannot guarantee cleanup, document that restart is required.

Do **not** promise live hot-swap for every plugin; document the exact upstream guarantee at the pinned revision.

## Gateway surface to retain

Retain a **minimal frontend-safe subset** required for session history, chat streaming, model/status display, tool results, approvals, memory/personality/job extension endpoints and health. If retaining upstream full Gateway control plane would import substantial bloat, expose a versioned Yume adapter wrapping the minimal compatible Gateway subset. Before removing any RPC method, inventory clients/callers and test wire compatibility for retained methods. No gratuitous custom protocol rewrite.

## Required preservation tests

- `plugin-manifest`: correct, malformed, incompatible versions, unknown capability.
- `plugin-load`: install/register/activate/execute/unregister/restart state.
- `provider-slot`: swap mock providers without rewriting core; response stream and errors normalized.
- `memory-context-slot`: one active slot, consistent precedence, graceful absent slot.
- `tool-policy`: missing grant → rejected, consent denial → no side effect.
- `gateway-client`: auth handshake, subscribe, start/stop run, history, reconnect, version mismatch.
- `fail-isolation`: broken optional extension does not corrupt transcript or crash entire host when safe to isolate.

## Upstream caveat

OpenClaw states that its plugin SDK is experimental; pin exact versions and run contracts on every update. The original OpenClaw open-source project and retained third-party components may carry licensing/notices beyond a top-level MIT headline. See `14_UPSTREAM_MAINTENANCE.md`.
