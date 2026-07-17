EZPK v51 - Common Mini Game Header Layout

EZPK v49 - Persistent mini-game switcher on Drone Hunter

EZPK v40

Changes from v39:
- Mobile header only: hamburger menu moved to the far left.
- Mobile header only: 322 EZPK brand title centered on the screen.
- Language selector remains on the far right.
- Desktop layout and styling remain unchanged.
- Applied consistently to Home, Members, BGB, and Request pages.

322 EZPK War Portal v6.2

Mobile image interaction fix:
- Removed double-tap zoom.
- Removed custom JavaScript pinch/drag handling.
- Removed nested image-area scrolling that blocked viewport panning.
- Mobile users can use the browser's native two-finger pinch zoom and move the enlarged page by dragging directly over images.
- Applied to lineup, map, and Season 7 images.

Upload all files and folders in this archive to the repository root, then hard refresh or clear the mobile browser cache.


EZPK War Portal v7.1
- Added independent MEMBER page Excel download.
- The Excel file follows the current search, rank filter, and sort order.
- Added missing R2 members MonsteR and Siggus (R2 total: 17).
- Excel generation uses SheetJS from jsDelivr, so the first download requires an internet connection.


EZPK War Portal v7.2
- Added a localized Last Updated date at the bottom-right of the member list.
- Current member list update date: 2026.07.17 KST.


EZPK War Portal v7.4
- Fixed MEMBER rank expand/collapse behavior.
- Changed member shelter level prefix from 'Lv.' to 'ind.'.

EZPK v8 Admin Manager
- 관리자 주소: /admin/
- 멤버 데이터: /data/members.json
- 관리자 페이지에서 Rank, Nickname, IND., Power 수정 가능
- Excel 가져오기/내보내기 및 JSON 백업 지원
- GitHub에 영구 저장하려면 기존 GitHub 계정에서 Fine-grained personal access token을 발급하여 관리자 페이지에 입력
- 권장 토큰 권한: 해당 ezpk 저장소만 선택, Contents: Read and write
- 토큰은 페이지 코드에 저장되지 않으며 현재 탭에서 입력해서 사용
- 관리자 페이지 주소는 메뉴에 표시되지 않음

EZPK v8.1 privacy/layout update:
- Removed Excel download/import UI from the public /members/ page.
- Excel import/export remains available only in /admin/.
- Removed the hidden admin entry link from the public footer.
- The admin page is accessible only by entering /admin/ directly.


EZPK v9 BGB Manager
- Added standalone /bgb/ page.
- BGB map, facility names, and assigned members are public.
- Added data/bgb.json for R1-R6, M1-M2, H1-H2 and CENTER assignments.
- Admin page includes Member Manager and BGB Manager.
- GitHub token can save both members.json and bgb.json permanently.

v9.1 update:
- Converted BGB map image from PNG to WebP.
- BGB page now loads assets/bgb-map.webp.
- Updated cache version for the BGB page.

v10 BGB Team Auto Assignment
- BGB A TEAM / B TEAM tabs.
- Select exactly 20 members from members.json for each team.
- Admin list shows nickname, IND., and combat power.
- Automatic balanced assignment:
  * R1-R6: all 20 members distributed once across six refinery teams (4,4,3,3,3,3) using power balancing.
  * M1/M2/H1/H2: all 20 members distributed once, each location receives five members and each power quintile contributes at least one member.
  * CENTER: power ranks 1, 2, 5, 6, 9, and 10.
- Cross-layer duplicate assignment is allowed; duplicates inside each layer are prevented by automatic assignment.
- Public BGB page displays nicknames only.

v11 updates:
- BGB menu moved to the far right on public navigation menus.
- BGB admin flow separates FINAL LINEUP selection from LOCATION ASSIGNMENTS.
- Select exactly 20 members first, then run automatic assignment.

V14 fix:
- Saving no longer reloads and overwrites unsaved BGB lineup data.
- The save action fetches only GitHub file SHAs, then preserves and commits the current admin selections.


[v15 관리자 로그인]
- /admin 접속 시 비밀번호 로그인 화면이 먼저 표시됩니다.
- 비밀번호: 322ezpk
- 로그인 상태는 현재 브라우저 탭의 sessionStorage에만 유지됩니다.
- LOGOUT 버튼으로 즉시 잠글 수 있습니다.


[v17] 관리자 로그인 버튼 이벤트를 페이지 초기 단계에서 연결하도록 수정했습니다. 비밀번호: 322ezpk


[v18 BGB 자동 배정 규칙]
- M1: 전투력 4, 10, 13위
- M2: 전투력 7, 11, 14위
- H1: 전투력 5, 9, 12위
- H2: 전투력 6, 8, 10위
- M1/M2/H1/H2에는 15~20위 멤버를 배정하지 않음
- CENTER: 1, 2, 3, 5, 6, 8위


V19: Added public BGB A/B team lineup JPG download (single-page image).

v20 KakaoTalk JPG compatibility
- Chrome/Safari: JPG button downloads the selected BGB team image.
- KakaoTalk in-app browser: opens a full-screen image preview. Press and hold the image to save it, or copy the page link and open it in an external browser.


V21 update:
- Replaced JPG download with Team Lineup View.
- Always opens a full-screen generated team image on all browsers.
- Mobile users can press and hold the image to save or share.
- Includes SERVER 322 · EZPK, selected BGB team, final lineup, all location assignments, and last updated date.


