# Admin User Actions + Mode Switch Log (2026-03-08)

## Objective
Add quick Admin/User mode switching in navbar and implement admin actions to block/unblock and delete users safely.

## Plan
1. Add backend user status field to support block/unblock.
2. Enforce blocked-user access denial in login and auth middleware.
3. Add admin APIs for block/unblock and user deletion with safety checks.
4. Add admin UI actions in Admin Dashboard.
5. Add visible switch control in navbar for admin account.
6. Validate syntax and update handoff logs.

## Progress
Completed.

## Backend Changes
- Added fields in `plant-care-backend/models/User.js`:
  - `isBlocked`
  - `blockedAt`
  - `blockReason`
- Updated login flow in `plant-care-backend/controllers/authController.js` to reject blocked users with 403.
- Updated `plant-care-backend/middleware/auth.js` to reject blocked users on authenticated routes.
- Extended `plant-care-backend/controllers/adminController.js`:
  - `PATCH /api/admin/users/:id/block-status`
  - `DELETE /api/admin/users/:id`
  - Added blocked-user count in overview stats.
- Added `PushSubscription` cleanup on admin delete user.
- Updated route bindings in `plant-care-backend/routes/admin.js`.

## Safety Rules Enforced
- Admin cannot block/unblock self.
- Admin cannot delete self.
- Admin endpoints refuse actions on admin-role target users.
- Delete action cascades to `CareLog`, `Plant`, and `PushSubscription` records for target user.

## Frontend Changes
- Added admin API client methods in `plant-care-frontend/src/utils/api.js`:
  - `updateUserBlockStatus`
  - `deleteUser`
- Updated `plant-care-frontend/src/pages/dashboard/AdminDashboard.js`:
  - Added blocked user metric card.
  - Added Block/Unblock action per non-admin user.
  - Added Delete action per non-admin user with confirm prompt.
- Updated `plant-care-frontend/src/components/layout/Navbar.js`:
  - Added visible switch button for admin: `Admin Mode` / `User Mode`.
  - Route-aware behavior preserved for shared admin+user account.

## Validation
- Backend syntax checks passed.
- Frontend syntax checks passed.

## Operational Notes
- Blocked users cannot log in and cannot continue authenticated requests.
- If you need temporary suspension, use block/unblock rather than delete.
