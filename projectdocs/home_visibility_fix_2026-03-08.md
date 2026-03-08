# Home Visibility Fix Task Log (2026-03-08)

## Objective
Fix issue where middle sections on `/` are hidden on direct load and only appear after navigating away and back.

## Planned Steps
- Inspect `Home.js` animation/visibility logic (`IntersectionObserver` + `data-animate`).
- Identify mismatch between section IDs and visibility keys.
- Patch observer logic to use reliable identifiers and ensure first-load rendering is correct.
- Validate with static checks.

## Status
In progress: analysis started.

## Root Cause
`Home.js` mounted while auth state was still `loading=true`, so the component returned only the loading screen and the animation observer effect (with empty dependency array) ran before any `[data-animate]` sections existed in the DOM. Because the observer did not re-run after loading finished, section visibility flags were never set on first direct load.

## Fix Applied
- Updated observer effect in `plant-care-frontend/src/pages/Home.js` to wait for `loading=false`.
- Re-initialized observer when loading state changes so animated sections are observed after main content is actually rendered.
- Added guard for missing section ids before updating visibility map.

## Validation
- Verified updated effect code and dependencies in `Home.js`.

## Status
Completed. Ready for deploy and browser validation.
