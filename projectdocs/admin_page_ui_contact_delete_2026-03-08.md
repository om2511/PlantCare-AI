# Admin Page UI + Contact Delete Policy Log (2026-03-08)

## Objective
Match admin page UI style with the rest of the application and allow admin to delete contact messages only after resolution.

## Changes Applied
- Updated `plant-care-frontend/src/pages/dashboard/AdminDashboard.js` with the same visual language used by other dashboard pages:
  - gradient page background
  - gradient hero header block
  - rounded card surfaces, spacing, and section styling consistency
- Added contact message delete action in admin UI, enabled only when message status is `resolved`.
- Added frontend API method in `plant-care-frontend/src/utils/api.js`:
  - `deleteContactMessage(messageId)`
- Added backend endpoint in `plant-care-backend/routes/admin.js`:
  - `DELETE /api/admin/contact-messages/:id`
- Added backend rule in `plant-care-backend/controllers/adminController.js`:
  - deletion allowed only when message status is `resolved`
  - otherwise returns 400 with policy message
- Updated backend docs in `plant-care-backend/README.md` with new endpoint behavior.

## Validation
- `node --check plant-care-backend/controllers/adminController.js` passed.
- `node --check plant-care-backend/routes/admin.js` passed.
- `node --check plant-care-frontend/src/utils/api.js` passed.
- `node --check plant-care-frontend/src/pages/dashboard/AdminDashboard.js` passed.

## Notes
- Delete action remains irreversible.
- UI prevents click for non-resolved rows and backend enforces policy server-side.

## Follow-up Update
- Optimized resolved-message delete flow in `AdminDashboard.js` to avoid full dashboard refetch.
- After successful delete, UI now updates immediately by:
  - removing the message row locally
  - decrementing `totals.contactMessages` locally in overview state
- This makes overview cards reflect deletion instantly.
