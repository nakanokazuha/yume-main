# 01 — Target System Architecture (Local-First)

## Runtime topology

```text
MacBook (Tauri v2 shell)                      iPhone (Home Screen PWA)
       \                                         /
        \      shared React/TS UI components   /
         \           private HTTPS/WSS        /
          +----------- Tailscale ------------+
                              |
                   Mac mini: private ingress
                      (TLS + authentication)
                              |
                     Yume API/WS adapter
                              |
             Slim OpenClaw-derived agentic core
               - agent loop / stream / sessions
               - model transport / tool policy
               - plugin discovery / SDK / hooks
               - necessary gateway protocol
                              |
            +-----------------+-----------------+
            |                 |                 |
      Yume Intelligence   Personal Tools   Host Jobs / Events
      personality,memory  mail,calendar... scheduler,reflection
            |                 |                 |
          local SQLite / local episodic+vector store / vault
                              |
           authorized external LLM/search/Google APIs
```

**No Vercel or public inbound Gateway.** Mac mini is the host of record. MacBook and iPhone are clients; they do not own canonical sessions/memory/jobs. UI closure cannot stop host jobs. Network/inference outages are clearly shown.

## Logical boundaries (not mandatory separate processes)

1. **Extracted Agent Runtime:** replayable one-turn execution, inference, streaming, session/message persistence, tool authorization, basic event hooks; smallest dependency closure that works.
2. **Preserved Extension System:** manifest, discovery, SDK entrypoints, provider and tool registration, optional capability slots, lifecycle, permission hooks. Remove specific unused implementations, never the slot merely because it is empty.
3. **Yume Intelligence:** core identity, weighted traits, mood/relationship/character, memory retrieval/extraction, evidence validator, reflection, context building; implemented as modules via compatible SDK/hooks, small audited core patches only when unavoidable.
4. **Personal Tools:** isolated adapters, declared capabilities and risk levels, credential vault, approval UI. No coding workflow tools.
5. **API/Event Adapter:** frontend-safe capabilities, history, tools, approvals, character inspection and jobs; prefer preserved Gateway WS/RPC schemas and client libs. Do not expose full operator privileges to browser.
6. **Presentation:** shared React/Vite/TS components, MacBook Tauri wrapper, iPhone PWA; UI state derives from typed API/events, not direct DB or OpenClaw core imports.
7. **Host Persistence/Jobs:** schema migrations, backups, durable reminders, quiet hours, notification adapters, reflection jobs. Different modules may share a process while keeping separate code/schema ownership.

## Separation rules

- `apps/**` cannot import `core/**` or read private databases; use shared serializable contracts + adapters.
- Extensions should import only vetted `plugin-sdk/*` entrypoints (or stable re-exports in extracted distribution); no blanket `src/**` import.
- Storage ownership is explicit. Conversation transcript has one canonical owner; episodic memory has one canonical owner; trait/relationship state has one canonical owner.
- Character state engine does not directly call SMTP/Gmail, Google APIs or UI. Tools do not mutate identity/relationship state except via evidence events and validators.
- Admin/diagnostic interfaces require elevated host-only permissions; normal chat clients get narrow capabilities.
- Version event schemas so avatar/voice can later consume outputs with no dependency on current UI framework.

## Runtime dependencies to verify at M0

OpenClaw documentation currently describes `packages/agent-core/`, `src/agents/`, `src/llm/`, and `openclaw/plugin-sdk/*` boundaries. **Do not treat those names as guaranteed source locations** until the pinned commit is inspected. Gateway protocol supports external WS/RPC clients, but the exact subset retained in Yume must be measured against UI requirements.

## Suggested repository layout AFTER extraction (not prescriptive at M0)

```text
yume/
  AGENTS.md
  apps/
    client/                 # shared React + Vite + TypeScript app
    desktop/                # Tauri macOS shell around client build
    pwa-host/               # private host static serving/service worker wiring
  core/                     # extracted OpenClaw runtime (exact layout audit-driven)
  plugin-sdk/               # retained contracts/loader (if separate)
  extensions/
    character/ memory/ reflection/ personal-tools/ scheduler/
  packages/
    contracts/ adapter-client/ storage/
  host/                     # authenticated API/WS ingress and service wrapper
  tests/
  docs/
  assets/reference-ui/      # optional old layout/density references, not design authority
```

Do not rearrange upstream layout for aesthetics. First extract a passing codebase, then improve layout via focused refactors with import/contract tests.

## Decisions and risks

- Use one private host service where practical, not microservices by default. Optional risky/CPU-heavy plugins may use isolated workers behind typed transport.
- Tailscale is the network perimeter, not sole user authentication. Prefer tailnet HTTPS ingress with local app authentication/device pairing.
- iOS PWA is a network UI; offline app shell is not an offline model, and background push is subject to iOS policy.
- External inference may receive selected private context; record consent, redaction controls and provider attribution.
