> Current deploy-ready baseline: **v425 / 4.2.5** — multilingual flow-safe Mini Games cards across PC, tablet, and mobile, with CTA/content overlap structurally eliminated.

## v425 Mini Games Multilingual Flow-Safe Card Remediation

- Replaces fixed-height / absolute-positioned Mini Games card actions with a shared CSS Grid contract whose height is content-driven.
- Moves `PLAY` and `CURRENT GAME` into the normal-flow final action row, making text/action overlap structurally impossible across responsive layouts.
- Keeps PC/tablet same-row cards aligned by CSS Grid stretch while mobile (`<=560px`) becomes one column with each card using natural content height.
- Keeps descriptions visible on mobile instead of hiding translated copy to mask overflow.
- Allows status, title, description, and action labels to wrap safely; long title words use targeted `overflow-wrap:anywhere` without global `word-break:break-all`.
- Gives action controls a 44px minimum target, prevents horizontal overflow, keeps current-game state as non-link status content, and preserves visible focus rings.
- Removes Mini Games cards from the generic v419 Text-Fit ownership using `text-fit-v425.js`; card typography is no longer shrunk to solve translation overflow.
- Uses logical Grid alignment with no CTA left/right positioning, so Arabic RTL follows document direction naturally.
- Preserves v424 PC Header, v421 mobile Alliance selector, v420 discovery cue, all 30 D1 migrations, and Worker/API contracts.
- Adds v425 static policy gates for normal-flow CTA, no fixed card height, mobile description visibility, one-column narrow-mobile behavior, Text-Fit exclusion, 14-language coverage, and pseudo-long-copy resilience assumptions.
- Fresh live-host geometry checks remain the final gate for browser zoom/font-rendering combinations.
- See `V425_MINI_GAME_CARD_FLOW_REMEDIATION_REPORT.md` and `V425_DEPLOY_VALIDATION_RUNBOOK.md`.

## v424 PC Header Adaptive Expansion / Readability Finalization

- Raises PC Primary Navigation to 15px Normal, 14.5px Compact, and 14px Tight with a hard 14px floor; `More` follows the same typography.
- Treats the full grid track between Brand and Alliance/Account/Language actions as the Navigation allocation instead of leaving wide-screen space unused.
- Keeps Normal typography whenever it fits; Compact/Tight are entered only after real rendered geometry reports a collision/overflow.
- Dynamically promotes useful `More` items into Primary Navigation when real spare space exists: signed-in priority Season 6 → Tips → Request Board; guest priority Mini Games → Account Market.
- Keeps the current active page in Primary Navigation whenever possible, demoting the lowest-priority non-active item instead while preserving at least four visible Primary items.
- Uses 24px promotion / 8px retention hysteresis so items do not flap between Primary and More around resize boundaries.
- Rebuilds from canonical DOM order on each measurement and hard-resets promotion hysteresis on language/auth/navigation rebuilds.
- Hides `More` when it contains no links and keeps its active state synchronized when the active page remains inside More.
- Keeps member nickname ellipsis isolated to the nickname while preserving Rank and dropdown controls.
- Preserves v421 mobile Alliance selector, v420 hamburger discovery cue, v417 language authority, all 30 D1 migrations, and Worker/API contracts.
- Managed local Chromium still cannot complete headless rendering in this environment; live-host visual checks remain the final gate.
- See `V424_PC_HEADER_ADAPTIVE_EXPANSION_REPORT.md` and `V424_DEPLOY_VALIDATION_RUNBOOK.md`.

## v423 PC Header Readability / Fit Remediation

- Fixes the v422 regression where PC Primary Navigation could shrink to roughly 9.5–11px.
- Keeps desktop Primary Navigation at 14px in Normal/Compact and 13.5px in Tight; the runtime regression floor is 13px.
- Resets to Normal before every resize/language/auth re-measure so stale Compact/Tight state cannot survive.
- Uses actual rendered collision / nav-boundary geometry instead of width estimates to decide whether compaction is necessary.
- Reclaims space from Header gaps, Alliance Select, account controls, member-name width, and language control before touching Primary Navigation typography.
- Allows trailing low-priority Primary items to move into `More` only after Compact/Tight geometry still fails, and never below four directly visible Primary items.
- Keeps `More` at the same readable typography floor and synchronizes its active state when a moved item is active.
- Preserves the 1200–1439 compact Alliance label / >=1440 full Alliance label contract, with full translated `aria-label`/`title`.
- Preserves v421 mobile Alliance selector, v420 hamburger discovery cue, all 30 D1 migrations, and Worker/API contracts.
- Adds explicit Header regression audit fields for visible-primary minimum, Primary font floor, collisions, bounds, nav overflow, and moved count.
- Fresh live-host browser visual verification remains the final deployment gate because managed local Chromium could not complete headless rendering in this environment.
- See `V423_PC_HEADER_READABILITY_REMEDIATION_REPORT.md` and `V423_DEPLOY_VALIDATION_RUNBOOK.md`.

