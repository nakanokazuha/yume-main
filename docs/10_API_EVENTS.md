# 10 — Application API and Typed Event Contracts

These are **Yume-owned proposed contracts**, not claims that OpenClaw already exposes identical REST endpoints or payloads. At M0/M2, map to **pinned OpenClaw Gateway WebSocket/RPC methods**, retain upstream client/protocol packages when feasible, and implement only needed Yume-specific adapter methods. Version every application-facing schema.

## Ownership

- Gateway WS/RPC remains the primary agent run/session transport when preserved.
- A narrow authenticated Yume API may expose memory, character, reminder and connector CRUD not natively supported by the retained Gateway subset.
- Client sees normalized events and stable IDs; backend maps them to pinned OpenClaw internals.

## Endpoint intentions (exact routes may differ)

| Capability | Proposed interface |
|---|---|
| Overall status | `GET /v1/status` |
| Threads and messages | Gateway `sessions.*` or Yume facade |
| Chat streaming / cancellation | Gateway agent run and event subscriptions |
| Tool approvals | Gateway approval flow + Yume action-preview facade |
| Personality weights/state | `GET/PATCH /v1/character/{weights,state}` |
| Character evidence/snapshots | `GET /v1/character/history`, `POST /v1/character/rollback` |
| Memory query/correction/delete | `/v1/memory/*` authenticated |
| Tools/connectors/status | `/v1/tools/*`, `/v1/connections/*` |
| Reminders/schedules | `/v1/jobs/*` |
| Client pairing | `/v1/devices/*` with explicit scopes |

All write and management endpoints require explicit auth scope and input validation. Never expose generic unaudited admin RPC to untrusted browser-origin sessions.

## Core shared TypeScript types (conceptual)

```ts
type YumeEnvelope<T> = {
  schema_version: 1;
  id: string;
  type: string;
  created_at: string; // ISO 8601 UTC
  session_id?: string;
  turn_id?: string;
  correlation_id?: string;
  payload: T;
};

type CapabilityStatus = 'ready' | 'degraded' | 'not_connected' |
  'needs_consent' | 'disabled' | 'error';

type RunStatus = 'pending' | 'streaming' | 'awaiting_approval' |
  'completed' | 'cancelled' | 'failed';

type ToolRisk = 'read_public' | 'read_private' | 'write_local' |
  'write_external' | 'destructive';
```

Use a schema library validated on both server/client; enum names may change via ADR before code ships.

## Required events

| Event | Required semantics |
|---|---|
| `chat.run.started` | stable session/turn IDs, live/mock and provider metadata |
| `chat.text.delta` | monotonic sequence/cursor and UTF-safe append |
| `chat.run.finished` | terminal outcome, non-invented usage, expression metadata optional |
| `chat.run.failed` | normalized safe error, retry classification |
| `tool.action.proposed` | human-readable target, effect/risk, approval requirement |
| `tool.approval.requested` | stable approval ID, deadline, arguments preview |
| `tool.approval.resolved` | explicit approved/rejected/expired and actor |
| `tool.action.completed` | confirmed external/local result and audit reference |
| `memory.changed` | memory ID, version and redacted summary |
| `character.state.changed` | before/after version and evidence IDs |
| `job.status.changed` | due/delivery status, no duplicate completion |
| `system.capability.changed` | provider/plugin ready/degraded/disabled status |
| `expression.segment` | optional future-compatible non-authoritative cue |

## Streaming and race conditions

- Persist user turn before model run; assign stable `run_id` and `turn_id`.
- Handle out-of-order and duplicate stream frames using sequence numbers or native Gateway replay cursor; do not invent native behavior without source inspection.
- Abort/cancel changes status; no silent conversion of cancelled requests to successful memory/evolution events.
- Reconnection loads authoritative persisted history, not blind replay as new messages.
- Approval has explicit expiry and a **single-use** idempotent grant, scoped to exact proposed action params.
- `schema_version` major incompatible changes yield explicit client error; use compatible optional fields for evolution.

## Expression segment example

```json
{
  "schema_version": 1,
  "id": "expr_001",
  "type": "expression.segment",
  "created_at": "2026-10-15T08:00:00Z",
  "turn_id": "turn_001",
  "payload": {
    "segment_id": "s1",
    "text": "Hmph!",
    "emotion": "playful",
    "intensity": 0.4,
    "avatar_cue": null,
    "voice_cue": null
  }
}
```

**Only event/schema groundwork in MVP.** No real audio/video payloads or avatar animation renderer.
