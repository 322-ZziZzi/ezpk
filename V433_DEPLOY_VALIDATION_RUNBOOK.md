# EZPK v433 Deploy Validation Runbook

## 1. Deploy
Deploy the v433 package normally. No new D1 migration is required.

## 2. Existing-public-state preservation
Before making changes, open the public BGB page and note the current A/B lineup. Open Admin → BGB and confirm the previous data loads into the editor and the footer shows `마지막 노출` using existing legacy lastUpdated when no v433 publishedAt exists yet.

## 3. Draft isolation
Make a visible BGB edit and press `저장`.
Expected:
- button temporarily shows `저장 중...`;
- Toast shows `저장되었습니다.`;
- reload Admin → BGB and the edited Draft remains;
- public BGB page remains on the previous Published lineup.

## 4. Refresh
Make another unsaved edit and press `새로고침`.
Expected:
- dirty-change confirmation appears;
- after confirmation the D1 Draft reloads;
- Toast shows `새로고침되었습니다.`.

## 5. Publish
Prepare a publish-valid lineup and press `노출` without requiring a separate Save first.
Expected:
- button temporarily shows `노출 중...`;
- current screen state is saved as Draft and Published together;
- Toast shows `노출되었습니다.`;
- footer immediately updates to `마지막 노출: YYYY.MM.DD HH:mm`;
- public BGB displays the newly Published lineup and published lastUpdated date.

## 6. UI contract
Verify desktop and mobile:
- no top `BGB 업데이트` input;
- no `BGB JSON 백업` control;
- bottom `[새로고침] [저장] [노출]` buttons are equal 1:1:1 width;
- `Industry Lv. + #1` remains in all three BGB admin member-list contexts.

## 7. Regression checks
Verify existing BGB sort, auto assignment, location assignment, save state, and public member gate. Then smoke Admin Requests, Migration UID lookup, Migration Request Board access, and admin mobile drawer to ensure v426–v431 fixes remain intact.
