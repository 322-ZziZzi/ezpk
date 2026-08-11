# V400 Migration Image Tier Summary English Verification

## Scope
- Image export tier summary labels only.

## Confirmed change
- `특급` -> `Special`
- `고급` -> `Advanced`
- `중급` -> `Intermediate`
- `일반` -> `Normal`
- Removed the Korean `명` suffix from tier counts; counts are rendered as plain numerals.

## Preserved behavior
- Tier summary order: Special / Advanced / Intermediate / Normal.
- Tier colors and counts are unchanged.
- Image export sort logic is unchanged.
- Admin list sorting and bulk status actions are unchanged.
- Excel export/import behavior is unchanged.
- Database migrations are unchanged.
