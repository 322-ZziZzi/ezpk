# EZPK v434 — Deploy Validation Runbook

## A. Admin Promotion M/G

1. Sign in to EZPK2 Admin with Member Management permission.
2. Open Member Management → Promotion Conditions.
3. Confirm R2/R3 Vehicle #1 each has a numeric field plus M/G selector.
4. Set a test rule to `500 M` and save.
5. Reload Admin and verify the value remains `500` and unit remains `M`.
6. Confirm the preview reads `연맹원 표시: 필요 500M`.
7. Open an R1 member My Page and verify the requirement reads `필요 500M`, not `0.5G`.
8. Change the same requirement to `0.5 G`; save/reload and verify My Page displays `필요 0.5G`.
9. Verify eligibility comparison is equivalent for 500M and 0.5G.
10. Verify existing G-only promotion settings continue to load and save.

## B. Promotion semantic colors — EZPK2 My Page

Check an incomplete and a complete promotion case:

- Complete current value: Green `#15803D`.
- Missing current value: Red-orange `#C2410C`.
- Partial progress current value: Blue `#1D4ED8`.
- Required target value: Gold `#A16207`.
- Admin confirmation pending: Amber `#B45309`.
- Complete requirement card border: Green.
- Missing requirement card border: Red-orange.
- Progress requirement card border: Blue.

Confirm layout/copy/column structure did not move.

## C. EZPK2 Admin semantic light theme

Check desktop and mobile Admin:

- Operations/Member group: Blue.
- Teams/BGB/War group: Gold.
- Support/Request group: Purple.
- System group: Teal.
- Save/primary actions: Blue.
- Publish/activate/promotion-confirm actions: Green.
- Secondary actions: White/Slate outline.
- Delete/destructive actions: Red.
- Input focus: Blue border/ring.
- Success Toast: Green.
- Error Toast: Red.
- Migration private/support badge: Purple.

Confirm normal page/card backgrounds remain white/light slate and no large card is filled with a saturated semantic color.

## D. Regression checks

- Admin authentication resolves and mobile hamburger/Drawer works.
- Admin Request Board loads member + migration inquiries.
- Migration UID lookup works signed out.
- Migration applicant can enter Request Board without alliance login after UID verification.
- Migration inquiry admin delete works on current production D1 schema.
- BGB Draft Save does not change public BGB.
- BGB Publish updates public BGB and last exposure.
- BGB member rows still show `Industry Lv. + #1`.
- Capital War, Season, Vote, Migration, Accounts and System panels retain existing behavior.

## E. Asset/cache checks

Required active v434 tokens:

- Admin `admin.css?v=4340`
- Admin `member-manager-v188.css?v=4340`
- Admin `member-manager-v188.js?v=4340`
- Admin `/ezpk-theme.css?v=4340`
- My Page `my.js?v=4340`
- My Page `/ezpk-theme.css?v=4340`

v433 BGB `admin.js?v=4330` remains unchanged because its JavaScript behavior is preserved.

## F. Production final gate

Validate on EZPK2 at PC and mobile widths, including 100%, 125%, and 150% browser zoom. Verify hard refresh/cache replacement at least once because v434 intentionally updates Admin/My Page asset tokens.
