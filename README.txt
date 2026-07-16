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
