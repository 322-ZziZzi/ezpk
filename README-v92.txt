EZPK War Portal v92

Asset cleanup and BGB folder organization:

1. Deleted obsolete Season 6 lineup image files from assets/:
   - lineup-ar.webp
   - lineup-en.webp
   - lineup-ko.webp
   - lineup-pt.webp
   - lineup-vi.webp
   - lineup-zh-tw.webp

2. Moved the BGB tactical map:
   - Before: assets/bgb-map.webp
   - After:  bgb/bgb-map.webp

3. Updated bgb/index.html to load the map from ./bgb-map.webp.

4. Kept the active BGB member/assignment lineup system unchanged. Only the unused multilingual lineup image files were removed.
