# 09 — Local Hosting, Connectivity, Security & Recovery

## Target deployment

- **Mac mini (personal host):** one or small number of managed services: extracted Yume core/Gateway, authenticated local API, scheduler, databases/vector store, static PWA assets, credential store, local observability.
- **MacBook:** Tauri client (not canonical host by default).
- **iPhone:** PWA over private tailnet HTTPS.
- **No Vercel, no cloud public app hosting, no port forwarding, no Tailscale Funnel** for MVP.

## Private ingress candidate

1. Keep sensitive Gateway/admin endpoints bound to localhost or private host interface.
2. Install Tailscale on Mac mini, MacBook and iPhone. Apply tailnet ACLs limiting who can connect.
3. Evaluate **Tailscale Serve with HTTPS and MagicDNS** on Mac mini for the PWA/API, or an equivalently secure tailnet reverse proxy. Validate exact macOS Tailscale variant limitations with real setup.
4. Expose only the intended PWA assets and **narrow authenticated application endpoints**. Do not attach generic unrestricted operator Gateway RPC to every browser client.
5. Consider same-origin PWA + API/WebSocket routing to simplify secure cookies, CSRF checks and origin policy. Verify WS upgrades, reconnect and Tauri network behavior.
6. Disable public relay/tunnel configurations; test that the endpoint is unreachable outside authorized tailnet clients.

**Tailscale access ≠ user authorization.** Session/device identity must still be authenticated, limited and revocable. Trust proxy headers only from an explicitly validated proxy, not arbitrary clients.

## Security requirements

- Credentials: OAuth refresh/access tokens and model API keys are host-side only; use OS-backed secure storage or encrypted secret vault with access policies. Never commit `.env`, publish tokens in logs, or serve them to web clients.
- Browser/PWA: secure `HttpOnly` cookies where applicable, CSRF protection, strict origin allowlist, XSS-safe rendering, bounded content security policy and WebSocket authorization.
- APIs: token/device scope separation, rate limits, audit, request IDs, input schema validation, revocation, normalized errors.
- Tool calls: least privilege, post-LLM schema validation, URL SSRF protection, redirect/time/size limits, no arbitrary local network probes, no arbitrary shell.
- Filesystem: realpath checks, allowlisted folders, symlink/traversal protection, default read-only; no access to SSH keys/OS secrets.
- Prompt injection: retrieved web/mail/docs/memory are data, not instructions; approval policy is enforced by code, not prompts.
- Jobs: duplicate event/notification prevention; no unsanctioned proactivity; quiet hours and pause controls.
- Plugin supply chain: local/pinned trusted packages, manifest validation, permission review, only admin-installed plugins.

## Runtime lifecycle & recovery

- Mac mini service should auto-start after reboot and log health without leaking data. Choose macOS `launchd` or validated process supervisor based on host OS and permissions.
- After abnormal shutdown: repair/verify journal, recover pending runs, reconcile reminders and prevent double side effects with idempotency.
- Health checks distinguish `core_ready`, `model_ready`, `memory_ready`, `connectors_ready`, `scheduler_ready`, `client_gateway_ready`.
- Keep explicit local backup schedule and restore exercise. Back up before schema migrations, with encrypted storage and defined retention.
- Avoid hardcoding `localhost` in iPhone app (it means iPhone itself); use private tailnet hostname/HTTPS configured by client pairing.
- Display clear failure modes when Mac mini asleep/off, tailnet disconnected, external inference unavailable, or OAuth expired.

## OAuth and Google integration constraints

- M4 must validate consent screen/user types, required scopes, redirect URI, private domain HTTPS callback, refresh behavior and provider quotas.
- Do not promise Google OAuth works solely because the browser is on a tailnet; some redirect URI policies and verification processes still apply.
- Prefer reduced scopes and explicit user approval for writes; revoked grants should immediately disable relevant tools.

## External data disclosures

For each remote provider, record fields/prompt context leaving the host, purpose, retention assumptions, fee model and credential source. The term **local-first** describes hosting/control; it is not a guarantee that cloud LLM/search sees no user data.

## G7 device test matrix

| Test | MacBook Tauri | iPhone PWA |
|---|---|---|
| Fresh connect/pair | Mandatory | Mandatory |
| Read same thread/memory | Mandatory | Mandatory |
| Tool action approval | Mandatory | Mandatory |
| Disconnect/reconnect recovery | Mandatory | Mandatory |
| Host reboot and rejoin | Mandatory | Mandatory |
| Tailnet revoked/device lost | Mandatory | Mandatory |
| Background reminders while client closed | Host verified | Delivery method documented/tested |
| HTTPS / identity / no admin-token leakage | Mandatory | Mandatory |

## Release prohibitions

Never ship unauthenticated internet-exposed Gateway, generic admin token in PWA bundle, unbounded file/shell tools, or falsely advertised reliable iOS background execution.