## v422 PC Header Navigation Regression Repair

- Prevented the earlier v419 fitter from moving every Primary Navigation link into `More`.
- Introduced the compact/full desktop Alliance label contract retained by v423.
- Superseded as active Header fit authority by v423 because its Tight typography could still shrink Primary Navigation too aggressively.

## v421 Mobile Alliance Context Selector

- Replaces the mobile Drawer’s single `Alliance Select` link with a two-button Alliance context selector in DUAL mode.
- Guest users see the selector at the top of the Drawer; authenticated users see it at the bottom.
- Uses the current theme variables for selected/unselected contrast, preserves a minimum 46px touch target, and exposes `aria-pressed` selection state.
- Switching Alliance navigates to the target Alliance host and lets that host re-resolve its own host-scoped session/permissions; no cross-alliance SSO is introduced.
- If a local form appears modified, the switch requires confirmation; buttons lock during navigation.
- SINGLE mode hides the selector and desktop Alliance selection remains unchanged.
- Preserves v420 persistent hamburger discovery cue and the existing 30 D1 migrations.
- See `V421_MOBILE_ALLIANCE_SELECTOR_REPORT.md` and `V421_DEPLOY_VALIDATION_RUNBOOK.md`.


## v420 Persistent Hamburger Discovery Cue Restoration

- Restores the original persistent mobile-menu discovery cue across the full responsive shared-header range (`<=1199px`).
- Removes the accidental two-iteration cap so the subtle gold glow/shake repeats about every three seconds for all users.
- Preserves the reduced-motion contract: motion disabled, static gold emphasis retained.
- Leaves v419 header compact-fit, language state, navigation, account, alliance-selector, DB/API/Worker behavior unchanged.
- Adds a v420 deployment guard for cue class presence, breakpoint alignment, infinite repetition, reduced-motion behavior, and stylesheet cache coherency.
- See `V420_MENU_DISCOVERY_CUE_REPORT.md` and `V420_DEPLOY_VALIDATION_RUNBOOK.md`.


## v418 Multilingual Responsive Text-Fit

- Preserves existing grids while preventing long 14-language UI translations from escaping buttons, tabs, cards, and menus.
- Fixes the global shared-header `nav` CSS scope leak that forced Home Quick Links to stay on one line.
- Adds group-level Normal / Compact / Tight text fitting with two-line tile support, actual overflow measurement, ResizeObserver/language-change recalculation, and user-data exclusions.
- Removes conflicting legacy shrink rules from Season 6 tabs and mini-game result buttons.
- Preserves all 30 D1 migrations and historical v414-v417 guards byte-for-byte.
- See `V418_TEXT_FIT_REMEDIATION_REPORT.md` and `V418_DEPLOY_VALIDATION_RUNBOOK.md`.

## v416 14-language full-UI remediation

- Completes the confirmed v416 i18n remediation scope across shared Header, Request, BGB, Capital War preview metadata, and all mini-games.
- Adds 14-language mini-game UI/accessibility localization while preserving the approved fixed-term whitelist.
- Adds `scripts/v416-deploy-guard.mjs`; `npm run predeploy` is now the v416 deployment gate.
- Preserves all 30 existing D1 migrations byte-for-byte; v416 adds no database migration.
- Runtime audit executed 25 user pages × 14 languages. 336 combinations were clean; Tip's 14 combinations are limited only by the audit harness's opaque `about:blank` origin and require the normal same-origin deployment smoke test.
- See `V416_I18N_REMEDIATION_REPORT.md` and `V416_DEPLOY_VALIDATION_RUNBOOK.md`.

## v401 Multi-Alliance / Migration Inquiry

