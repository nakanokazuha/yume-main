# 20 — UI Art Direction & Taste Skill Process (M6)

> **Decision (2026-10-15):** The earlier Yume mockup is *not* a final visual contract. It was compact but too vanilla/generic. The creator specifically intends to use **Taste Skill** with Codex to develop the actual UI. Functional contracts and platform targets remain locked; art direction is reopened.

## Design goals (must coexist)

- **Distinctive but restrained:** recognizable Yume visual identity, not an interchangeable AI dashboard, not decorative chaos.
- **Compact/high information density:** small navigation footprint, conversation-first, no giant empty cards/padding. Dense but readable and touch-usable.
- **Modern, premium, androgynous:** neutral/product-centric rather than pink/girly, mascot-first, fantasy, or dating-sim styling.
- **Personal assistant first:** the user chats, authorizes actions and checks memory/reminders. It is **not** a coding IDE, admin dashboard, or marketing landing page.
- **Functional before spectacle:** clear tool calls, sources, approvals, status, failures, memory edits, schedules. No unreachable controls.
- **One identity across MacBook Tauri and iPhone PWA:** same design tokens, sensible responsive composition, iOS safe areas and keyboard handling.
- **Future-proofed:** leave optional extension seams for voice/avatar later; do not design the MVP around an absent avatar or microphone.

## Taste Skill integration

Official project: https://github.com/Leonxlnx/taste-skill  
Official docs: https://www.tasteskill.dev/docs

Codex should verify current install instructions before M6; documented install as of this spec:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

- The default Taste Skill is experimental v2 as of 2026-10-15. Record installed skill name/version/commit and applicable usage instructions, rather than assuming APIs remain stable.
- Consider a separate alternate art-direction experiment using `gpt-taste` (Codex-focused) or `minimalist-ui` only if it materially helps. Do **not** combine incompatible styles without conscious token/rules reconciliation.
- Three Taste Skill knobs may be used as a **starting exploration**, not immutable settings: `DESIGN_VARIANCE` ~5–7, `MOTION_INTENSITY` ~2–4, `VISUAL_DENSITY` ~7–9. Tune after review, especially for PWA performance and reduced-motion support.
- Use the skill to drive an intentional visual design, **not** to replace accessibility or product requirements.

## Mandatory design exploration gate (within M6)

Before full implementation, create **2–3 visibly different** coherent directions for the *same* realistic functional content (not random hero landing pages). Candidates for exploration, **not predetermined final themes**:

1. **Editorial utility** — confident typography and asymmetric rhythm; disciplined surfaces.
2. **Precision instrument** — technical but warm, subtle layering, careful contrast and interaction feedback.
3. **Quiet experimental** — reserved palette, singular accent, identity via type, micro-motion and proportion.

Produce at least:
- Desktop chat screen: thread navigation, live streaming, tools/action approval, composer, status.
- iPhone chat screen: keyboard/safe-area behavior and responsive navigation.
- One secondary screen: Memory or Agenda, showing visual system consistency.
- A small design rationale with tradeoffs for density, usability and performance.

**Creator selects direction; Codex records approval as an ADR or design decision before treating any one visual proposal as canonical.** The prior screenshot is optional input for density only. If approval cannot yet be collected, design output remains an unapproved proposal and M6 visual gate is open.

## Anti-vanilla rubric

Reject outputs that look like:
- Standard shadcn/dashboard shell with only color swapped, uninspired sidebar + white rounded cards everywhere.
- Generic ChatGPT clone with no Yume-specific visual rhythm or thoughtful information hierarchy.
- Oversized header, tool grids or decorative hero pushing the conversation below the fold.
- Purple/pink gradient/stock illustration added solely to simulate personality.
- Overused glassmorphism, continuous neon effects, excessive hover animations or full-screen transitions.
- Tiny illegible text, insufficient touch targets, inaccessible contrast or disabled reduced-motion handling in pursuit of high density.

Evaluate on *real screenshots*: hierarchy, typographic voice, spacing/rhythm, accent consistency, compactness, clarity of action approvals, legibility in Indonesian/Japanese/English, and polished empty/loading/error states.

## Functional non-negotiables

All six areas from `08_UI_TAURI_PWA.md`: Chat, Tools/Connections, Memory, Personality, Agenda/Reminders, Settings/Status. Action confirmations, streaming/reconnect, memory correction, and tool status must not be hidden behind aesthetic decoration. Chat composer is integrated with primary conversation area. Status is honest (live vs mock, offline, pending, denied).

## Deliverables and gate

At M6, Codex creates:

- `docs/UI_DESIGN_SYSTEM.md` (selected direction, tokens, type scale, color/shape/theme rules, responsive and motion).
- The selected design direction screenshots or local proof files (include mobile and desktop); attribution/version of skill used.
- Fully functional shared React implementation using the validated contracts; no design-only throwaway UI substituted for live components.
- UI review matrix in the M6 gate report showing design rubric + functional test results, including creator's direction approval.

**M6 cannot claim design-complete if it merely copies the old mockup or ships a vanilla scaffolding UI.** Conversely, visual polish never excuses a failing mandatory tool/approval/memory feature.
