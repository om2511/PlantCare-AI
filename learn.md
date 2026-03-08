# learn.md

2026-03-08 04:37:16 UTC - For AdSense compliance work, global script placement in a SPA can unintentionally enable ads on utility routes even when content pages are strong. The safer remediation sequence is disable Auto Ads in AdSense UI, remove global AdSense script from code during review, and enforce route-level noindex plus sitemap/robots cleanup for auth and error pages.

2026-03-08 04:56:13 UTC - During notification patching, I accidentally introduced a duplicate `/notifications/subscribe` fetch call and removed it immediately. For network-flow edits, always re-open the edited function and verify exactly one API call per intended side effect before validation.