- Added shared-code EZPK1/EZPK2 operation with server-side hostname-to-D1 routing: existing EZPK1 `DB` and independent EZPK2 `EZPK2_DB`.
- Preserved EZPK1 root-path compatibility while adding DUAL gateway/SINGLE mode and EZPK2 inactive handling.
- Kept member accounts, login sessions, and operational data independent per alliance; deleted members that later sign up are treated as new members with no cross-alliance history transfer.
- Added cross-alliance live nickname duplicate checks for signup and nickname-changing administrator/member flows.
- Added Migration Inquiry Session + applicant-only Request Board threads without turning Migration into member authentication.
- Moved Migration UID lookup below the Step 1 Next button and integrated the Migration hero into the common Heading System.
- Added the EZPK1-only eligibility card backed directly by the existing R2 promotion settings and an EZPK2 Migration CTA that is hidden when EZPK2 is inactive.
- Added additive D1 migration `0030_v401_multi_alliance_migration_inquiries.sql`.
- See `V401_MULTI_ALLIANCE_VERIFICATION.md` before deployment.

## v390 migration tier power criteria

- Updated Migration Step 4 to the published grades: Special, Advanced, Intermediate, and Normal.
- Added the displayed ranges `>200M`, `90M-200M`, `46M-90M`, and `0-46M`, ordered highest to lowest.
- Preserved the existing `gray` / `blue` / `purple` / `gold` stored enum keys for backward compatibility.
- Updated the prepared D1 migration-tier settings metadata and enabled power-range visibility.
- Step 4 remains a manual selection; vehicle power is not used to infer the grade automatically.

## v388 mobile migration step navigation UX remediation

- Removed the explicit top-of-page smooth scroll from normal Migration `Next` and `Previous` step transitions.
- Step changes now replace the step content without intentionally changing the user's current scroll position.
- Intentional top navigation remains for Final Review `Edit`, invalid-submit recovery, and the success screen.
- No database or Worker API contract changes from v387.

## v387 migration application implementation
- Replaced the guest Home migration Google Forms link with the internal `/migration/` flow.
- Added a guest-only 7-step migration application with Korean, English, Portuguese, Vietnamese, Arabic, Japanese, Thai, and Traditional Chinese localization.
- Added D1 migration `0026_v387_migration_applications.sql` for applications, migration-tier settings, rate-limit state, and the `migration` admin-menu permission.
- Added Worker APIs for public submission, admin list/detail/status/contact/memo, and superadmin edit/soft-delete/restore.
- Added the admin `지원 > 이민 신청` list/detail workflow, append-only activity history, English Excel export, and English full-screen image export.
- Applicant-entered free text remains in the original language without automatic translation.
- Migration visibility is anonymous-only; authenticated users are redirected to Home if they open `/migration/` directly.
- Updated shared-header cache keys so the new migration route and visibility rules take effect across the site.

## v386 system-account identity fix

- System accounts are now identified by `members.login_id`, not by nickname.
- The login ID `ezpk_koala` is excluded even when its visible nickname is `koala`.
- Public member and tier lists, totals, search, rankings, votes, and operational member queries now use the corrected account-ID filter.

# EZPK War Portal v390


## v385 system-account count fix

- System accounts remain visible in the administrator member-management list.
- `ezpk_koala` is excluded from administrator member totals and status counts.
- System accounts are excluded from shared operational member data used by BGB and Season 6 management.

## v385 · Operational sub-admin account hidden from member list

- The `ezpk_koala` account remains available for login and sub-administrator permissions.
- It is excluded from the public alliance member list, member totals, power totals, and search results.
- The admin member-management screen still retains the account so its login and permissions can be maintained.

## v382 · Two sub-administrator support

- Allows up to two sub-administrators.
- Adds separate menu permission management for each sub-administrator.

## v381 · PC placement action controls

- Adds explicit add, move, and remove buttons to the PC member detail panel.
- Disables position changes for fixed members and shows the fixed-position guidance beside the controls.
- Keeps PC drag-and-drop and member exchange behavior unchanged.

## v380 · Mobile alliance placement panel

- Adds a mobile full-screen member picker with unplaced/placed tabs and nickname search.
- Supports adding, moving, exchanging, and removing members through explicit action buttons.
- Keeps fixed-position guidance in the selection panel and picker badge while preserving nickname space inside map buildings.
- Keeps PC drag-and-drop and mobile long-press movement, undo, dirty-state preservation, and partial-layout publishing.

