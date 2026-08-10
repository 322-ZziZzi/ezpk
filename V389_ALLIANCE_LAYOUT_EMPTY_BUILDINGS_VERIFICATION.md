# V389 Alliance Layout Empty Buildings Verification

## Scope
- Preserve member placement ranks 1-100 and existing database position rows.
- Expose all 102 physical building cells around the 2x4 Frankie footprint.
- Keep auto-place capped at 100 members.
- Treat every physical non-Frankie cell as a valid manual placement coordinate.
- Therefore, with 100 placed members, exactly two cells render as movable Empty Buildings.

## Behavior
- Moving a placed member into an Empty Building preserves the member rank and moves the vacancy to the member's previous coordinate.
- Drag/drop, desktop selection, and mobile fullscreen selection use the same 102-cell valid coordinate set.
- Auto-place continues to use the existing 100-member default template; direction changes may reset the two default empty cells, after which they can be moved again manually.
- Published layout API now returns `slotCount: 102` and all 102 physical slots, so public desktop/mobile maps and generated layout images show the two empty buildings instead of invisible holes.
- No database migration is required.

## Validation
- Maximum positioned members remains 100.
- Member IDs, ranks, and coordinates must remain unique.
- Coordinates are valid when they are any of the 102 non-Frankie cells for the selected direction.
