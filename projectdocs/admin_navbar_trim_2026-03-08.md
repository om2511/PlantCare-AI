# Admin Navbar Trim Log (2026-03-08)

## Objective
Refine navbar behavior for shared admin+user account with reduced clutter and explicit role switching.

## Requested Behavior
- On admin page, remove `User View` nav link from navbar.
- In user mode, remove `Admin` nav link from navbar.
- Reduce user-mode nav clutter by introducing a `More` dropdown for non-primary links on large screens.
- Replace switch button with a `Role` dropdown having `User` and `Admin` options.

## Applied Changes
- Updated `plant-care-frontend/src/components/layout/Navbar.js`.
- Route-aware primary nav:
  - On `/admin`: main nav shows only `Admin`.
  - On non-admin routes: main nav shows primary user links only and does not show `Admin`.
- Added `More` dropdown on large screens for non-primary user links (`Analytics`, `Disease`, `Water`, `Companion`, `Suggestions`).
- Added `Role` dropdown (desktop) for admin sessions with options:
  - `User` -> `/dashboard`
  - `Admin` -> `/admin`
- Mobile menu now uses combined user nav set directly (no duplicate add-plant entry).
- Kept profile menu links so admin can still access both contexts from profile if needed.

## Validation
- `node --check plant-care-frontend/src/components/layout/Navbar.js` passed.

## Follow-up Update
- Added small-screen role switch block inside mobile menu for admin sessions with `User` and `Admin` options, matching desktop role switching behavior.
- Mobile role options highlight current mode.
- Validation re-run: `node --check plant-care-frontend/src/components/layout/Navbar.js` passed.