## v379 · Publish with unplaced members

- Allows a valid partial alliance layout to be published when one or more active members remain unplaced.
- Shows the administrator a confirmation warning with the placed and unplaced counts before publishing.
- Still blocks empty layouts, duplicate members, duplicate ranks, duplicate coordinates, inactive members, and positions outside the fixed 100 slots.

## v378 · Project file cleanup

- Consolidates release history in this README and removes accumulated `V###_*.md` files.
- Merges the one-time new-game ranking normalization SQL into `SUPABASE_GAME_SETUP.sql`.
- Removes the superseded standalone ranking FIX SQL; runtime JS, CSS, migrations, and setup files remain intact.

## v377 · Fixed 100-slot alliance layout

- Adds selectable empty buildings, unplaced-member placement, PC drag and drop,
  mobile long-press movement, undo, publish validation, and 100-slot public rendering.

## v376 · My Page session compatibility fix

- Keeps My Page available when the optional v374 notice-dismiss migration is
  still pending in D1.
- Preserves the valid login session and skips only the unavailable rank-change
  notice instead of showing the login-required state.
- Existing rolling 365-day login behavior remains unchanged.

## v375 · Collapsible protection status and Korean promotion labels

- Rank-protection information is collapsed to a one-line `title · D-day` summary by default.
- Members can expand the summary to read the protection reason and end date.
- The expanded/collapsed preference is remembered in the current browser.
- Korean promotion labels now use `산업 레벨` and `차량 #1`; other languages retain `IND` and `Vehicle #1`.

## v374 · Multilingual rank-change notice dismissal

- Added a translated `다시 보지 않기` action in all 8 supported languages.
- Dismissal is stored per member and per rank-change record in D1, so it applies across devices.
- A later promotion or demotion creates a new notice and is shown normally.
- Undismissed notices still expire automatically after 30 days.

## v373 · Fully vertical multilingual mobile promotion card

- Keeps the PC promotion layout unchanged.
- Converts the mobile title, progress count, spec requirements, and every activity requirement into independent full-width rows.
- Prevents overflow for all eight languages and enlarged mobile text with min-width, wrapping, and bounded progress rules.
- Adds correct Portuguese and English singular/plural activity units.

## v372 · Mobile promotion requirement layout

- Keeps the established two-column promotion layout on PC.
- Stacks IND and Vehicle #1 as full-width mobile rows.
- Separates translated Current/Required labels from their values so all eight languages fit cleanly.
- Uses the shared labels `IND` and `Vehicle #1` in every language.

## v371 · Rank maintenance and demotion review

- Adds the multilingual 30-day rank-maintenance card for R2 and R3 members.
- Reuses the same activity evidence for 14-day promotion and 30-day maintenance evaluation.
- Adds matching admin demotion review, required confirmation reason, temporary exclusions, protection visibility, and rank-change history.
- Protects promoted members for 10 days and R3→R2 demoted members from further review for 30 days.
- Grants demotion operations to subadmins with Member Management permission.
- Migration: `0024_v371_rank_maintenance.sql`.

## v370 · Promotion admin UX and delegated permissions

- Replaces the native white activity dialog with a responsive dark PC/mobile confirmation modal.
- Adds selectable activity cards, a 100-character memo counter, disabled-until-valid submit, dirty-close confirmation, and duplicate-submit protection.
- Grants every promotion operation to subadmins who have Member Management permission, including rule changes, activity confirmation, cancellation, and R2/R3 promotion.

## v369 · Promotion activity requirements

- Requires two of four recent-14-day activity signals in addition to both promotion spec requirements.
- Tracks KST daily visits, vote participation, real member-owned spec changes, and 14-day admin confirmations.
- Adds Korean admin confirmation controls and an eight-language member activity view.
- Shows the member's latest successful self-update timestamp in Detailed Specs.
- Migration: `0023_v369_promotion_activity.sql`.

## v368 · Multilingual promotion requests

- Localizes the prefilled promotion-request title, body, and duplicate-pending notice in all eight supported languages.
- Reloads the member's latest rank, IND, and Vehicle #1 value before composing the request.

## v367 · Promotion workflow

