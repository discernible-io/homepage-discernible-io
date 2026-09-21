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
 * Cookieless CTA attribution for purchase.identyclaw.com + lastcradle.io/enroll.
 * Contract: idclawserver-idc content/developer-growth-plan.md (Sibling emit contract).
 * Query/memory only — no cookies / localStorage / sessionStorage visitor ids.
 */
(function stampFunnelAttribution() {
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const FUNNEL_HOSTS = [
    { host: "purchase.identyclaw.com", paths: null },
    { host: "lastcradle.io", paths: ["/enroll"] },
    { host: "www.lastcradle.io", paths: ["/enroll"] },
  ];

  function pick(value) {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed || null;
  }

  function readFromSearch(search) {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    const out = {};
    for (const key of UTM_KEYS) {
      const value = pick(params.get(key));
      if (value) out[key] = value;
    }
    const funnelId = pick(params.get("funnel_id")) || pick(params.get("vid"));
    if (funnelId) out.funnel_id = funnelId;
    return out;
  }

  function mintFunnelId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID().replace(/-/g, "");
    }
    return `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  }

  const attribution = readFromSearch(window.location.search);
  if (!attribution.funnel_id) {
    attribution.funnel_id = mintFunnelId();
  }

  try {
    const url = new URL(window.location.href);
    for (const key of UTM_KEYS) {
      if (attribution[key]) url.searchParams.set(key, attribution[key]);
    }
    url.searchParams.set("funnel_id", attribution.funnel_id);
    url.searchParams.delete("vid");
    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) {
      window.history.replaceState({}, document.title, next);
    }
  } catch {
    /* ignore */
  }

  function shouldStamp(anchor) {
    let parsed;
    try {
      parsed = new URL(anchor.href, window.location.origin);
    } catch {
      return false;
    }
    return FUNNEL_HOSTS.some((rule) => {
      if (parsed.hostname !== rule.host) return false;
      if (!rule.paths) return true;
      return rule.paths.some((p) => parsed.pathname === p || parsed.pathname.startsWith(`${p}/`));
    });
  }

  document.querySelectorAll("a[href]").forEach((anchor) => {
    if (!shouldStamp(anchor)) return;
    try {
      const url = new URL(anchor.href, window.location.origin);
      for (const key of UTM_KEYS) {
        if (attribution[key] && !url.searchParams.has(key)) {
          url.searchParams.set(key, attribution[key]);
        }
      }
      if (attribution.funnel_id && !url.searchParams.has("funnel_id")) {
        url.searchParams.set("funnel_id", attribution.funnel_id);
      }
      anchor.href = url.toString();
    } catch {
      /* ignore */
    }
  });
})();
