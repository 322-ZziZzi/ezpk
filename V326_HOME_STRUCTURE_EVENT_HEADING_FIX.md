# V326 Home Structure and Event Heading Fix

## Applied changes

- The authenticated home HTML now follows the real visual and accessibility order: Quick Links → Event Schedule.
- CSS flex/order overrides used to reverse those sections were removed.
- The home main area remains hidden while authentication is pending to prevent visible layout shifts.
- Quick Links and Event Schedule spacing was reduced on PC and mobile.
- The schedule eyebrow and description were removed.
- The translated Event Schedule title is the only remaining heading.
- The heading uses a restrained gold accent line, left alignment on LTR layouts, and a right-side accent on RTL layouts.
- PC title size is 26px; mobile title size is 22px.
- Existing compact event cards, ST-only time, 8-language translations, and expand/collapse behavior remain unchanged.
