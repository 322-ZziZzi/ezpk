# V399 Migration List Sort / Bulk Status / Tier Summary Verification

## Confirmed scope
- Admin list sort control: static label `정렬`, default internal mode `티어 순`.
- Sort options: 티어 순 / 신청 순 / 서버 순 / 1번 차량 높은 순 / 산업 레벨 높은 순 / 닉네임 순.
- Default tier ordering: Special(gold) > Advanced(purple) > Intermediate(blue) > Normal(gray), then Vehicle 1 DESC > Vehicle 2 DESC > Industry DESC > application date/id stable order.
- Row/card selection checkboxes plus one top master checkbox for select-all / clear-all.
- Search/status-filter changes clear selection; sort changes preserve selection.
- Bulk application-status change supports received/reviewing/approved/rejected. Rejected bulk changes require one shared rejection reason.
- Bulk result has only success/failure counts; no separate skip state.
- Bulk submit sends each selected row's `updatedAt` and current status. If another administrator changes the row before commit, that row is reported as a failure instead of being silently overwritten.
- Bulk audit writes individual application status history with a shared `bulkActionId` plus one grouped activity log.
- Image export adds a compact four-card tier count summary immediately before the table: 특급 / 고급 / 중급 / 일반.
- Image export fixed sorting and Excel export fixed sorting are unchanged from v395-v398.
- No database migration added. Existing migration files must remain byte-identical.
