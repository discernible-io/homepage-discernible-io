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

## Still to do (manual / later)

### Crawl & Search Console
- [ ] Add property in [Google Search Console](https://search.google.com/search-console)
- [ ] Submit `https://www.discernible.io/sitemap.xml`
- [ ] Monitor Coverage / Page indexing for soft-404s or duplicate URLs

### Social & rich results
- [ ] Re-scrape OG image after deploy: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and LinkedIn Post Inspector
- [ ] Validate JSON-LD: [Rich Results Test](https://search.google.com/test/rich-results)

### Off-site / content
- [x] Point GitHub READMEs at these pages with descriptive anchors (`idclawserver-idc`, `openclaw-identyclaw-plugin` — 2026-10-22)
- [ ] Point ClawHub listings, `api.identyclaw.com/docs`, and `lastcradle.io` at these pages with descriptive anchors
- [ ] Keep publishing on [dev.to/discernible-io](https://dev.to/discernible-io) with links back to product pages

### Take to market now (homepage positioning)
- [ ] **Lead with agent identity infrastructure, not “buy once / Passport”:** Reviewers treat portable cryptographic identity for agents + APIs as the differentiator; Passport is the enabling credential underneath. Avoid “more secure than OAuth / mTLS” — say “different trust model.”
- [ ] **Explain or drop the 12-letter code:** “A 12-letter code that encodes a readable persona” is unexplained — add a concrete example (e.g. the code shown next to the face) or remove the mechanism detail.
- [ ] **Name video-call proof as a use case:** Executive section only reaches “phone call, or video call” as a list item. For regulated-legal / KYC, same-proof-over-video-call is the hook — give it a named use case, not a bullet in a channel list.
- [ ] **Surface challenge-response under native login:** Fresh server timestamp → Ed25519 sign `accountid + timestamp` → single-use challenge → JWT session (what made the architecture feel “real” beyond the GitHub README).
- [ ] **Frame the hackathon mint tip as a demo pricing tip only** — do not let “NEAR hackathon” read as the product’s maturity signal.
- [ ] **Optional comparison strip:** API keys / OAuth / mTLS / RODiT — RODiT row = transferable on-chain identity + portable proofs, not “wins on security.”

### From external RODiT review (credibility gaps)
Source: ChatGPT assessment of rodit-sdk + Developers docs + security review (Nov 2026). Docs already flipped the verdict to “technically credible”; these close remaining production-evaluation blockers.

**High priority**
- [ ] **Fix mutual-auth overclaim** (`/developers/` RODiT section): direct HTTP login = TLS + hostname trust; on-chain server Passport check is optional (`login_server()`), needs SDK + NEAR RPC — say supported/optional, not default for every path.
- [ ] **Clarify JWT lifetime vs Passport transfer** (homepage `#api-login` + developers FAQ): challenges single-use (~5 min); JWT ~1 h; transfer stops *new* logins for the old owner; already-issued JWTs remain until expiry unless revocation/denylist exists.
- [ ] **Answer five open security questions** (developers FAQ or “Security properties” block): (1) JWT after transfer, (2) key compromise / rotate via Passport transfer, (3) NEAR RPC trust model, (4) authz defaults — `authenticate` then `authorize`, deny-by-default, (5) ops — rate limits / monitoring / key backup, or “integrator responsibility.”
- [ ] **Soften “audit” language:** retitle “RODiT SDK security audit” → “security review” (CodeCome / maintainer); keep honesty that exploit development was not run — not an independent pen test.

**Medium priority**
- [ ] **Pin recommended package version** wherever `@rodit/rodit-auth-be` is mentioned: **10.0.4+** (permission glob fix). GitHub still reading as 10.0.3 hurt first-pass assessment.
- [ ] **CTA to login-authentication guide** next to “Open API docs” on `/developers/` — that page did more for credibility than the monorepo README alone.

**Do not change from this review**
- Keep the security-review findings table (specificity helped).
- Keep JWT vs HOLA as two lanes.
- Keep “technically credible / evaluate with tests” tone — do not oversell production readiness.

### Operator-only (cannot automate from this repo)
Search Console property, sitemap submit, coverage monitoring, OG re-scrape, and Rich Results Test remain manual after each meaningful deploy.


## Standards conformance gaps (host audit 2026-10-27)

Scored as **static marketing site** ([applicability matrix](https://github.com/discernible-io/docs/blob/main/docs/documentation-standard.md#applicability-matrix)).

| Gap | Standard | Notes |
| --- | --- | --- |
| Funnel cookieless tension | [`funnel-standard.md`](https://github.com/discernible-io/docs/blob/main/docs/funnel-standard.md) | `public/script.js` parks `funnel_id` in `sessionStorage` — conflicts with URL/memory-only stitching until product decides URL-only or consent |
| Floating Actions | cicd **PI 16** (where GH Actions used) | **Done 2026-10-27** — Pages deploy actions SHA-pinned |
| README → standards | documentation / distribution | README does not clearly state reference-only consumption of discernible-io/docs (add a short pointer + follow `main` or a pin) |
| Coding on touch | coding **PI 12** | Apply vocabulary + one-implementation rules when editing maintained scripts |
