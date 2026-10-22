# M0 Audit Report — Initial Source Baseline

Date: 2026-10-22 (Asia/Tokyo)
Status: audit in progress; G0 is not passed.

## Upstream pin

- Official repository: https://github.com/openclaw/openclaw
- Stable release tag: `v2026.10.5`
- Tag commit: `1b58cb9a1b4f4353e1add63c8506db4d890962e8` (verified with `git ls-remote`; shallow checkout HEAD matches)
- Release evidence: GitHub release page identifies `2026.10.5` as a stable release, and `2026.10.10-beta.3` as a prerelease. The later stable release is selected for audit.
- Root license: MIT. `THIRD_PARTY_NOTICES.md` contains additional retained-code notices; package-level licenses and assets still need a complete audit before extraction.

## Checkout and environment

- Source checkout: `/private/tmp/openclaw-yume-m0`, detached at the pinned commit.
- Audit host: macOS 26.5.2, arm64 (Apple M1 family); Node v26.3.1; pnpm v12.9.0 invoked through npx. Rust/Cargo are not installed. The memory-size query was denied, so RAM was not measured. The target Mac mini model, storage, uptime and free resources have not been separately verified.
- Pinned source declares Node `>=24.16.0 <25 || >=26.1.0` and pnpm 12.9.0. Current Node is in range.
- `pnpm install --frozen-lockfile`: passed for all 189 workspace projects; 1,473 packages installed, lockfile reported 1,707 entries and passed upstream supply-chain policy checks. Native package postinstall steps ran, including an upstream binary download.
- Baseline `pnpm build`: main/package/extension bundles completed; `write-unified-entry-dts` produced no output for over 110 seconds, so the attempt was interrupted. A retry was blocked by the retained `.artifacts/dist-artifacts.lock`; its owner PID was absent, but the environment denied process-list inspection, so the lock was not removed. Full build is **incomplete**, not a pass.
- Focused tests: `pnpm exec vitest run packages/agent-core/src/agent-loop.test.ts packages/plugin-sdk/tests/security-runtime.test.ts packages/gateway-protocol/src/frame-guards.test.ts packages/gateway-client/src/client.test.ts` — **passed, 40 tests across 3 files**. The client test path did not resolve as a test file in this source revision; Vitest ran the three matching suites above.
- No upstream source files were changed.

## Initial source map

This release is much broader than the proposed Yume runtime. The checkout contains 52,947 tracked files, 24 workspace packages, 166 extension directories, 77 first-level `src` directories, 2166 test files and 1405 package manifests under `packages` and `extensions`. The checkout occupies about 917 MiB before the dependency install. The root package declares 66 runtime and 62 development dependencies. These counts are inventory orientation, not a slimming measurement.

Key roots confirmed in source include `packages/agent-core`, `packages/llm-core`, `packages/gateway-protocol`, `packages/gateway-client`, `packages/plugin-sdk`, `packages/memory-host-sdk`, `src/agents`, `src/llm`, `src/sessions`, `src/plugins`, `src/plugin-sdk`, `src/gateway`, `src/security`, `src/cron`, and `src/memory`. Concrete code and import relationships remain to be traced against Yume's protected roots. See `templates/COMPONENT_INVENTORY.csv` and `M1_REMOVAL_PROPOSAL.md` for the review draft.

## Contracts and open items

The pinned repository has separately packaged agent, provider, gateway protocol/client and plugin SDK surfaces. This supports the planned audit approach, but does not by itself prove U-01 through U-12. Exact exported symbols, dynamic discovery/configuration edges, package graph closure, lifecycle guarantees, permissions, protocol methods, and license obligations need source-level tracing and focused tests before G0.

The local host supports Node and pnpm versions declared by this release. Rust/Cargo are absent, so Tauri-specific baseline checks cannot run here. Provider credentials, Google OAuth grants, iPhone pairing, tailnet access and the dedicated target Mac mini environment have not been verified.

## G0 disposition

**Not passed.** The source pin, frozen dependency install, and focused tests are evidenced. The full build, complete import/reachability inventory, baseline runtime/resource metrics, full licensing scan, and creator review of the removal proposal remain outstanding. No upstream code has been deleted. M1 must not begin until the audit is completed and you have reviewed the inventory and removal proposal.
