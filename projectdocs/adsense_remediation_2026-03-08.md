# AdSense Remediation Task Log (2026-03-08)

## Objective
Fix policy risk for "Google-served ads on screens without publisher-content" by ensuring non-publisher routes are not ad-eligible and not indexed for review.

## Planned Actions
- Remove global AdSense script from `plant-care-frontend/public/index.html`.
- Remove `/login` and `/register` from `plant-care-frontend/public/sitemap.xml`.
- Add disallow rules for `/login` and `/register` in `plant-care-frontend/public/robots.txt`.
- Add `noindex, nofollow` metadata in `plant-care-frontend/src/pages/auth/Login.js`.
- Add `noindex, nofollow` metadata in `plant-care-frontend/src/pages/auth/Register.js`.
- Add `noindex, nofollow` metadata in `plant-care-frontend/src/pages/NotFound.js`.
- Validate edits and summarize exact redeploy/re-review steps.

## Status
In progress: edits not started yet.

## Implementation Update (2026-03-08 04:37:16 UTC)
- Completed: removed global AdSense script from `plant-care-frontend/public/index.html`.
- Completed: removed `/login` and `/register` URLs from `plant-care-frontend/public/sitemap.xml`.
- Completed: added `/login` and `/register` disallow rules in `plant-care-frontend/public/robots.txt`.
- Completed: added page-level `noindex, nofollow` metadata in `plant-care-frontend/src/pages/auth/Login.js`.
- Completed: added page-level `noindex, nofollow` metadata in `plant-care-frontend/src/pages/auth/Register.js`.
- Completed: added page-level `noindex, nofollow` metadata in `plant-care-frontend/src/pages/NotFound.js`.
- Validation: confirmed AdSense script is absent from `index.html` and metadata exists in target pages.

## Final Status
Implementation completed. Pending deployment and AdSense re-review submission.
