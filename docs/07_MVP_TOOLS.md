# 07 — MVP Personal Assistant Tool Manifest

## Product rule

Yume is a **personal assistant**, not a programming/coding agent or a public agent automation platform. Reuse OpenClaw's trusted tool framework but **remove coding-specific tool implementations** from the shipped codebase. Do not expose arbitrary shell, code execution, Git/GitHub, IDE actions, repository write, developer CI/CD or command execution to the LLM. Host maintenance commands available to the developer are not user-facing tools.

## Required MVP capabilities (must actually work)

| ID | Capability | Read / write / approval | Proof |
|---|---|---|---|
| T01 | Web search and grounded research | Web read, citations/source URLs; network access | Finds current info, links actual sources, handles zero results |
| T02 | Webpage fetch/read | Read with URL allow/safety policy, timeouts, response size limit | Extracts content, handles bad URLs/redirects/HTML safely |
| T03 | Gmail read/search | OAuth minimum read scopes | Finds specified messages with accurate labels/metadata |
| T04 | Gmail drafts and send | Draft may require preview; **send requires explicit approval** | Draft→preview→approve→send; denial has no send side effect |
| T05 | Google Calendar read & free/busy | OAuth least privilege | Lists and finds event, verifies timezone |
| T06 | Google Calendar create/update/delete | **Explicit approval** before external writes/deletes | Preview→approve→action; rollback via native API if applicable |
| T07 | Google Drive search/read | OAuth least privilege; respect file permissions | Search known file + retrieve controlled text/metadata |
| T08 | Google Drive organize/create/update/delete | Explicit approval for write/destructive changes | Permission-gated supported operation, accurate outcome |
| T09 | Personal notes (local Yume-managed notes) | Read/write with versions; delete confirmation | Create/search/update/delete and persist after restart |
| T10 | Scoped local file/document access | Allowlisted folders, read only by default | Authorized file read; traversal/symlink escape denied |
| T11 | Reminders and timers | Create/list/update/delete (destructive cancel confirmation where needed) | Actual host-run alert + restart reconciliation |
| T12 | Repeating schedules and daily agenda | Scoped job creation/updates, quiet hours | Recurring job, dedupe, quiet hours, timezone correctness |
| T13 | Generic external capability system | SDK tool provider / selective MCP or HTTP adapters | Dummy external tool attach/detach without core modifications |
| T14 | Tool execution visibility & approvals | Explain risk/inputs, consent, execution and errors | UI shows action preview, result, denial and audit ID |

**MVP acceptance:** all T01–T14 are required and each must be verified against a **real integration** where appropriate, except test-only SDK demonstrations in T13. If authentication or API access is blocked, document honest blocker; do not mark G8 complete. Granular Drive write operations can be scoped to exact necessary APIs, but the manifest must be updated with explicit creator approval if a required operation is intentionally removed.

**Milestone acceptance:** G4 requires T01–T10 and T13–T14. T11–T12 remain pending M5 at G4 and require real durable scheduling proof at G5: clients-closed delivery, restart reconciliation, recurrence, timezone handling, quiet hours and duplicate prevention. G8 still requires all T01–T14, including final UI and real-device verification. Track each capability's acceptance gate and verification status in `templates/CAPABILITY_MATRIX.csv`; pending M5 is neither a G4 failure nor a completed capability.

### Connector installation

Prefer existing vetted/pinned integration packages via the preserved plugin tool registry, not hardcoding Google logic into core. At audit, evaluate SDK/MCP compatibility and whether packages bring unwanted code. A retained *generic* MCP connector interface does **not** imply bundling all MCP servers. Connector packages are separately removable, least-privileged and version-pinned.

### Risks and approval policy

| Category | Default |
|---|---|
| Public web read | Allow under network limits, block dangerous schemes/local SSRF targets |
| Read private mail/calendar/Drive | Allow only after explicit OAuth consent and account connection; log access metadata sparingly |
| Send email, update/create calendar, modify Drive | User sees exact preview and confirms before first external side effect |
| Delete resources | Explicit confirmation including target and consequences; never silent mass deletes |
| Notes write | Scoped local write; preview/safe edit history; deletion explicit |
| Local file read | Explicit folder grants; deny system files/secrets; read-only baseline |
| Plugin install/external executable | Admin-only, **not a model-invokable install tool** |

Model-generated tool args are untrusted; validate schema and authorization *after* generation. Denied actions must never result in partial side effects. Idempotency keys protect retries; external APIs with non-idempotent writes need local dedupe records and reconciliation.

### What is explicitly NOT an MVP tool

- GitHub, Git/GitLab, PR/issues, coding search, code interpreter, terminal, shell, SSH, package managers, Docker commands, deployment tools, IDE extensions, filesystem bulk editing, arbitrary script execution.
- Raw browser automation (future candidate; only add after a new safety/scoping ADR). Ordinary HTTP webpage read **is** MVP.
- WhatsApp/Telegram/Discord/LINE channels (not required for MVP), social media posting, finance/bank transfers or purchase automation.
- Apple Calendar, Apple Reminders, Apple Notes, iCloud, Apple Shortcuts — **post-MVP** integrations.
- STT/TTS/audio, avatar, image/video processing — **post-MVP**.

### Integration reality checks

- Gmail/Calendar/Drive OAuth availability depends on Google Cloud OAuth consent setup, redirect URI and selected scopes. A local/private pilot is still subject to provider restrictions and policy.
- Private PWA on `*.ts.net` may require production-safe HTTPS callback URLs. Verify Google OAuth callback feasibility at M4; do not claim a callback URI is supported until tested.
- Google credentials/tokens only on Mac mini host secure storage; no client-side OAuth refresh tokens in PWA local storage.
- Connector failures should degrade that specific tool, not crash conversation. UI shows `not_connected`, `needs_consent`, `ready`, `degraded`, or `error` truthfully.

### Acceptance example (G4)

Conversation: user asks “lihat email travel terakhir, cari jadwal kosong, dan bikin event kalau aku setuju.” Yume reads mail, reads calendar, proposes event, requests confirmation, and writes **only after approval**. Logs contain event/approval IDs and redacted metadata rather than email bodies by default.

This G4 example covers mail/calendar and approval behavior. Durable Yume reminders/timers and repeating schedules (T11–T12) are accepted separately at G5.

Track per-tool proof in `templates/CAPABILITY_MATRIX.csv`.
