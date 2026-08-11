# V396 Migration Excel Import Row Reason Verification

- Base: EZPK-v395
- No database migration added.
- Existing non-deleted UID: excluded row only; existing application remains authoritative and is not overwritten.
- File-internal duplicate valid 16-digit UID: every occurrence is excluded; preview lists all involved Excel row numbers.
- Row statuses separated into: ready / existing / file_duplicate / invalid.
- Preview summary separates existing UID exclusions, file duplicate exclusions, and input errors.
- Summary cards filter preview rows by status.
- All validation messages for a row are shown together.
- Vehicle 2 unit is ignored when Vehicle 2 power is blank; this is a non-blocking notice.
- Vehicle 2 power present without M/G unit remains an input error.
- Numeric Excel vehicle-power cells are rounded to two decimals before validation to avoid binary floating-point tail false errors.
- UID numeric cell remains rejected to protect 16-digit UID precision; UID must be a text cell.
- Commit revalidates against current DB immediately before inserts and skips newly-existing UIDs without failing the batch.
