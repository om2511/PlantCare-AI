# Admin Navbar Trim Log (2026-03-08)

## Objective
Reduce admin navbar items so only required admin navigation is shown while preserving access to user features for shared admin+user accounts.

## Plan
1. Detect admin user state and admin route in Navbar.
2. Keep compact admin nav on `/admin` route.
3. Provide explicit switch back to user dashboard for admin users.
4. Restore full user links for admin when outside `/admin`.
5. Validate syntax.

## Progress
Completed.

## Changes Applied
- Added `isOnAdminRoute` logic in `plant-care-frontend/src/components/layout/Navbar.js`.
- Admin nav behavior is now route-aware:
  - On `/admin`: show only `Admin` and `User View` links.
  - On non-admin routes: admin sees full user nav links plus `Admin` link.
- Added `User Dashboard` entry in admin profile dropdown for fast switching.
- Reminder bell and mobile extra shortcuts are hidden only on `/admin` view, not everywhere for admin.
- Non-admin users keep previous navigation behavior.

## Validation
- `node --check plant-care-frontend/src/components/layout/Navbar.js` passed.
