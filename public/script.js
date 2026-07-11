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

document.querySelectorAll('.feature-card, .enroll-steps li').forEach((el) => {
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
