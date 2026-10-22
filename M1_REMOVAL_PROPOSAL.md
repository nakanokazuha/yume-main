# M1 Removal Proposal — Review Draft

Status: **proposed; no removals executed; creator review required before M1**.

## Audited starting point

Official OpenClaw `v2026.10.5`, commit `1b58cb9a1b4f4353e1add63c8506db4d890962e8`. The source contains broad native apps, many messaging channels, 166 extension directories, 24 workspace packages, model/provider integrations, media and coding/agentic development features. Candidate classes below are not preapproved path deletions. Every concrete path must be justified by the M0 reachability and license audit.

## Protected dependency roots

Retain and prove the smallest working closure of the single-turn agent loop, real model streaming and cancellation, tool schema/policy/approval, session persistence/replay, plugin manifest discovery and validation, SDK registration and lifecycle hooks, provider/tool slots, minimal authenticated Gateway protocol/client, configuration/secrets/security, host jobs/scheduler seam, memory/context seam, and required future typed expression events. Preserve MIT and all applicable notices.

## Candidate removal batches

1. **Unused channel implementations:** remove channel-specific extensions, onboarding, assets, tests and runtime dependencies for platforms Yume will not support. Preserve generic plugin discovery and channel registration only where required by retained SDK contracts.
2. **Native shells and platforms not in MVP:** remove upstream Android, iOS and other app targets plus their build/release infrastructure. Preserve the Gateway client and protocol contracts. Yume's own MacBook Tauri and iPhone PWA are introduced in M6–M7.
3. **Coding and development-agent features:** remove Git/GitHub, IDE, repository editing, code execution and exposed shell implementations/skills. Preserve generic tool registration, permissions and approval enforcement. Host maintenance remains operator-side.
4. **Audio, avatar and media engines:** remove speech, realtime transcription, TTS, avatar, image/video/music generation and other unneeded media implementations, dependencies and assets. Preserve only typed future extension contracts required by the charter.
5. **Unselected model/provider adapters:** retain provider mechanism and the one creator-authorized real provider selected at M2; remove the other concrete adapters after package and config edges are mapped.
6. **Bundled non-MVP skills, channels and operator surfaces:** remove marketplace bundles, unrelated assistant skills, admin/diagnostic surfaces not required for safe operation, and their installation/build/docs paths. Preserve plugin metadata validation and host-only diagnostics necessary for security and recovery.
7. **Orphaned dependencies, generated output and build targets:** remove only after importer, dynamic load, config, generated-code, test and release-workflow references are resolved; regenerate lockfile and prove clean installation and artifact absence.

## Required evidence per batch

Before deletion, identify every path, owning package, static and dynamic importer, config/manifest reference, generated artifact, tests, license and protected contract. If a protected root depends on a concrete candidate, first route it through a verified upstream SDK/slot. Delete in a reversible commit, then run targeted contract tests, clean install/build, reference scans, dependency closure and shipped-artifact inspection. Compare size/startup/RSS against M0 under the same environment. Record each path and rollback commit in `templates/REMOVAL_LEDGER.csv`.

## Do not remove without additional evidence

Do not remove any path solely because its directory name appears out of scope. In particular, do not remove `src/agents`, provider core, sessions/storage, Gateway/auth, plugin loader/SDK, shared security utilities, generic tool policy, scheduler seam or memory/context seam before completing reachability and contract mapping. Do not rewrite the agent runtime or replace the plugin framework for convenience; stop and propose an ADR if preservation proves infeasible.

## Review requested at G0

Review the protected roots and candidate batches after the M0 graph, test, build and license evidence is complete. This document is a conservative draft and is not sufficient authorization to delete source. No M1 batch is approved by this draft.
