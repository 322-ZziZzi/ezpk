# V328 Mobile Quick Grid Absolute Position Fix

## Root cause

The legacy global mobile rule targeted every `nav` element and applied `position:absolute`, offsets, background, and padding. The authenticated home Quick Links grid is also a `nav`, so it was removed from normal document flow. The Event Schedule then moved upward and covered the Quick Links buttons.

## Fix

- Reset the Quick Links `nav` to static positioning with explicit `!important` overrides.
- Cleared inherited top/right/bottom/left offsets.
- Removed mobile-menu background, padding, border radius, shadow, and overflow rules from the Quick Links grid.
- Kept the real PC 4×1 and mobile 2×2 grid behavior.
- Preserved the dedicated Quick Links and Event Schedule headings from v327.
