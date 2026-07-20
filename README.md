# EZPK v124

- GitHub JSON 저장 로직을 최신 SHA 기반으로 통일했습니다.
- data/members.json, data/bgb.json, data/events.json, data/season6-teams.json은 저장 직전에 최신 SHA를 다시 조회합니다.
- data/accounts.json도 기존 최신 SHA 조회 및 409/422 자동 재시도 방식을 유지합니다.
- 409 또는 422 충돌 시 해당 파일의 최신 SHA를 다시 조회한 뒤 1회 자동 재시도합니다.
- GitHub 오류 발생 시 실제 오류 메시지를 표시합니다.

# EZPK v121 — Account Showcase Header Update

- Changed the Account Showcase hero to a two-line structure: ACCOUNT / SHOWCASE.
- Applied the same Arial/Noto Sans menu font style and weight used by the shared navigation.
- Localized both header lines across all 8 supported languages.
- Kept the existing subtitle, Account Registration, and Discord contact block unchanged.

EZPK v120

- Added Account Registration and Discord: zzizzi_ beneath the Account Showcase subtitle.
- Added localization for the Account Registration label across all 8 supported languages.

EZPK v112

- Replaced the Season 6 latest-information images with eight optimized WEBP language versions.
- Added dedicated Japanese and Thai Season 6 images instead of the English fallback.
- Updated language-to-image switching for Korean, English, Vietnamese, Arabic, Portuguese, Traditional Chinese, Japanese, and Thai.
- Corrected remaining Season 7 references in the Season 6 section translations.

# EZPK War Portal

Current Version: v93

## Features
- Season 7 (Coming Soon)
- Season 6 Archive
- Members
- BGB
- Tips
- Request Board
- Mini Games
- 6 Languages

## Deploy
- GitHub
- Cloudflare Static Assets

## v93 Update
- Restored Season 7 (Coming Soon) across every desktop and mobile navigation
- Placed Season 7 immediately before Season 6
- Preserved active-menu highlighting
- Restored navigation structure
- Removed obsolete README text files
- Consolidated documentation into this README
- Assets cleaned and optimized


## v107
- Added a Season 7 Battlefield Map section before Team Assignment.
- Season 7 flow: Battlefield Map → Team Assignment → Team Strategy → Common Orders.
- Added multilingual Battlefield Map labels and a responsive coming-soon panel.
- BGB A/B Team section now uses conditional member-password protection only when Team A or Team B has assigned members/locations.
- When both teams are empty, the existing A/B Team section remains visible without a password gate.


## v108
- Season 7 (Coming Soon) was corrected to Season 6 (Coming Soon).
- Season 6 (Ended) archive was corrected to Season 5 (Ended).
- Menu links, page titles, section labels, assets, team JSON and admin manager references were updated.

## v109
- Added multilingual Season 6 S Hero Information module.
- Added selectable South, Ella, and Mason hero cards with a shared detail panel.
- Added optimized WEBP card/detail assets extracted from the supplied hero reference image.
- Added responsive PC/mobile layouts and RTL support.


## v114 — Tank Battle / Missile Defense ranking UI unified
- Unified the Tank Battle and Missile Defense ranking panels with the Survival ranking panel.
- Matched panel width, spacing, borders, background, shadow, typography, month chip, refresh button, ranking rows, medal sizing, score emphasis, top-3 borders, notes, and mobile behavior.
- Updated ranking row markup to use the same `rank-place`, `rank-medal`, `rank-name`, and `rank-score` classes as Survival.
- Bumped Tank Battle and Missile Defense asset cache versions to v1140.

## v116
- Added shared TOP 30 pagination to the common ranking component.
- Rankings are displayed 10 at a time: 1–10, 11–20, and 21–30.
- Added previous/next icon buttons and a page indicator.
- Disabled unavailable navigation directions automatically.
- Player highlighting now switches to the page containing that player.
- Applied automatically to Survival, Tank Battle, Missile Mission, Drone Hunter, and future games using the shared component.


## v117
- Added multilingual Account Showcase page and navigation.
- Added account detail/image preview modals, responsive pagination, sorting direction controls.
- Added Account Manager with parser, sequential account numbering, GitHub JSON storage, copy/download template.


## v122
- Restored and hardened the Accounts page 8-language selector.
- Language flag/name, dropdown, outside-click close, Escape close, mobile navigation, localStorage persistence, cross-page sync, full Accounts UI translation, and v121 ACCOUNT / SHOWCASE header are preserved together.
- Updated Accounts asset cache version to 1220.


## v123

- Updated the Account Registration template to use Fighter / Shooter / Rider in English.
- Fixed Accounts GitHub saving by fetching the latest data/accounts.json SHA immediately before each PUT request.
- Added one automatic retry for GitHub 409/422 conflicts after refreshing the SHA.
- GitHub API error messages now include the returned reason for easier diagnosis.
- Updated the Account Manager cache version to 1230.

## v126 Account Registration Listing Options
- Added Standard Listing and Premium Listing pricing guidance to the bottom of the Account Registration template.
- Premium prices: 7 days $5, 15 days $8, and 30 days $10 (Best Value).
- Kept the administrator parser label-based, so pricing, benefits, separators, and explanatory text are ignored automatically.
- Only the existing account specification fields are populated in Account Manager.
