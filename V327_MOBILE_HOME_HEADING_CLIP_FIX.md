# V327 Mobile Home Heading Clip Fix

## Root cause

The global `common-heading.css` selector targeted `.schedule-section > .head` with `!important`, forcing the compact schedule title to 38–52px on mobile and overriding the home-specific 22px rule. The Quick Links heading also depended on a generic heading class without a reserved compact layout.

## Applied fix

- Replaced the schedule `.head` wrapper with a dedicated `.home-schedule-heading` wrapper.
- Added a dedicated `.home-command-heading` class to both Quick Links and Event Schedule.
- Forced stable PC 26px and mobile 22px heading sizes without inheriting the global page-heading system.
- Reserved explicit heading height and visible overflow.
- Added the gold accent line consistently to both headings, including RTL placement.
- Converted the authenticated member content to a real single-column grid flow so sections cannot overlap.
- Removed grid top margins that could visually separate headings from their controls.
- Kept Quick Links before Event Schedule in the actual HTML order.