- Configurable R1→R2 and R2→R3 requirements stored in D1.
- Eight-language My Page progress card and promotion-request handoff.
- Admin candidate view with final confirmation, latest-data revalidation, immediate rank update, and activity logs.
- Migration: `0022_v367_promotion_system.sql`.

Current baseline: v256 Capital War assignment synchronization and unassigned statistics.

This version retains the v255 in-app browser guidance and canonical host normalization fixes.

## v239 Menu & Capital War Finalization

See `V239_CHANGELOG.txt`.

## v238 Capital War System

See `V238_CHANGELOG.txt`.

# EZPK v188 — D1 Admin Member Manager

# EZPK v187 — D1 Member List Integration & UI Fixes

# EZPK v186 — Login & Sign Up System

# EZPK v184 — Common Login Frame

# EZPK War Portal v170

- Fixed the Season 6 mobile menu overlap that occurred only around the team assignment cards.
- Scoped the shared sticky header styles from the global `header` element to `.site-header`.
- Reset `.team-card-head` to a normal static card header so it cannot appear above the mobile navigation popup.
- Updated CSS cache versions to ensure the fix loads immediately after deployment.
- See `V170_CHANGELOG.txt` for details.

# EZPK War Portal v169

- Zombie Defense: clean external HUD, bomb pickups, reduced bomb scoring, bomb score/combo caps, and visual phase cues.
- Hero Merge: fixed merge scores, active-move score, combo milestone bonuses, and reduced highest-hero bonuses.
- See `V169_CHANGELOG.txt` for full details.

# EZPK War Portal v158

- Added Season 6 Building Guide between Latest Information and Hero Information.
- Added 8 localized WebP guide images with automatic language switching.
- Reused the existing common `.frame > .stage > img` viewer, preserving mobile pan, page scroll and pinch zoom behavior.
- Added a localized Season 6 quick navigation menu.

# EZPK War Portal v154

Based on v153.

- Treasure Hunter: 60-second timer; required treasure count increases by 1 every 5 waves.
- Survival: mobile D-pad replaced by a 360-degree analog joystick.
- Tank Battle: mobile D-pad replaced by a 360-degree analog joystick; enemy HP rises every 5 waves; enemy-count increase capped at 30%.
- Missile Defense: 14 ammo for waves 1-5, 16 ammo from wave 6; all enemy missiles move 10% faster.

# EZPK War Portal v150

- Fixed the mobile mini-game ranking pagination being hijacked by the global site navigation CSS.
- Restored the intended mobile heading flow: eyebrow, game title, subtitle, game library, gameplay, ranking list, then pagination.
- Forced stable ranking panel order across all 8 mini games.
- Tank Battle difficulty increased by one progression step.
- Tank Battle action speed increased by 20% for player movement, projectiles, enemy movement, firing cadence, and spawn tempo.
- Preserved v149 start, game-over, replay, ranking submission, multilingual, and mobile controls behavior.

# EZPK War Portal v139

Based on v138.

## v139 changes
- Restored shared language selection on all four new game pages.
- Added immediate language switching, persistence, RTL support, and Simplified Chinese support while preserving existing languages.
- Localized new-game titles, descriptions, start/result UI, HUD, ranking text, and game library.
- Reworked Treasure Hunter, Zombie Defense, Portal Escape, and Hero Merge for action within the first three seconds.
- Added faster opening encounters, combos, multipliers, progressive difficulty, special zombies, multi-level portal runs, and guaranteed opening merges.
- Fixed Hero Merge viewport sizing by calculating available height after status and controls.
- Preserved responsive board fitting on desktop and mobile.
- Updated asset cache versions to v1390.


## v140 - Unified 8-language system
- Unified legacy and new games under one language state and storage key.
- Supported languages: ko, en, pt, vi, ar, ja, th, zh-tw.
- Removed Simplified Chinese (zh-cn) from menus and new-game translations.
- Added full Portuguese copy for the four new games.
- Shared header now owns language selection; game pages react to one common event.
- Unsupported saved language values safely fall back to English.


## v141
- Hero Merge 점수/시간/사운드 HUD를 게임 화면 위 독립 영역으로 유지
- 방향 컨트롤러를 게임 화면 밖 하단 독립 영역으로 이동
- 게임 화면 내부에는 목표/콤보 상태와 4×4 보드만 표시
- 보드 크기 계산에서 컨트롤러 높이를 제외하여 상단 잘림 방지

