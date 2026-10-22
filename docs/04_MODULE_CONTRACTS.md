# 04 — Yume Module & Capability Contracts

## Design rules

- Reuse the **preserved OpenClaw plugin SDK/registration path**. This document defines Yume-specific semantics over that path; it does not authorize replacing the plugin loader with another engine.
- A module is a package with a declared API/version, explicit dependencies, permissions, health and persistence ownership; not necessarily a microservice.
- A thin `extension adapter` is allowed to bridge pinned OpenClaw SDK types to Yume schemas. Do not rely on private `src/**` imports without a documented compatibility patch.
- One capability slot owner where semantics are exclusive (memory/context); others may have multiple providers with stable routing.

## Capability catalog v1

| Capability | Owner | Plugin registration style | Disabled behavior |
|---|---|---|---|
| `yume.character.context` | Character extension | pre-model/context hook or context slot | Minimal stable identity fallback |
| `yume.character.state` | Character/state extension | service + typed inspector RPC | Chat persists with identity, no changes |
| `yume.memory.episodes` | Memory extension | memory capability slot/adapter | Chat runs with recent transcript only; status degraded |
| `yume.reflection` | Reflection extension | scheduled service + event subscriber | Chat unaffected, evolution frozen |
| `yume.personal-tool.*` | Tools extension(s) | tool registration | Missing tool unavailable, explicit UI state |
| `yume.scheduler` | Durable host scheduler | background service, RPC | No new jobs accepted while unavailable |
| `yume.presentation.expression.v1` | Expression metadata producer | typed domain event | Text only |
| `yume.voice.*` | Future | speech/realtime provider slots | Not built/shipped in MVP |
| `yume.avatar.*` | Future | typed event subscriber outside core | Not built/shipped in MVP |

## Module manifest (Yume metadata; adapt to upstream manifest)

Do not ship a conflicting second plugin loader. Attach these fields as metadata/config of the **existing compatible manifest**; M0 determines allowed extension fields.

```yaml
id: yume.memory
version: 0.1.0
core_compat: '<pinned-tested-range>'
capabilities:
  - yume.memory.episodes
requires:
  - session.read
permissions:
  - storage.episodes.read
  - storage.episodes.write
config_schema_version: 1
unload_policy: restart_required  # example only; verify upstream behavior
health_check: yes
```

The YAML is **conceptual**, not a documented literal OpenClaw manifest. Codex must use actual upstream schemas and avoid inventing manifest fields at implementation.

## Attach/detach semantics

- **Attach:** inspect metadata without code execution; validate version/config/permissions; register tools/providers/hooks with upstream SDK; check collisions; activate; health-check; expose capability list and effective permissions.
- **Detach:** stop accepting new calls, finish/cancel in-flight safely, flush owned state, release resources, update registry, report `restart_required` when hot unload is unsafe.
- **Replace:** versioned data migrations + snapshot, activate one owner, fail closed if incompatible, rollback to prior compatible owner.
- Optional capabilities may fail closed while keeping text chat alive; core dependencies must report unhealthy rather than silently degrade to fabricated results.

## Adapter contracts

- **Model provider:** normalized `stream`, cancellation/timeout, usage when supplied, errors with stable types, declared supported modalities; no assumption all models support tools.
- **Personal tool:** strict schema, permission/risk metadata, idempotency key for writes, human-readable preview, approval request/result, audit ID, cancellability where supported.
- **Memory:** `search`, `proposeWrite`, `commitWrite`, `correct`, `delete`, and provenance; validate actual upstream slot semantics before creating adapter.
- **Context builder:** identity version + bounded state + retrieved **untrusted** memories + session history + relevant daily tasks; token budget; source labels.
- **Scheduler:** durable task ID, due UTC + original timezone, retries/backoff, idempotency, quiet hours, provider delivery ack where possible.
- **Renderer bridge:** canonical event envelope described in `10_API_EVENTS.md`; no in-process dependency on UI or audio engine.

## Cross-module event envelope

Use `schema_version`, `event_id`, `type`, `occurred_at`, `source`, `session_id` (where applicable), `correlation_id`, `payload`, and `privacy_class`. Schema validation must reject unknown privileged actions, malformed payloads and incompatible major versions. Durable state events must survive restarts without double application.

## Extension conformance tests

1. Install/uninstall a dummy read-only tool from a separate package without touching core code.
2. Swap the test model adapter while keeping one dialogue thread.
3. Disable memory provider and verify no crash, explicit degraded badge, transcript intact.
4. Fail a post-turn evaluator and verify chat still succeeds and failed work can be replayed.
5. Reject duplicate memory/context slot ownership; reject missing approval grants.
6. Confirm expression event subscriber can be absent while text response remains valid.
7. Reboot host and test automatic re-registration and persisted state.

## Versioning

Pin OpenClaw host SHA and plugin API compatibility. Version Yume-owned events and DB schema independently. Incompatible schema or capability changes require ADR, fixture migration and contract tests. See `14_UPSTREAM_MAINTENANCE.md`.
