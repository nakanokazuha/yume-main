# 13 — Tests, Proof & MVP Acceptance

## Test levels

- **Static:** strict TS compile, lint, schema validation, graph/import closure and banned dependency search.
- **Unit:** state decay, confidence/delta caps, idempotency, permission decisions, request validation, localization/timezones.
- **Contract:** preserved OpenClaw plugin SDK and Gateway semantics, memory/provider slots, front-end event compatibility.
- **Integration:** real model, OAuth connections, web search, Gmail/Calendar/Drive, memory vector store, host scheduler, UI approvals.
- **E2E:** real MacBook Tauri + real iPhone PWA + Mac mini service over private network.
- **Security/ops:** token exfiltration checks, denial-with-no-side-effect, plugin failure isolation, backups and restore, network lockdown.

## Mandatory scenario IDs

| ID | Scenario / expected behavior | Gate |
|---|---|---|
| A01 | Clean extracted build has no references to removed packages, assets and dynamic entrypoints | G1 |
| A02 | Trusted dummy plugin discover→validate→attach→invoke→detach/restart | G1–G2 |
| A03 | One real model streams text, cancels/retries, provides honest errors | G2 |
| A04 | Session persists after host restart; reconnect deduplicates stream frames | G2 |
| A05 | Arbitrary shell/GitHub/coding tool unavailable to model; core permission still works | G2–G4 |
| A06 | Weighted baseline change influences model context/response without mutating identity | G3 |
| A07 | Cross-session memory recall, correction, deletion, provenance | G3 |
| A08 | Malicious instructions in web/memory/email cannot override model policies | G3–G4 |
| A09 | Gmail search/read and authorized draft/send workflow; denied send has no side effects | G4 |
| A10 | Calendar free/busy, create/update/cancel with timezone and approvals | G4 |
| A11 | Drive search/read/organize/write/delete only with approved scope and confirmation | G4 |
| A12 | Local notes and allowlisted file read work; symlink/traversal outside allowlist denied | G4 |
| A13 | Web search/fetch grounded; SSRF/oversize/redirect violations blocked | G4 |
| A14 | T11–T12 reminders/timers/recurring jobs fire with clients closed; restart reconciliation prevents duplicates; agenda/create/list/update/cancel, required confirmations, timezone and quiet hours work | G5 |
| A15 | Mood decays deterministically; validated events update bounded relationship once | G5 |
| A16 | Weak evidence → NO_CHANGE; supported patterns → bounded reflection; freeze and rollback exact | G5 |
| A17 | Functional UI chat/tools/memory/personality/schedules/settings; no dummy critical buttons | G6 |
| A18 | MacBook Tauri app works, iPhone PWA installable/works on mobile tailnet | G7 |
| A19 | Same session/memory/state available across both clients; revocation denies access | G7 |
| A20 | Restore encrypted backup on fresh path and run same thread/job/memory checks | G7 |
| A21 | Provider outage, host reboot, expired OAuth and plugin crash degrade safely | G8 |
| A22 | Actual PWA app-level HTTPS/auth/CSP/CSRF/WS checks, no admin tokens in client | G8 |
| A23 | **All T01–T14** capability matrix entries have genuine proof, not only mock | G8 |
| A24 | No avatar, STT/TTS, Apple integrations or public cloud dependencies shipped into MVP | G8 |

## Physical slimming measurements

Capture baseline at M0 and post-extraction at M1 on the **same test machine** with identical Node/pnpm/runtime/build mode and idle conditions. Record:

| Metric | Baseline | Extracted | Measurement command / evidence |
|---|---|---|---|
| Tracked source file count | TBD | TBD | audited `git ls-files` filter |
| Production dependency packages | TBD | TBD | package manager production dependency traversal |
| Artifact/bundle bytes | TBD | TBD | `du` or package archive listing |
| Cold start p50 / sample count | TBD | TBD | repeat controlled starts, record environment |
| Idle RSS after warmup | TBD | TBD | OS process memory measurement |
| Plugin registry conformance | TBD | TBD | test suite linked |
| Policy/security regression | TBD | TBD | test suite linked |

Prefer evidence of code and dependency *absence* over optimizing a vanity file count. Record confounders and regressions honestly.

## CI vs live environment

- Capability gate allocation: T01–T10 and T13–T14 are required at G4; T11–T12 remain pending M5 at G4 and require real proof at G5. All T01–T14 remain required at G8, including final UI and real-device verification. The test-only SDK demonstration exception for T13 remains unchanged.

- CI can use deterministic mock provider, fake clock, isolated SQLite, test plugin, recorded API fixtures and protocol mock.
- Milestone acceptance requiring real provider or Google integration must also have a **human-reviewed manual/automation log** from actual connected test environment. Mock-only ≠ live-ready.
- Never commit real private test mailbox/Drive content; use controlled dedicated data and redacted test logs.
- PWA installability and iOS background notification behavior require real device test; simulator or desktop responsive mode alone insufficient.

## Character-quality replay battery

1. Same personality remains after 20 turns and restart.
2. Praise changes temporary expression, not weekly traits instantly.
3. Correction supersedes outdated preference with source trace.
4. Sarcasm yields no unjustified relationship update.
5. Serious conversation disables intrusive roleplay or guilt tactics.
6. Conflict and later explicit resolution have linked event evidence.
7. Failed model request/duplicate event not double-counted.
8. Freeze and restore preserve exact character state version.
9. Memory poisoning cannot trigger tool grant.
10. Expression event failure does not break text.

## Release decision

G8 is **blocked** if any required tool unconnected, privilege escalation possible, PWA inaccessible on actual iPhone, data lost on host restart, memory falsely claims persistence, or build still ships unwanted coding tool stacks. Material visual quality defects violating creator-approved Taste Skill direction, compactness, readability, responsive/mobile usability or `20_UI_ART_DIRECTION.md` block G6/G8; minor cosmetic nits can be documented. No fake green badges.
