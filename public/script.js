// Mobile navigation toggle
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

if (navToggle && navbar) {
 navToggle.addEventListener('click', () => {
 const isOpen = navbar.classList.toggle('is-open');
 navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
 navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
 });

 navLinks.forEach((link) => {
 link.addEventListener('click', () => {
 navbar.classList.remove('is-open');
 navToggle.setAttribute('aria-expanded', 'false');
 navToggle.setAttribute('aria-label', 'Open menu');
 });
 });
}

// Smooth scrolling for in-page links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
 anchor.addEventListener('click', function (e) {
 const href = this.getAttribute('href');
 if (href === '#top' || href === '#') return;
 const target = document.querySelector(href);
 if (target) {
 e.preventDefault();
 target.scrollIntoView({ behavior: 'smooth', block: 'start' });
 }
 });
});

// Scroll animations for feature cards
const observerOptions = {
 threshold: 0.08,
 rootMargin: '0px 0px -24px 0px'
};

const observer = new IntersectionObserver((entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 entry.target.style.opacity = '1';
 entry.target.style.transform = 'translateY(0)';
 }
 });
}, observerOptions);

document.querySelectorAll('.feature-card, .enroll-steps li, .dev-tier').forEach((el) => {
 el.style.opacity = '0';
 el.style.transform = 'translateY(16px)';
 el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
 observer.observe(el);
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
 const sections = document.querySelectorAll('section[id]');
 const links = document.querySelectorAll('.nav-links a[href^="#"]');

 let current = '';
 sections.forEach((section) => {
 const sectionTop = section.offsetTop - 120;
 if (window.pageYOffset >= sectionTop) {
 current = section.getAttribute('id');
 }
 });

 links.forEach((link) => {
 link.classList.remove('active');
 if (link.getAttribute('href') === `#${current}`) {
 link.classList.add('active');
 }
 });
}, { passive: true });

// Telegram concierge: t.me shows a broken "Start bot" interstitial in Telegram Web.
// Open the bot chat directly in Web K on desktop, and use t.me with /start on mobile.
const TELEGRAM_CONCIERGE_BOT = 'identyclawconcierge_bot';
const telegramConciergeLinks = document.querySelectorAll('[data-telegram-concierge]');

function getTelegramConciergeUrl() {
 const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
 if (isMobile) {
 return `https://t.me/${TELEGRAM_CONCIERGE_BOT}?start=discernible`;
 }
 return `https://web.telegram.org/k/#@${TELEGRAM_CONCIERGE_BOT}`;
}

telegramConciergeLinks.forEach((link) => {
 link.href = getTelegramConciergeUrl();
});

/**
 * Cookieless funnel CTA hygiene (land → purchase / verify / enroll).
 * Sibling contract: docs/docs/funnel-standard.md (SoT) + home-API src/lib/funnel.js
 * Each browser tab gets its own funnel_id (sessionStorage). It is written into the
 * address bar and CTA / internal hrefs. Inbound funnel_id / vid from a shared URL
 * are ignored so later visitors are not stitched to the person who copied the link.
 */
