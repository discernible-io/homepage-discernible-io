# SEO follow-ups (repo only — not deployed)

This file lives at the repo root and is **not** copied to GitHub Pages, so visitors never see it.

## Done in code

- [x] `public/robots.txt` + `public/sitemap.xml`
- [x] Deploy workflow copies robots/sitemap
- [x] Canonical `<link>` on index, developers, get-started
- [x] JSON-LD (`SoftwareApplication` / `WebPage` + Organization)
- [x] Tightened title + meta description (home)
- [x] One `<h1>` per page (home, developers, get-started)
- [x] Clean paths (`/developers/`, `/get-started/`) via folder `index.html` + redirect from `*.html`
- [x] Sitemap, canonicals, og:url, and internal links use clean `/developers/` and `/get-started/`
- [x] Host Lemuel hero image on `www.discernible.io` (`public/lemuel.png`)
- [x] Load jQuery + Mailchimp only near the newsletter (IntersectionObserver / focus)
- [x] FAQ section + `FAQPage` schema on developers
- [x] `og-image.png` is a clear 1200×630 product/brand graphic (`npm run generate-og-image`)
- [x] Apex `https://discernible.io` 301-redirects to `https://www.discernible.io` (HTTPS)
- [x] Live-site cache rules in `.htaccess` (HTML / CSS·JS / assets); GitHub Pages ignores `.htaccess` — rules apply on Apache / DO only

## Verified live (2026-10-22)

- [x] `https://www.discernible.io/sitemap.xml` returns 200 with home / developers / get-started URLs
- [x] Live home OG tags present (`og:title`, `og:description`, `og:image` → `og-image.png` 200)
- [x] Live developers JSON-LD parses (`@graph` Organization / page types)
- [x] `lastcradle.io` already links to `www.discernible.io/get-started/` and `/developers/`
- [x] `api.identyclaw.com/docs` already links toward discernible developers pages
- [x] Fixed stale `#developers` anchors in OpenClaw / IdentyClaw plugin READMEs on this host (republish ClawHub from those READMEs to refresh listings)

## Still to do (manual / operator)

### Crawl & Search Console
- [ ] Add property in [Google Search Console](https://search.google.com/search-console) (requires Google account on the property)
- [ ] Submit `https://www.discernible.io/sitemap.xml`
- [ ] Monitor Coverage / Page indexing for soft-404s or duplicate URLs

### Social & rich results
- [ ] Re-scrape OG image after deploy: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and LinkedIn Post Inspector (tool login)
- [ ] Validate JSON-LD in [Rich Results Test](https://search.google.com/test/rich-results) while signed in (automation hit “Something went wrong” without operator session; local parse of live JSON-LD succeeded)

### Off-site / content
- [x] Point GitHub READMEs at these pages with descriptive anchors (`idclawserver-idc`, `openclaw-identyclaw-plugin` — 2026-10-22)
- [x] Align ClawHub-source plugin READMEs + lastcradle + API docs links to clean `/developers/` / `/get-started/` (2026-10-22). Re-publish ClawHub packages so the live listing drops `#developers`.
- [ ] Keep publishing on [dev.to/discernible-io](https://dev.to/discernible-io) with links back to product pages

### Operator-only (cannot automate from this repo)
Search Console property, sitemap submit, coverage monitoring, OG re-scrape, and Rich Results Test remain manual after each meaningful deploy.
