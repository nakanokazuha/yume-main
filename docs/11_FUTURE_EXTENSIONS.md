# 11 — After MVP: Apple Apps, Live Voice, Avatar & Productization

**Not part of G8.** Keep these future integrations explicitly outside the shipped MVP runtime dependencies. Only contracts/event capability seams may exist before release.

## F1 — Apple ecosystem integrations

Potential connectors: Apple Calendar, Reminders, Notes, Shortcuts, possibly Health if explicitly requested and privacy-reviewed. **Do not assume these apps expose uniform public remote APIs**; audit device-local frameworks, iCloud APIs, macOS automation permissions, iOS entitlements, and whether actions can operate from Mac mini instead of iPhone. Prefer a minimal opt-in bridge with device-local authorization, not cloud credential scraping. Apple Health is especially sensitive; require separate explicit scope and threat review before even considering implementation.

### Proposed pattern

```text
Yume Tool Registry
  ↕ versioned personal-tool contract
Apple Bridge (macOS/local device service, later)
  ↕ OS permissions / optional Shortcuts adapters
Apple apps / platform frameworks
```

The tool interface stays consistent; capability status shows when an iPhone/Mac bridge is disconnected. No Apple-specific SDK code should leak into agent core.

## F2 — Voice phase

1. Push-to-talk transcript ↔ same session/memory/personality as text.
2. Modular STT provider and modular TTS provider with feature negotiation, nonblocking streaming and failure fallback to text.
3. Realtime conversation/turn detection, cancellation, interruptions and optional low-latency segments.
4. Optional expressive speech cues by segment (rate, style, pitch as supported, not guaranteed).

Keep any CPU/GPU heavy or untrusted processing out of critical Gateway process where possible. Auth and retention of recorded audio require opt-in, delete controls, telemetry redaction and separate permissions. iOS PWA audio restrictions must be measured; a native Capacitor wrapper is an **optional later ADR**, not the MVP commitment.

## F3 — Avatar phase

An external 2D/3D renderer subscribes to typed expression, state and speech timeline events; it must never become authoritative for memory, identity or tool decisions. Test idle/talking/interrupt/reconnect and fall back to text UI. Change renderer without modifying agent loop.

## F4 — Optional extensions

Browser automation, additional communications channels, image/file multimodal understanding and richer proactivity are future **explicit proposals** only. They must pass new permissions/footprint/security review; do not preserve unused code in M1 merely because one day it might be useful.

## F5 — OSS or commercial service (decision deferred)

Only after private pilot: evaluate license/attribution, redistribution of embedded third-party code, multi-user isolation, hosting costs, audit and compliance. No premature SaaS abstractions, tenants, payments or public domain setup in MVP.

## Future compatibility gate

Each future module should be addable via preserved SDK/provider/event seam with no change to the basic text chat + memory + personal tools contract. Adding future integrations may require a narrow new interface, accompanied by an ADR and regression suite rather than a monolithic rewrite.