(function attachFunnelAttribution() {
 const UTM_KEYS = [
 'utm_source',
 'utm_medium',
 'utm_campaign',
 'utm_content',
 'utm_term'
 ];
 const STORAGE_KEY = 'funnel_id';
 const ALLOWED_LAND_DOMAINS = new Set(['www.discernible.io', 'discernible.io']);
 const FUNNEL_CTA_PREFIXES = [
 'https://purchase.identyclaw.com',
 'https://verify.identyclaw.com',
 'https://lastcradle.io'
 ];
 // Same-origin marketing pages — preserve UTMs + this tab's funnel_id across hops.
 function isInternalMarketingPage(href) {
 try {
 const absolute = new URL(href, window.location.href);
 if (absolute.origin !== window.location.origin) {
 return false;
 }
 const path = absolute.pathname.replace(/\/+$/, '') || '/';
 return (
 path === '/' ||
 path === '/index.html' ||
 path === '/developers' ||
 path === '/developers.html'
 );
 } catch {
 return false;
 }
 }

 const inbound = new URLSearchParams(window.location.search);
 const attribution = new URLSearchParams();

 UTM_KEYS.forEach((key) => {
 const value = (inbound.get(key) || '').trim();
 if (value) {
 attribution.set(key, value);
 }
 });

 // Never adopt funnel_id / vid from the landing URL — those are share leftovers.
 let funnelId = '';
 try {
 funnelId = (sessionStorage.getItem(STORAGE_KEY) || '').trim();
 } catch {
 funnelId = '';
 }
 if (!funnelId) {
 funnelId =
 typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
 ? crypto.randomUUID()
 : `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
 try {
 sessionStorage.setItem(STORAGE_KEY, funnelId);
 } catch {
 // Private mode: this page still beacons its own id; hops may not stitch.
 }
 }
 attribution.set('funnel_id', funnelId);

 const url = new URL(window.location.href);
 url.searchParams.delete('vid');
 url.searchParams.set('funnel_id', funnelId);
 window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);

 function applyAttribution(href) {
 const absolute = new URL(href, window.location.href);
 attribution.forEach((value, key) => {
 if (!absolute.searchParams.has(key)) {
 absolute.searchParams.set(key, value);
 }
 });
 // Always overwrite a shared leftover with this tab's id.
 absolute.searchParams.set('funnel_id', funnelId);
 absolute.searchParams.delete('vid');
 // Marketing CTAs always open Expert. A bare verify URL follows
 // localStorage (identyclaw.verify.audience), which can be Guru.
 if (absolute.hostname === 'verify.identyclaw.com') {
 absolute.searchParams.set('view', 'expert');
 }
 if (!/^https?:\/\//i.test(href)) {
 const pathOnly = href.split(/[?#]/)[0];
 return pathOnly + absolute.search + absolute.hash;
 }
 return absolute.toString();
 }

 function isFunnelCta(href) {
 return FUNNEL_CTA_PREFIXES.some((prefix) => href.startsWith(prefix));
 }

 document.querySelectorAll('a[href]').forEach((anchor) => {
 const raw = (anchor.getAttribute('href') || '').trim();
 if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
 return;
 }
 try {
 if (isFunnelCta(raw) || isInternalMarketingPage(raw)) {
 anchor.href = applyAttribution(raw);
 }
 } catch {
 // Ignore malformed hrefs
 }
 });

 const host = (window.location.hostname || '').toLowerCase();
 const domain = ALLOWED_LAND_DOMAINS.has(host) ? host : 'www.discernible.io';

 const land = new URL('https://api.identyclaw.com/api/funnel/land');
 land.searchParams.set('domain', domain);
 land.searchParams.set('step', 'land');
 attribution.forEach((value, key) => {
 land.searchParams.set(key, value);
 });
 try {
 fetch(land.toString(), {
 method: 'GET',
 credentials: 'omit',
 cache: 'no-store',
 keepalive: true,
 mode: 'cors'
 }).catch(() => {});
 } catch {
 // Best-effort beacon; CTA query params still carry attribution
 }
})();

/**
 * Load jQuery + Mailchimp validate only when the newsletter is near the viewport
 * (or when the user focuses the email field), so hero LCP is not blocked.
 */
(function lazyLoadMailchimp() {
 const shell = document.getElementById('mc_embed_shell');
 if (!shell) {
 return;
 }

 let started = false;

 function loadScript(src, attrs) {
 return new Promise((resolve, reject) => {
 const el = document.createElement('script');
 el.src = src;
 el.async = true;
 if (attrs) {
 Object.keys(attrs).forEach((key) => {
 el.setAttribute(key, attrs[key]);
 });
 }
 el.onload = () => resolve(el);
 el.onerror = () => reject(new Error('Failed to load ' + src));
 document.body.appendChild(el);
 });
 }

 function initMailchimp() {
 window.fnames = window.fnames || [];
 window.ftypes = window.ftypes || [];
 window.fnames[0] = 'EMAIL';
 window.ftypes[0] = 'email';
 if (window.jQuery) {
 window.$mcj = window.jQuery.noConflict(true);
 }
 }

 function load() {
 if (started) {
 return;
 }
 started = true;
 loadScript('https://code.jquery.com/jquery-3.7.1.min.js', {
 integrity: 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=',
 crossorigin: 'anonymous'
 })
 .then(() =>
 loadScript('https://s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js')
 )
 .then(initMailchimp)
 .catch(() => {
 // Newsletter still posts to Mailchimp without client-side validate.
 });
 }

 shell.addEventListener('focusin', load, { once: true });

 if ('IntersectionObserver' in window) {
 const observer = new IntersectionObserver(
 (entries) => {
 if (entries.some((entry) => entry.isIntersecting)) {
 observer.disconnect();
 load();
 }
 },
 { rootMargin: '200px 0px' }
 );
 observer.observe(shell);
 } else {
 load();
 }
})();
