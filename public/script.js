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
 * The stitch id lives in sessionStorage for this tab only. It is not written into
 * the address bar or into copyable hrefs, so a shared link cannot merge later visitors.
 */
(function attachFunnelAttribution() {
 const UTM_KEYS = [
 'utm_source',
 'utm_medium',
 'utm_campaign',
 'utm_content',
 'utm_term'
 ];
 const FUNNEL_PARAM_KEYS = ['funnel_id', 'vid'];
 const STORAGE_KEY = 'funnel_id';
 const ALLOWED_LAND_DOMAINS = new Set(['www.discernible.io', 'discernible.io']);
 const FUNNEL_CTA_PREFIXES = [
 'https://purchase.identyclaw.com',
 'https://verify.identyclaw.com',
 'https://lastcradle.io'
 ];
 // Same-origin marketing pages — preserve campaign UTMs across page hops.
 const INTERNAL_PAGE_RE = /^(?:\.\/)?(?:index|developers)\.html(?:[?#]|$)/i;

 const inbound = new URLSearchParams(window.location.search);
 const campaign = new URLSearchParams();

 UTM_KEYS.forEach((key) => {
 const value = (inbound.get(key) || '').trim();
 if (value) {
 campaign.set(key, value);
 }
 });

 // A funnel_id in the URL is a published stitch id. Drop it so this visit
 // is not recorded as the visitor who first copied the link.
 const address = new URL(window.location.href);
 let strippedFunnelParam = false;
 FUNNEL_PARAM_KEYS.forEach((key) => {
 if (address.searchParams.has(key)) {
 address.searchParams.delete(key);
 strippedFunnelParam = true;
 }
 });
 if (strippedFunnelParam) {
 const qs = address.searchParams.toString();
 window.history.replaceState({}, document.title, address.pathname + (qs ? `?${qs}` : '') + address.hash);
 }

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
 // Private mode: this page still beacons its own id, but hops will not stitch.
 }
 }

 function applyParams(href, params) {
 const absolute = new URL(href, window.location.href);
 params.forEach((value, key) => {
 if (!absolute.searchParams.has(key)) {
 absolute.searchParams.set(key, value);
 }
 });
 if (!/^https?:\/\//i.test(href)) {
 const pathOnly = href.split(/[?#]/)[0];
 return pathOnly + absolute.search + absolute.hash;
 }
 return absolute.toString();
 }

 function applyOutbound(href) {
 const params = new URLSearchParams(campaign);
 params.set('funnel_id', funnelId);
 return applyParams(href, params);
 }

 function isFunnelCta(href) {
 return FUNNEL_CTA_PREFIXES.some((prefix) => href.startsWith(prefix));
 }

 function armCta(anchor) {
 if (!anchor.dataset.funnelCleanHref) {
 anchor.dataset.funnelCleanHref = anchor.getAttribute('href');
 }
 anchor.href = applyOutbound(anchor.dataset.funnelCleanHref);
 }

 function disarmCta(anchor) {
 if (anchor.dataset.funnelCleanHref) {
 anchor.href = anchor.dataset.funnelCleanHref;
 }
 }

 document.querySelectorAll('a[href]').forEach((anchor) => {
 const raw = (anchor.getAttribute('href') || '').trim();
 if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
 return;
 }
 try {
 if (isFunnelCta(raw)) {
 const follow = () => {
 armCta(anchor);
 setTimeout(() => disarmCta(anchor), 0);
 };
 anchor.addEventListener('click', follow);
 anchor.addEventListener('auxclick', follow);
 return;
 }
 if (campaign.toString() && INTERNAL_PAGE_RE.test(raw)) {
 anchor.href = applyParams(raw, campaign);
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
 campaign.forEach((value, key) => {
 land.searchParams.set(key, value);
 });
 land.searchParams.set('funnel_id', funnelId);
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