## v142
- Hero Merge 내부 grid 구조를 `상태 + 보드`의 2행으로 정리
- v141에서 남아 있던 빈 세 번째 행 제거
- 모바일에서 불필요한 세로 여백과 보드 위치 흔들림 방지
- 점수/시간/사운드 HUD는 게임 화면 위, 방향 컨트롤러는 게임 화면 아래 구조 유지
- Hero Merge CSS 캐시 버전을 v1420으로 갱신

## v143
- Unified the game-library title localization for all eight mini games.
- Added localized names and descriptions for the four original games in Korean, English, Portuguese, Vietnamese, Arabic, Japanese, Thai, and Traditional Chinese.
- Original-game page hero titles now change immediately with the selected language.
- Updated the mini-game switcher cache version to v1430.


## v144
- Moved Hero Merge target tier and combo status out of the game screen.
- The game screen now contains only the centered 4x4 board.
- Applied the same structure to desktop and mobile layouts.
- Status is shown during play and hidden before/after gameplay.

## v145
- Unified the four new games' mobile start flow with the existing games.
- Mobile start overlays now show only nickname input and start button while keeping the game description above the game.
- Added ranking-confirmation overlays and replay buttons after viewing rankings.
- Preserved nickname values for immediate replay.


## v146
- Treasure Hunter exit state persistence and automatic clear after key + treasure.
- Zombie Defense early difficulty reduced by about 1.5 levels.
- Portal Escape wall touches end the run from Stage 1.
- Hero Merge game over only when the full board has no possible merges.
- Tank Battle immediate action, faster movement/fire, stronger impact, and kill combos.
- Missile Defense faster pacing, one-level difficulty increase, immediate threats, and interception combos.

## v147
- Tank Battle difficulty reduced by approximately one level while preserving v146 combat speed and combo feedback.
- Unified the desktop start-screen layout across all eight games.
- Desktop start screens now consistently include the translated game title, play instructions, nickname label/input, start button, and control guide.
- Mobile start screens remain compact with nickname input and start button only.
- Start-screen content supports ko, en, pt, vi, ar, ja, th, and zh-tw, including RTL layout for Arabic.


## v148
- Fixed all 8 mini-games so the start overlay is completely removed after a valid start.
- Added a high-priority `[hidden]` rule and pointer-event release so invisible overlays cannot block play.
- Added Enter-key start support to all 8 mini-games.
- Preserved the v147 unified PC start layout, mobile compact layout, 8-language localization, RTL support, and Tank Battle balance.
- Added a subtle gold glow animation to the Account navigation item only, on desktop and mobile.
- The Account glow is attached to a stable menu class, so it remains active after language changes.
- No NEW/HOT/Premium badge was added.


## v149 — Game Over result flow restoration
- Restored the result overlay for all 8 mini-games after a game ends.
- Fixed the v148 hidden overlay inline-style issue by using the shared showOverlay148() helper.
- Result screen shows the final score/message plus Replay and View Ranking buttons.
- View Ranking opens the ranking state, then the Play Again button starts a new game with the saved nickname.
- Preserved v148 game-start behavior: Start button, Enter-to-start, complete start-overlay hiding, pointer-event release, 8-language localization, Arabic RTL, Tank Battle balance, and Account menu gold glow.
- Updated modified game script cache versions to v1490.


## v151
- Replaced the Account menu glow with a multilingual CSS shine-sweep animation on desktop and mobile.
- Treasure Hunter levels 1–9 keep the existing balance.
- Treasure Hunter difficulty increases by about 10% at levels 10–14, 20% at 15–19, and 30% from level 20 through additional bombs and greater spacing between the key, treasure, and exit.
- Existing remembered-exit and automatic clear behavior remain unchanged.
- Updated cache versions for shared header, global style, and new-game assets to v1510.

## v153
- Tank Battle enemy vehicle count now increases additively by 20% every five waves: 100% at waves 1–4, 120% at 5–9, 140% at 10–14, and so on.
- The increase affects enemy spawn count only; existing movement speed, projectile speed, fire cadence, AI, and base spawn timing remain unchanged.
- Upgraded the Account menu to Premium Shine Sweep 2.0 with a wider/brighter sweep, temporary white-gold text, a subtle 1.04 scale pulse, and stronger glow/aura.
- Account emphasis remains language-independent and applies on desktop and mobile across all eight languages.
- Updated modified global and Tank Battle cache versions to v1530.


