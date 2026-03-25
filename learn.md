# learn.md

2026-03-08 04:37:16 UTC - For AdSense compliance work, global script placement in a SPA can unintentionally enable ads on utility routes even when content pages are strong. The safer remediation sequence is disable Auto Ads in AdSense UI, remove global AdSense script from code during review, and enforce route-level noindex plus sitemap/robots cleanup for auth and error pages.

2026-03-08 04:56:13 UTC - During notification patching, I accidentally introduced a duplicate `/notifications/subscribe` fetch call and removed it immediately. For network-flow edits, always re-open the edited function and verify exactly one API call per intended side effect before validation.

2026-03-08 05:11:28 UTC - In pages that conditionally render a loading screen, DOM-query/observer effects with empty dependency arrays can run before target elements exist and never recover. Effects that observe rendered content must be tied to loading completion or the rendered-content lifecycle.

2026-03-08 05:49:34 UTC - Public legal/SEO pages should avoid unverifiable claims in metadata and body copy (e.g., fabricated ratings, hard guarantees, placeholder jurisdiction text). Using a shared layout component for legal/public pages prevents UI drift and duplicate markup bugs.

2026-03-08 06:10:15 UTC - Public contact forms should not present success without persistence. If no backend endpoint exists, implement one or explicitly label form as non-submitting; silent simulation creates false operational assumptions.

2026-03-08 06:56:23 UTC - When adding a public contact form, also define how operators read submissions; persistence without retrieval creates an operational dead end. Pair submit endpoints with an access-controlled read path and explicit env-based admin authorization.

2026-03-08 08:03:47 UTC - For long audit/history lists inside dense detail pages, internal scroll containers with explicit max heights preserve information density while preventing vertical page bloat and interaction fatigue.

2026-03-08: Centralizing admin authorization with role-based middleware is safer than per-controller email checks because it prevents fragmented access control logic and keeps all admin endpoints consistently protected.

2026-03-08: For shared admin+user accounts, role-based UI should be route-aware instead of globally restrictive; otherwise admin access unintentionally removes normal user workflows.

2026-03-09: When adding bulk routes like /contact-messages/resolved alongside /contact-messages/:id, keep the static route definition before parameterized routes to avoid accidental path capture.

2026-03-09: For admin tables with filters and pagination, mutation handlers should re-fetch the affected section from server instead of relying on optimistic local edits, because page boundaries and totals can shift after delete/status operations.

2026-03-09: For Vercel-hosted SPAs, a filesystem-first fallback config is safer than regex-based rewrite exclusions when static SEO files like sitemap.xml and robots.txt must be served reliably to crawlers.
2026-03-25: In web push flows, an existing browser subscription must still be re-synced to the backend; returning it early causes silent delivery failure when server-side subscription records are missing or stale.
2026-03-25: Time-based reminder delivery should not depend on an in-process cron running inside a free/sleeping web service. A separate scheduler job is the reliable path.
2026-03-25: If the frontend persists a trimmed auth payload in localStorage, every profile field that drives UI badges or account metadata must be included there or refreshed from /auth/me on bootstrap. Otherwise pages like Profile drift into stale placeholders such as "Member since N/A" for already logged-in users.
2026-03-25: When desktop and mobile navs are assembled by merging link arrays, each route must have one canonical source list. Shared secondary links like Profile and Settings should not be duplicated across both shared and mobile-only arrays, or mobile menus will render repeated entries.
