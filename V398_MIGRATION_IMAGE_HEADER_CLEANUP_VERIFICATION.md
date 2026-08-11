# V398 Migration Image Header Cleanup Verification

- Base: EZPK-v397
- Change scope: image export header text only.
- Removed the visible sorting-description sentence from generated migration-list PNG files.
- Retained page number and generated timestamp.
- Export sorting logic is unchanged: state ascending, vehicle 1 descending, vehicle 2 descending, industry descending, created-at ascending, id ascending.
- Excel export metadata and sorting information are unchanged.
- No database migrations changed or added.
