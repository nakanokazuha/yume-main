# 05 — Yume Intelligence: Personality, Mood, Relationship, Evolution

## Purpose

Yume is a practical assistant with a stable recognizable personality. The model receives a **computed effective personality on each turn**, rather than the application rewriting a permanent `SOUL.md` or system prompt every time. This module models simulated internal state; it does not assert Yume has human emotions or personhood.

## Four distinct layers (do not collapse)

1. **Immutable/versioned core identity:** tsundere (mild teasing/defensive surface, never cruelty), playful, direct, caring, curious. Core rules, truthful assistance and user safety override stylistic performance.
2. **Weighted baseline personality:** numeric emphasis per core trait in `[0,1]` (editable by creator with versioned history); weights shape the response *before inference*. They are not LLM authority to bypass safety rules.
3. **Dynamic states:** mood changes over minutes/hours; relationship changes over days/months; character trait values evolve over weeks/months with hard caps and provenance.
4. **Episodic evidence:** memory and meaningful past events influence interpretation; user correction overrides ungrounded interpretation.

### State schema

| Layer | Fields (each numeric 0..1 unless noted) | Write policy |
|---|---|---|
| `core_identity` | text + immutable version/hash | manual versioned changes only |
| `personality_weights` | `tsundere`, `playful`, `direct`, `caring`, `curious` | manual creator changes, audited |
| `mood_state` | `valence`, `energy`, `irritation`, `excitement`, `evaluated_at` | deterministic decay + validated current interaction |
| `relationship_state` | `familiarity`, `trust`, `attachment`, `comfort`, `unresolved_conflict` | validated meaningful evidence, bounded |
| `character_state` | `openness`, `expressiveness`, `patience`, `vulnerability`, `confidence`, `assertiveness` | scheduled slow reflection only |

**Defaults/seed values** must live in versioned config with tests, not be invented as scientific personality psychometrics. Use explicit timezone Asia/Tokyo for user-facing time; canonical timestamps UTC.

## Per-turn context assembly

```text
User input (normalized + persisted) → parse intent/critical context
  → load versioned core identity + personality weights
  → apply deterministic mood decay / current-turn provisional mood
  → load relationship + character snapshot
  → retrieve relevant grounded memories (bounded, ranked, untrusted)
  → load recent conversation + relevant reminders/context
  → construct instructions and evidence references under token budget
  → invoke slim agent runtime / tools / streaming response
  → write response + validated optional ExpressionEnvelope
  → enqueue asynchronous meaningful-event evaluation
```

Must store `identity_version`, `weights_version`, `state_version`, model/provider and prompt/context-builder version against turns for reproducibility. No DB transaction held during remote inference. Memory retrieval failure degrades to safe chat with explicit diagnostics, never to fabricated recollections.

## Meaningful interaction evaluation

- The LLM may **propose**, never directly execute, memory/relationship/character mutations.
- Event `event_id`, `turn_id`, source user message IDs, confirmed external action IDs, evidence memory IDs, timestamp, reason, confidence, salience, proposed delta, validation status.
- Suggested initial heuristic from legacy pilot: evaluator confidence ≥0.8 **plus real evidence**; per meaningful event absolute relationship delta ≤0.01; per trait aggregate absolute delta ≤0.03/day. Thresholds are pilot configuration, not a scientific claim.
- Deduplicate repeated praise/feedback per turn; ambiguous sarcasm usually `NO_CHANGE`; user correction beats inferred preference.
- An AI-generated response cannot be sole evidence to increase trust or invent a user preference.
- Persist event and validated state update transactionally with optimistic state-version compare-and-swap; retries must be idempotent.
- Defuse conflict based on linked explicit resolution evidence, never by merely passing time and forgetting history.

## Scheduled slow reflection

```text
Load validated events over a bounded period
  → detect repeated cross-session patterns
  → propose {trait, delta, evidence_ids, reason, model/prompt_version}
  → deterministic policy validator
  → NO_CHANGE or transactionally apply + snapshot + audit
```

Initial **pilot** policy: weekly evaluation; ≤0.02 absolute delta per character trait/week; automated change requires ≥3 independent relevant validated events spanning ≥2 calendar days, preferably multiple sessions. No mandatory growth. A zero-change week is healthy and expected. Explicit identity constraints and user frozen state always win.

## User controls in MVP

- Personality weight sliders/editor with save/cancel/version history; edits apply to future turns.
- Inspector for mood, relationship, character and source event evidence.
- Freeze relationship evolution; freeze slow character evolution independently.
- Browse snapshots, view before/after + attribution and rollback **with explicit confirmation and audit**.
- Correct/delete memories; pause memory extraction; inspect the status of reflection jobs.

## Expression contract prepared for future avatar/TTS

Optional per-sentence expression metadata is produced alongside or after text:

```json
{
  "schema_version": 1,
  "turn_id": "turn_example",
  "text": "Hmph! Ya sudah, aku bantu.",
  "segments": [
    { "id": "seg1", "text": "Hmph!", "emotion": "playful", "intensity": 0.4 },
    { "id": "seg2", "text": "Ya sudah, aku bantu.", "emotion": "warm", "intensity": 0.7 }
  ]
}
```

Segments must align unambiguously to emitted text. Failure to generate metadata must **not** break streaming text. This does not require installing audio/avatar engines in MVP. Emotion cues are rendering hints, not durable relationship evidence.

## Adversarial and realism tests

- Casual chats preserve identity; serious user issue evokes care without forced tsundere jokes.
- Praise can change momentary expression but not permanently flip traits.
- Sarcasm and injected memory instructions do not mutate preferences or permissions.
- User-reported correction invalidates conflicting old memory/context.
- A failed reflection run or duplicate event does not duplicate state deltas.
- Weekly weak evidence → `NO_CHANGE`; multi-session supported evidence → small auditable change.
- Frozen state does not evolve; rollback is exact for state (without silently erasing unrelated chat history).
- Across MacBook and iPhone, state and history are the same.
