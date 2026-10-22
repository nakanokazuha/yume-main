# 08 — Functional UI: Shared React, Tauri MacBook, PWA iPhone

## Locked platform design

- **MacBook desktop:** Tauri v2 shell embedding shared React + TypeScript frontend.
- **iPhone:** installable Progressive Web App (PWA) from **private HTTPS host**; not a native app store build in MVP.
- **Backend:** Mac mini host through Tailscale; no Vercel, no public frontend hosting.
- **UI source:** single shared React/Vite/TypeScript application with platform adapters. Tauri-native APIs only via a small conditional adapter; web build runs without Tauri.
- **Design direction:** the previously approved mockup is now **superseded as a visual lock** because the creator found it too generic/vanilla. Taste Skill–guided exploratory design is mandatory at M6; old screenshots, if provided, are optional **layout-density/interaction references only**. Preserve compactness, an integrated composer, neutral/androgynous personality and assistant-first information architecture; visual identity, color, typography, layouts and micro-interactions may be redesigned. Follow `20_UI_ART_DIRECTION.md`.

## M6 visual design workflow (Taste Skill)

1. Preserve this document's six functional destinations and mobile/desktop contracts; **do not** clone the old UI mockup pixel by pixel.
2. Install and invoke [Taste Skill](https://github.com/Leonxlnx/taste-skill) in the Codex UI worktree. Default install (verify current upstream instructions before executing):

   ```bash
   npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
   ```

   The upstream default is experimental v2 as of this spec date; pin the version/commit actually used and record it. Optionally test the Codex-oriented `gpt-taste` variant as a **separate** design pass, not stacked blindly on top of conflicting rules.
3. Produce 2–3 intentional style directions using the same actual chat+sidebar+tool-card+composer content, with phone layouts. Explain tradeoffs. Ask creator to pick one before finalizing visual tokens.
4. Write `docs/UI_DESIGN_SYSTEM.md` (generated later, at M6) with selected palette, typography, spacing, radii, elevation, iconography, states, motion, and responsive rules. Make styles coherent across all destinations, not a landing-page-only demo.
5. Implement and inspect real running React screens at desktop and iPhone viewports; iterate on visual hierarchy, legibility, compactness and accessibility; preserve the actual wiring and error/approval flows.

See the detailed acceptance rubric in `20_UI_ART_DIRECTION.md`.

## Information architecture

1. **Chat (primary):** multi-thread history, streaming, tool result cards, approval dialogs, stop/retry, source links, attachment placeholders only where working, model/status, error/reconnection states.
2. **Tools & Connections:** installed *personal* tools, grant/consent status, capability scopes, test connection, reauthorize/disconnect, recent action audit.
3. **Memory:** query, provenance, create/correct/delete, extraction pause; clearly distinguish conversation transcripts from episodic memory.
4. **Personality/Character:** weighted sliders with unsaved-diff control, mood/relationship/slow state inspector, evidence feed, freeze/rollback.
5. **Agenda & Reminders:** list/calendar-ish agenda, create/edit/cancel, recurrence, quiet hours, due vs delivered states and notification consent.
6. **Settings & Status:** model/provider config, private host connection, device pairing, diagnostics, backups/privacy, plugin health, current mock/live flags.

**Navigation must stay compact.** Inspector screens are opt-in panels/pages, not permanent giant dashboards occupying the chat view. On narrow iPhone displays, use responsive drawer and bottom-safe-area-aware composer.

## Component architecture (suggested)

```text
apps/client/src/
  components/chat/ tool-card/ confirm-action/ status-pill/
  features/threads/ memory/ character/ agenda/ connections/ settings/
  platform/{contracts,web,tauri}/
  services/{gateway-client,host-api,event-stream}/
  theme/tokens.ts
  pwa/{manifest,service-worker}/
apps/desktop/src-tauri/
```

Avoid duplicating chat business logic across platforms. Use presentation state machines for pending/running/awaiting-approval/failed/completed; never infer `success` from a user click alone.

## UI contract requirements

- No direct full-privilege Gateway token in browser JavaScript. Backend session auth/device pairing; narrow client capability API.
- Optimistic UI only for reversible local edits; irreversible external actions wait for host acknowledgment.
- Streaming displays partial tokens/events; reconnect reconstructs authoritative thread state without duplicating assistant messages.
- Explicit approvals list actor/tool/target/payload summary and consequences. Timeout/denial is not permission.
- Display offline/network unavailable, model auth failure, memory degraded, schedule delivery issues separately.
- Correct locale/timezone (Asia/Tokyo default), responsive typography and keyboard/touch accessibility.
- Default Indonesian-first tone, Japanese/English mixed content supported without corrupting search or timestamps.
- Client status must distinguish real provider results from deterministic test mocks.

## PWA-specific acceptance

- Installable via Safari **Add to Home Screen**, valid manifest, icons, service worker, secure HTTPS origin and correct iPhone safe-area behavior.
- App shell caching is permitted, but private chats/memory should **not** be recklessly offline-cached. Do not claim offline intelligence; UI reports backend unavailable.
- PWA access requires iPhone Tailscale connected and private ingress reachable; test on Wi-Fi **and** mobile network.
- Web Push on supported Home Screen iOS can be explored, but **reliable background notification delivery is an explicit device test**; fallback is in-app reminders and visible pending notifications. Document limitations rather than promising unrestricted background scheduling.
- Test actual microphone/camera permissions only in later audio/avatar milestones. No inactive audio button posing as an MVP feature.

## Tauri-specific acceptance

- Desktop app launches, reaches private host, uses shared client build, shows native disconnect states. Secure CSP; minimum Tauri plugin permissions and allowlisted IPC APIs.
- Does **not** run a duplicate canonical agent process or DB on MacBook by default.
- Package/signing realities logged. Development unsigned builds are acceptable for private MVP if launch/restart is reproducible and permissions are safe.

## M6 vs M7 boundary

- **M6:** complete functional interface on desktop and mobile browser during development, wired to real test backend; no fake buttons.
- **M7:** Tauri desktop packaging + iPhone installable PWA private HTTPS/Tailscale delivery + real device authentication and host restart recovery.

## Previous UI screenshots (optional)

If previous design images are supplied under `assets/reference-ui/`, they are **historical references only** for compactness, composer placement and navigation density—not a fidelity target. Their absence is **not a blocker**. The selected Taste Skill design direction plus the creator-approved new design system become visual authority for M6.