[v22 EVENT SCHEDULE]
- 상단 메뉴 가장 왼쪽에 SCHEDULE 추가
- 메인 도입부 아래 EVENT SCHEDULE 섹션 추가
- 데스크톱 3열, 태블릿 2열, 모바일 1열
- 관리자 Event Manager에서 최대 9개 일정 관리
- 관리자만 시작/종료시간 입력
- 연맹원 화면에는 시작시간만 표시
- 시작 전 카운트다운, 진행 중 LIVE, 종료 후 FINISHED
- 데이터 파일: data/events.json


[v23 Event Schedule]
- EVENT SCHEDULE is the first homepage section.
- SCHEDULE is the leftmost menu item.
- Event inputs and countdowns use the game Server Time internally.
- Admin uses separate date and 24-hour time fields; midnight is 00:00.
- Members see start time only; status automatically changes UPCOMING > LIVE > FINISHED.


[v24 update]
- Event Manager time fields use fixed 24-hour HH:mm text input (00:00-23:59).
- Browser AM/PM display is removed to match in-game Server Time.
- Countdown and automatic UPCOMING/LIVE/FINISHED states use absolute timestamps based on game Server Time.

[v35 Request Manager Edge Function 연결]
- Supabase Edge Function 이름: request-admin
- Verify JWT with legacy secret: OFF
- Custom secret: REQUEST_ADMIN_PASSWORD
- 관리자 답변 저장과 요청 삭제는 /functions/v1/request-admin을 통해 처리됩니다.
- 관리자 비밀번호는 현재 브라우저 탭의 sessionStorage에만 임시 보관되며 탭을 닫으면 삭제됩니다.

[v41 MINI GAME]
- New page: game/index.html (EZPK Survival)
- Controls: Arrow keys/WASD, mobile drag, or mobile direction buttons
- Ranking: TOP 30, gold/silver/bronze badges, best score per nickname
- Monthly reset: the page automatically queries only the current month
- Supabase setup: run SUPABASE_GAME_SETUP.sql once in the Supabase SQL Editor
- Before the SQL is installed, the game remains playable and uses a local browser ranking for testing

V44 UPDATE
- Mini game menu and all visible mini game interface text support Korean, English, Portuguese, Vietnamese, Arabic, and Traditional Chinese.
- Language changes immediately update the game library, controls, result screen, ranking, and monthly labels.
- The game names SURVIVAL, TANK BATTLE, MISSILE DEFENSE, and DRONE HUNTER remain global title names.


[V46] BGB page navigation fixed: MINI GAME menu now appears in all six languages.


[v46] PC에서 순위 보기 후 시작 화면이 다시 표시되어 새로고침 없이 재도전할 수 있도록 수정.


[v47 변경사항]
- 게임 실패 후 다시 도전 버튼은 즉시 새 게임을 시작합니다.
- 순위 보기 버튼은 결과창을 닫고 랭킹을 강조한 뒤 게임 화면에 다시 플레이 메뉴를 표시합니다.
- PC와 모바일 모두 새로고침 없이 반복 플레이할 수 있습니다.
- 6개 언어에 랭킹 확인 및 다시 플레이 문구를 추가했습니다.

============================================================
V48 - DRONE HUNTER
============================================================
- Added DRONE HUNTER as the second playable mini game.
- 60-second aim-and-shoot gameplay with normal, fast, and armored drones.
- Base HP, hit streak bonuses, sound effects, PC mouse and mobile touch controls.
- Independent monthly TOP 30 ranking using game_id='drone_hunter'.
- SURVIVAL now uses game_id='survival' so the two rankings stay separate.

IMPORTANT SUPABASE UPGRADE
Run the updated SUPABASE_GAME_SETUP.sql once in the existing ezpk-request-board project.
It safely adds the game_id column and preserves all existing SURVIVAL scores.


[v50] SURVIVAL과 DRONE HUNTER의 미니게임 선택 카드를 공통 CSS로 통일했습니다. 현재 게임은 파란 테두리와 현재 게임 배지로 표시되며 모든 카드 크기가 동일합니다.

[v52] SURVIVAL의 DRONE HUNTER 플레이 버튼을 누르면 DRONE HUNTER 게임 화면으로 자동 스크롤되도록 수정했습니다. 해시 앵커와 로드 후 보정 스크롤을 함께 적용했습니다.


v53: Unified SURVIVAL/DRONE HUNTER start overlay typography and alignment. Fixed DRONE HUNTER ranking refresh with explicit reload feedback and click locking.


v54: Fixed Supabase key compatibility for mini-game rankings (publishableKey/anonKey).


v56: Mobile playfields rebuilt as true 1:1 squares. Removed artificial 650px minimum heights. Restored normal page scrolling outside active Survival drag control and throughout Drone Hunter. PC layout unchanged.


v57 mobile UX: game instructions moved between game list and playfield; mobile start overlay now contains only nickname and start button.


v58 mobile members update:
- Mobile only: hides nickname search and rank filter.
- Keeps only the sorting select.
- Disables sticky filter toolbar on mobile so the member list is not covered.
- Desktop layout remains unchanged.


EZPK v63 UPDATE
- Replaced the Immigration Coming Soon card with a live Google Forms application link.
- Added complete Korean, English, Vietnamese, Portuguese, Arabic and Traditional Chinese translations.
- Opens the application securely in a new browser tab.
- Preserved Season 6/BGB shared authentication and all v62 features.
