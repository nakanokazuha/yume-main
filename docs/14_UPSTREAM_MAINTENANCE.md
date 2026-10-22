# 14 — Upstream Lineage, Compatibility & Maintenance

## Source of truth

- Official upstream: `https://github.com/openclaw/openclaw` (verify exact origin and license at M0).
- Pin full commit SHA, release/tag, source checkout date, root license and applicable THIRD_PARTY_NOTICES.
- Retain a pristine baseline tag/branch and a separate Yume extraction branch. License obligations remain for copied/modified code even if original repository layout is removed.

## We are *not* maintaining a full OpenClaw fork indefinitely

Yume is an **audited extraction** of the agent runtime and plugin contracts. After aggressive physical slimming, automatically merging every upstream change may be impractical. Use an *upstream component map* and selective patch intake for security and relevant components.

## Change categories

1. **Critical security fix in retained code or dependency:** fast-tracked, isolate/test/patch with regression coverage.
2. **Plugin SDK/Gateway protocol change:** compatibility evaluation, adapter migration and contract tests before update.
3. **Agent loop/model/provider defect:** evaluate reproducible fix; port only relevant commits.
4. **Removed-channel/app changes:** ignore unless they alter preserved contracts/security.
5. **New optional provider/tool:** do not bring code automatically; require creator approval and footprint/security analysis.

## Required upstream-sync record

```text
Date:
Original pinned SHA:
Candidate upstream SHA/tag:
Relevant upstream issue/commit(s):
Touched extracted components:
Contract changes (U-IDs):
License/notice changes:
Build/dependency/footprint delta:
Migration required:
Tests run and results:
Rollback commit/tag:
Decision: adopt / defer / reject
```

## No assumptions on SDK stability

The OpenClaw plugin API is documented as experimental. Preserve API surface intentionally, but record the **exact subset tested and exposed by Yume**, plus compat ranges. Do not promise arbitrary future OpenClaw marketplace plugins work after extraction. Claim compatibility only with tested packages and versions; show a version error for unsupported installs.

## License & attribution

At M0 inspect `LICENSE`, `THIRD_PARTY_NOTICES.md`, individual package headers, dependency licenses and embedded assets. Keep necessary notices for retained portions in the distributed/private codebase. If Yume later becomes OSS or sellable, re-review redistribution, trademarks and third-party license conditions; MIT does not negate other components' obligations.
