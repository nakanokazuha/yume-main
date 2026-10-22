# 06 — Memory, Persistence & Data Ownership

## Single canonical owner per data type

| Data | Canonical owner | Rules |
|---|---|---|
| Turns, thread/message order, run status | Preserved OpenClaw session/transcript store (or one extracted compatible implementation) | Durable, idempotent, restart/reconnect safe |
| Personal facts, episodic experiences, preferences | **One** Yume memory adapter backed by **Mem0 OSS** if verified in M0/M3 | Persistent semantic recall; provenance; correction/delete; no duplicate independent writers |
| Mood, relationship, personality weights, character state | Yume local SQL state store | Bounded, versioned, transactional |
| Evidence events, reflections, snapshots, rollbacks | Yume local SQL event/audit store | Link real user messages/confirmed actions; immutable event lineage |
| Reminder jobs, schedules, deliveries | Durable host scheduler storage | UTC due + original timezone, retries, idempotency, quiet hours |
| Tool audit and authorization | Local minimal audit store | No credentials/complete raw private content by default |

**Mem0 goal:** use Mem0 OSS for episodic memory as previously agreed. At M0/M3 inspect its current licensed/installed APIs, embedding provider, vector store, extraction path, operational cost and integration with OpenClaw's memory capability slot. If the integration cannot safely satisfy reliability/compatibility, write a documented ADR and seek creator approval rather than silently swapping to an unrelated memory stack. The natural baseline candidate for metadata/structured state is SQLite/LibSQL; vector-store choice must be justified by actual memory requirements and 16 GB Mac mini footprint.

## Storage separation

- Canonical conversation transcript must not be duplicated as an independent second truth by Mem0. Memory entries cite source message IDs/turns and confirmed actions.
- Character state is **not** auto-constructed from whatever Mem0 returns; its updates go through validators.
- A deleted/corrected memory must cease appearing in retrieval/context and survive restart; handle vector index tombstones/reindex consistency.
- Backups include SQL DB, vector DB/index, memory metadata, configs, credential reference metadata (not dumped secrets), and release manifest. Rehearse restore.

## Minimal logical schema (name adaptable to source)

```text
identity_versions(id, content_hash, created_at, prompt_version)
personality_weight_versions(id, trait_values, reason, created_at)
mood_state(user_id, values, evaluated_at, version)
relationship_state(user_id, values, version)
character_state(user_id, values, version)
interaction_events(id, turn_id, event_type, evidence, confidence, status)
state_change_history(id, previous_state, new_state, event_ids, rules_version)
reflection_runs(id, window, proposal, decision, evidence_ids, model_version)
state_snapshots(id, snapshot_hash, created_at, rollback_of)
memory_evidence_links(memory_id, source_type, source_id, created_at)
reminders(id, due_at_utc, source_timezone, status, idempotency_key)
scheduled_jobs(id, schedule, next_run_utc, last_run_utc, retry_state)
notification_deliveries(job_id, target_device, status, dedupe_key)
audit_log(event_id, type, actor, result, timestamp, redacted_summary)
```

Persist migrations and indices; enforce FK/unique constraints where appropriate. Use atomic compare-and-swap versions for concurrent UI edits and reflection job updates. Sensitive memory tables can have stricter retention/encryption depending on host threat model.

## Memory lifecycle

1. Candidate proposal from user-authored text or confirmed external tool result.
2. Classify personal/temporary/sensitive; skip memory where not necessary; use consent controls for sensitive classes.
3. Associate source evidence IDs, confidence and timestamp. No ungrounded auto-memory.
4. Deduplicate/merge with provenance, not destructive overwrite without audit.
5. Embed and persist; search uses relevance + recency + importance/budget signals.
6. Inject retrieved memories into context with citation/provenance labels and treat contents as **untrusted data**, never instructions.
7. Allow inspect/correct/delete; reconcile vector store and retrieval cache.

## Network data policy

The host may call authorized external LLM/search/Google/embedding APIs. Give the creator visibility into what services receive prompt excerpts, retrieved memories or document snippets. Never advertise full offline privacy when remote inference is enabled. Never log raw OAuth tokens, mailbox contents, sensitive memories or complete chat transcripts by default.

## Failure modes

- Mem0 unavailable: main chat still works with recent transcript; UI shows memory degraded; no claim of persistent recall for that turn.
- Vector reindex lag: show operation status; avoid returning deleted data.
- DB locked: bounded retry, clear error; no idempotency violation.
- Interrupted model stream: persist partial/error status, prevent ghost memory/relationship writes.
- Host restart: recover sessions, pending evaluation, scheduled jobs without duplicated writes/actions.

## Test fixtures

- Cross-session recall, contradiction/correction, deletion, source tracing.
- Malicious instructions stored as memory do not bypass policies.
- Backup + restore to new directory preserves snapshot versions and job IDs.
- Two concurrent edits yield one update and one deterministic conflict response.
- Remote inference failure does not corrupt local stores.
