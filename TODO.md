# SEO follow-ups (repo only — not deployed)

This file lives at the repo root and is **not** copied to GitHub Pages, so visitors never see it.

## Done in code

- [x] `public/robots.txt` + `public/sitemap.xml`
- [x] Deploy workflow copies robots/sitemap
- [x] Canonical `<link>` on index, developers
- [x] JSON-LD (`SoftwareApplication` / `WebPage` + Organization)
- [x] Tightened title + meta description (home)
- [x] One `<h1>` per page on developers
- [x] Clean paths (`/developers/`) via folder `index.html` + redirect from `developers.html`
- [x] Sitemap, canonicals, og:url, and internal links use clean `/developers/`
- [x] Host Lemuel hero image on `www.discernible.io` (`public/lemuel.png`)
- [x] Load jQuery + Mailchimp only near the newsletter (IntersectionObserver / focus)
- [x] FAQ section + `FAQPage` schema on developers
- [x] `og-image.png` is a clear 1200×630 product/brand graphic (`npm run generate-og-image`)

## Still to do (manual / later)

### Crawl & Search Console
- [ ] Verify apex `https://discernible.io` 301-redirects to `https://www.discernible.io` (and HTTPS)
- [ ] Add property in [Google Search Console](https://search.google.com/search-console)
- [ ] Submit `https://www.discernible.io/sitemap.xml`
- [ ] Monitor Coverage / Page indexing for soft-404s or duplicate URLs

### Social & rich results
- [ ] Re-scrape OG image after deploy: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and LinkedIn Post Inspector
- [ ] Validate JSON-LD: [Rich Results Test](https://search.google.com/test/rich-results)

### Performance
- [ ] If leaving GitHub Pages for Apache: enable production cache rules in `.htaccess` (current “no-cache” block is for dev; GitHub Pages ignores `.htaccess`)

### Off-site / content
- [ ] Point GitHub READMEs, ClawHub listings, `api.identyclaw.com/docs`, and `lastcradle.io` at these pages with descriptive anchors
- [ ] Keep publishing on [dev.to/discernible-io](https://dev.to/discernible-io) with links back to product pages
