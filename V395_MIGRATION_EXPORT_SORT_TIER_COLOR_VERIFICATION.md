# V395 Migration Export / Image List Verification

## Scope
- Base: EZPK-v394.zip
- Admin migration action order:
  1. 삭제된 신청
  2. 이미지 다운로드
  3. 엑셀 업로드
  4. 엑셀 내보내기
  5. 업로드 양식
- Export/image common sorting:
  - Current State ascending (numeric normalization)
  - Vehicle 1 power descending
  - Vehicle 2 power descending
  - Industry level descending
  - Created at ascending
  - ID ascending
- Missing power/industry values sort after populated values within the same preceding sort group.
- Export/image fetch the complete filtered result set independently of the on-screen 500-row list, up to the API's existing 1000-row export limit.
- Current status filter and search term are preserved.

## Image list
- Columns: State / Player / Tier / Vehicle 1 / Industry
- Vehicle 2 remains a sort-only field and is not displayed.
- Tier is rendered as a colored badge plus text.
- Up to 50 applications per PNG page to avoid oversized browser canvases.
- Multi-page output provides a PNG download link per page.

## Excel export
- Same sorted item collection as image export.
- Tier cells carry distinct fill/text colors plus the tier name.
- UID cells are explicitly kept as text.
- Added information sheet: export time, status filter, search term, total, sort rule.
- Auto-filter, column widths, and key numeric alignment applied.

## Preserved
- v394 super-admin-only Excel import and official import template behavior.
- Migration UID duplicate guard and import audit/idempotency behavior.
- No DB migration added.
