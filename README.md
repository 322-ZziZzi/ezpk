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