## v153
- Fixed duplicate language/menu event handlers on non-game pages.
- Shared header now exclusively controls language dropdown and mobile navigation.
- General pages listen to ezpk-language-change and re-render their own translations.
- Existing game translation behavior preserved.
- JavaScript cache query versions updated to v1530.

## v155
- Zombie Defense: zombie movement speed reduced by 12%.
- Survival: incoming missile, shell, and drone movement speed reduced by 15%.
- Survival and Tank Battle: virtual joystick knob enlarged to approximately 1.3x.
- Audio stability: reused and resumed Web Audio contexts so effects continue during long play and replay.


## v156
- Shared GameAudio system for all mini games.
- Survival: 1,000 points/sec, 60-second +10,000 bonus, dodge/near-miss rewards.
- Zombie Defense: smoother 10-second difficulty stages, high-difficulty from 45 seconds, hit/kill-driven scoring targeting 70,000+ around 60 seconds.
- Zombie Defense ranking scores normalized to integers.


## v163 - Unified game ranking service
- Added `game-ranking-service.js` as the single shared Supabase ranking module for all 8 mini games.
- Existing game URLs and gameplay files remain unchanged.
- Existing game IDs and legacy local ranking keys are preserved.
- New games continue to share `new-game.js`, while ranking storage and loading are delegated to the shared service.
- No additional SQL migration is required beyond `SUPABASE_GAME_SETUP.sql`.

## v164
- Added a shared ranking result flow for all eight mini games.
- Mobile: VIEW RANKING scrolls to the current ranking, allows a short review, then returns to the game with the ranking-confirmed replay popup.
- PC: VIEW RANKING scrolls to the ranking area when needed and prepares the ranking-confirmed replay popup inside the game frame.
- Removed the need for a separate ranking-confirmation button.

## v165 - New game publishableKey ranking integration
- Explicitly fixed the four new games to the shared `game-ranking-service.js` path.
- `treasure-hunter`, `zombie-defense`, `portal-escape`, and `hero-merge` save and load rankings using their own `game_id`.
- Browser Supabase authentication prioritizes `EZPK_SUPABASE_CONFIG.publishableKey`; `anonKey` remains only as a legacy fallback.
- Remote save/load failure still preserves the score in the existing monthly local fallback.
- Updated new-game and ranking-service cache versions to `v1650`.

## v166 unified game result modal fix
- Fixed post-ranking replay modal remaining invisible because inline `display:none` was not cleared.
- Applied one shared result modal stylesheet to all eight mini games.
- Normalized result action and post-ranking card classes across legacy and new games.
- Ranking refresh failure no longer blocks the replay confirmation flow.
- Mobile: ranking review for 1.8 seconds, then return to the game and show replay.
- PC: ranking view, then prepare the replay confirmation inside the game frame.


## v167
- Unified the Korean result action label as `순위 보기` across all eight mini games.
- Applied eight-language behavior to the shared result and post-ranking modal flow, including the score caption and Arabic RTL direction.
- Kept the shared header language selector above game overlays so it remains usable while result popups are open.
- Standardized nickname input text as bold in every shared start popup.
- Changed mobile result buttons from stacked rows to one horizontal row while keeping the popup inside the game frame with responsive sizing.


## v171
- Account Showcase registration inquiry updated with multilingual Discord and Ingame-DM copy controls.


## v174
- Season 6 and BGB conditional alliance protection fixes. See `V174_CHANGELOG.txt`.


## v190-b deployment
Run the D1 migration before deployment:
`npx wrangler d1 migrations apply ezpk-db --remote`
Then deploy with `npx wrangler deploy`.


## v224
See `V224_CHANGELOG.txt` for the finalized profile and Member List UX changes.


## v226
- Added D1 migration `0014_v226_nullable_profile_fields.sql`.
- `members.power` and `members.industry_level` now allow NULL as the real unregistered state.
- New signups and profile resets store NULL instead of placeholder values `1 / I1`.
- Existing placeholder records are converted to NULL only when `profile_specs_registered = 0`.
- Member List display, sorting, and registration status now use the actual NULL values.
- Profile reset failures return `SPEC_RESET_DB_ERROR`; My Page logs the API details and shows the error code.
- Apply the remote migration before deploying the Worker: `npx wrangler d1 migrations apply DB --remote`.

