# Notification Delivery Fix (2026-03-25)

## Objective
Fix plant care reminder notifications not arriving on iPhone Safari and Android devices.

## Planned Work
1. Fix frontend subscription sync so existing browser subscriptions are always saved to backend.
2. Add backend notification diagnostics and test-send endpoints.
3. Make reminder execution callable from a dedicated script instead of relying only on the web server cron.
4. Update Render config and backend package scripts for a scheduled reminder worker.
5. Add Settings UI for notification diagnostics and manual test notification.
6. Validate syntax after changes.

## Completed
- Existing browser push subscriptions are now re-saved to backend during subscribe flow.
- Added `GET /api/notifications/status` and `POST /api/notifications/test`.
- Added backend runner `plant-care-backend/sendReminders.js`.
- Added npm script `send-reminders`.
- Disabled in-app cron by default and introduced dedicated Render cron job config.
- Added Settings diagnostics block and test notification button.
- Syntax checks passed for changed JS files.
