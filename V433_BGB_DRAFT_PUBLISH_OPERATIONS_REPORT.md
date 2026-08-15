# EZPK v433 — BGB Draft / Publish Operations Report

## Scope
v433 is a focused BGB admin operations change over the confirmed v432 baseline. It preserves the v432 BGB member display contract (`Industry Lv. + #1`) and separates editing/saving from public exposure.

## Confirmed UX changes
- Removed the manual `BGB 업데이트` date input from the top of Admin → BGB.
- Removed the `BGB JSON 백업` button and its BGB-specific download handler.
- Added a bottom publication status: `마지막 노출: YYYY.MM.DD HH:mm`, or `아직 노출되지 않았습니다.` when no publication metadata exists.
- Replaced the BGB bottom actions with equal 1:1:1 controls: `[새로고침] [저장] [노출]`.
- Existing toast feedback is retained with the confirmed copy:
  - Refresh success: `새로고침되었습니다.`
  - Save success: `저장되었습니다.`
  - Publish success: `노출되었습니다.`
- Processing labels remain `불러오는 중...`, `저장 중...`, `노출 중...` and the active button is disabled by the existing button wrapper while the request is running.

## Draft / Published contract
BGB remains stored in the existing D1 `strategy_content` row for key `bgb`.

The v433 canonical JSON shape is:

```json
{
  "schemaVersion": 2,
  "lastUpdated": "<published date>",
  "teams": "<published mirror>",
  "draft": {
    "savedAt": "<server ISO timestamp>",
    "teams": "<current admin draft>"
  },
  "published": {
    "publishedAt": "<server ISO timestamp>",
    "lastUpdated": "<Asia/Seoul YYYY.MM.DD>",
    "teams": "<public snapshot>"
  }
}
```

### Save
`저장` writes the current editor state only to `draft`. The existing `published` snapshot and top-level compatibility mirror are not changed, so incomplete work is not exposed publicly. Drafts may be incomplete (0–20 members per team).

### Publish
`노출` sends the current on-screen state directly, saves it as the latest draft, and promotes the same state to `published` in the same D1 write. The server generates `publishedAt` and the KST publication date. Publish preserves the previous BGB validation rule: each non-empty team must contain exactly 20 members.

### Legacy compatibility
A legacy v432 BGB record with only top-level `lastUpdated + teams` is treated as the existing published snapshot. Therefore the first v433 Draft save does not erase or replace the currently visible BGB. Old admin clients that omit the new `operation` field default to legacy publish behavior; the v433 client explicitly sends `draft` or `publish`.

## Public BGB behavior
`bgb/bgb.js` now prefers `published.teams` and `published.lastUpdated`. Legacy top-level data remains supported. Because top-level `teams` mirrors only the published snapshot, older public readers also do not see Draft changes.

## D1 / backup policy
No new migration is required. The existing tables remain authoritative:
- `strategy_content`: current combined Draft/Published BGB document.
- `strategy_content_history`: server-side pre-overwrite snapshots.

`writeStrategyContentD1()` is unchanged and still inserts the previous `strategy_content` JSON into `strategy_content_history` before every overwrite. Manual BGB JSON download is therefore removed without removing server-side history protection.

## Preserved v432 behavior
- `Industry Lv. + #1` in BGB lineup, final preview, and assignment member rows.
- Existing BGB sort choices and sort implementation.
- Vehicle #1 / #2 assignment priority and total CP balancing logic.
- Auto assignment, score/participation/win-loss logic and BGB location contract.
- 30/30 D1 migrations byte-exact.
- v401–v432 historical deploy guards byte-exact.
- Shared Header, v424 Header fitter, v421 mobile Alliance selector, v420 discovery cue, migration/request/admin auth fixes, Capital War and Season managers.

## Static/smoke validation
- `npm run predeploy`: PASS.
- BGB Draft/Publish transform smoke: PASS.
- Full 30-migration in-memory SQLite schema smoke: PASS; no new migration required.
- JS/MJS syntax and JSON parse gates: PASS.
- Final package re-extraction gates are recorded in `V433_VALIDATION.json`.

## Remaining live-host gate
With a real admin session, verify: load existing BGB → edit → Save → public BGB unchanged → refresh admin and Draft persists → Publish → publication status changes → public BGB changes → Toast feedback appears for Refresh/Save/Publish. Verify both desktop and mobile widths.
