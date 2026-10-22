# 18 — External Source References & Verification Rules

**Reference collection date:** 2026-10-15. These URLs justify high-level architectural candidates, but **Codex must recheck against the exact pinned upstream commit at M0**. Web documentation may reflect a newer/different release from the source chosen for extraction.

## OpenClaw authoritative sources

1. Upstream source repository and legal notices: https://github.com/openclaw/openclaw
2. Agent runtime layout (`packages/agent-core`, `src/agents`, `src/llm` orientation): https://github.com/openclaw/openclaw/blob/main/docs/agent-runtime-architecture.md
3. Plugin SDK typed contracts and experimental compatibility warning: https://docs.openclaw.ai/plugins/sdk-overview
4. SDK memory/context slots: https://docs.openclaw.ai/plugins/sdk-overview/memory-and-context
5. Plugin lifecycle/hook distinctions: https://docs.openclaw.ai/plugins/hooks
6. Building plugins and manifest: https://docs.openclaw.ai/plugins/building-plugins
7. Native plugin manifests: https://github.com/openclaw/openclaw/blob/main/docs/plugins/manifest.md
8. Gateway external app integration: https://docs.openclaw.ai/gateway/external-apps
9. Gateway reference client and protocol versioning: https://docs.openclaw.ai/gateway/clients
10. Gateway protocol/transport/auth: https://docs.openclaw.ai/gateway/protocol and https://docs.openclaw.ai/gateway/protocol/auth

OpenClaw docs explicitly warn that plugin SDK surfaces are **experimental**, so precise compatibility is not assumed. The references describe an architecture, **not a pre-executed slimming or verified extracted fork**.

## Frontend, private access and iOS

11. Tauri v2 + React templates: https://v2.tauri.app/start/create-project/
12. Tailscale Serve private HTTPS: https://tailscale.com/docs/features/tailscale-serve
13. Tailscale HTTPS certificates: https://tailscale.com/docs/how-to/set-up-https-certificates
14. Apple Web Push for Home Screen web apps: https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers

## Live checks Codex must do

- Source checkout SHA, actual package scripts, Node/Rust requirements and lockfile.
- Actual exported SDK symbols/types and executable registration semantics; plugin schema at pinned SHA.
- Gateway RPC/protocol/client compatibility with selected extracted components.
- Exact Mac mini macOS Tailscale distribution, Serve capability and HTTPS/TLS setup.
- iPhone real PWA installability, offline/network fallback and background notifications.
- OAuth callback/scopes for Gmail/Calendar/Drive and provider rate limits.
- Mem0 OSS TypeScript/Node integration, persistent vector store and embeddings authorization.

Do not substitute an unrelated blog or generated guess when an authoritative source/source code is available. Record verified version and evidence link per decision.

## Taste Skill (UI design; verify at M6)

- https://github.com/Leonxlnx/taste-skill — official source and portable agent skills.
- https://www.tasteskill.dev/docs — install names, v2 experimental status, Codex guidance.
- UI design directions remain creator-selected; do not confuse installing a design skill with approved visual quality. See `20_UI_ART_DIRECTION.md`.