## v246
- Added a guest-only mobile discovery cue to the top-right hamburger menu.
- The menu button receives a subtle gold glow and a 1–2px wiggle approximately every 3 seconds.
- The cue starts only after authentication confirms that the visitor is not logged in, preventing flashes for signed-in members.
- Opening the mobile menu once stores `ezpk-mobile-menu-discovered-v246` in localStorage and permanently stops the cue for that browser.
- Users with reduced-motion preferences receive a static gold highlight instead of animation.

## v248
- Updated the top-right hamburger menu discovery cue to remain active for every mobile user.
- The subtle gold glow and 1–2px wiggle repeat approximately every 3 seconds for both signed-in and signed-out users, even after the menu has been opened before.
- Removed the v246 localStorage discovery flag and the one-time dismissal behavior.
- Desktop behavior remains unchanged, and reduced-motion users receive a static gold highlight without the wiggle animation.
- Preserved all v247 Capital War manual assignment features and existing project behavior.



## v263
Member list now switches immediately between public and tier views after verified login/logout without requiring refresh or navigation.


## v264
- Fixed mobile logged-in tier member cards being clipped while keeping the 3-column layout.
- Removed the mobile card aspect-ratio constraint and allowed content-driven card height.
- Added a consistent mobile minimum card height and bottom spacing.
- Reserved a stable nickname row with single-line ellipsis.
- Anchored alliance rank and the localized own-card marker independently from content flow.
- Kept the stats block at the bottom and guaranteed enough height for all four rows including CP.
- Updated member page asset cache version to 2640.

## v385 system account separation
- `ezpk_koala` is treated as a system account for sub-administrator access only.
- It is excluded from public member lists, search, member statistics, promotion/demotion candidates, alliance layout eligibility, and vote participation/results.
- It remains visible and manageable in the administrator member-management screen.

## v398
Migration image export header cleanup: removed the visible sorting-description text while preserving the existing export sort logic, page indicator, timestamp, tier colors, and Vehicle 1 display.


## v399
- 관리자 이민 신청 목록에 `정렬` 메뉴를 추가했습니다. 버튼 문구는 항상 `정렬`로 유지되며 내부 기본값은 티어 순입니다.
- 티어 순은 특급 → 고급 → 중급 → 일반, 동일 티어는 1번 차량 → 2번 차량 → 산업 레벨 내림차순으로 정렬합니다.
- 신청 행/모바일 카드 왼쪽 체크박스, 상단 전체 선택/해제, 선택 수 표시를 추가했습니다.
- 선택 신청을 접수됨/검토 중/승인/거절로 대량 변경할 수 있으며 성공/실패 결과와 Audit 기록을 남깁니다.
- 이미지 다운로드 표 시작 전에 특급/고급/중급/일반 인원 요약 바를 절제된 기존 UI 톤으로 추가했습니다.
- 이미지/Excel의 기존 고정 내보내기 정렬, Excel Import v397 호환성, 기존 DB migrations는 유지합니다.


## v400
- 이미지 다운로드 상단 티어 인원 요약 바의 한국어 표기를 영문으로 수정했습니다.
- 요약 라벨은 `Special / Advanced / Intermediate / Normal`을 사용하며, 인원 숫자 뒤의 한국어 `명` 표기는 제거했습니다.
- 요약 집계, 티어 색상, 이미지 고정 정렬, 관리자 목록 정렬/대량 상태 변경, Excel Import 동작은 변경하지 않았습니다.


## v417 — Global Language State Synchronization

Single `window.EZPKLanguage` authority. See `V417_LANGUAGE_STATE_SYNC_REPORT.md`.

## v4.2.2 / v422 — PC Header Navigation Regression Repair

The shared PC Header no longer moves primary navigation links into `More` to make room for Alliance Select. v422 keeps all direct primary navigation exposed on desktop, compacts only typography/gaps/actions, and uses a short translated Alliance label at 1200–1439px with the full translated label preserved for accessibility and wider desktop. v421 mobile/tablet Alliance selector behavior is unchanged. See `V422_PC_HEADER_NAVIGATION_REGRESSION_REPAIR_REPORT.md`.
