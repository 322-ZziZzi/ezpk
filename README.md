# EZPK War Portal v371

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
