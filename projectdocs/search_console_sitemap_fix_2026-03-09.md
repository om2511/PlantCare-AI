# Search Console Sitemap Fix (2026-03-09)

## Objective
Fix Google Search Console sitemap fetch/read errors for the deployed frontend.

## Root Cause
The deployed frontend used a custom Vercel SPA rewrite with a negative-lookahead pattern. That pattern is brittle for static assets like `sitemap.xml` and `robots.txt` and can cause the app shell HTML to be served instead of the actual XML/text files.

## Applied Fix
- Updated `plant-care-frontend/vercel.json`.
- Removed the custom regex rewrite.
- Added a filesystem-first Vercel routing rule:
  - `handle: filesystem`
  - fallback route to `/`

## Why This Fix Is Better
- Existing static files in `public/` are now always served directly.
- `sitemap.xml` and `robots.txt` no longer depend on fragile regex exclusion logic.
- SPA fallback still works for client-side routes after static files are checked first.

## Validation
- Parsed `plant-care-frontend/vercel.json` successfully with Node JSON parse.

## Required Next Steps
1. Redeploy the frontend on Vercel.
2. Open `https://plant-care-ai-nine.vercel.app/sitemap.xml` and confirm raw XML is shown.
3. Open `https://plant-care-ai-nine.vercel.app/robots.txt` and confirm plain text is shown.
4. In Google Search Console, resubmit `sitemap.xml`.
