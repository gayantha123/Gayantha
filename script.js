// =========================================================
// Utility: typewriter
// =========================================================
function typeInto(el, text, speed = 32) {
  return new Promise((resolve) => {
    if (!el) return resolve();
    let i = 0;
    el.textContent = '';
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================================================
// Boot intro sequence
// =========================================================
async function runBoot() {
  const boot = document.getElementById('boot-screen');
  const l1 = document.getElementById('boot-line-1');
  const l2 = document.getElementById('boot-line-2');
  const l3 = document.getElementById('boot-line-3');
  const status = document.getElementById('boot-status');

  if (prefersReducedMotion) {
    boot.classList.add('hidden');
    document.body.classList.add('booted');
    return;
  }

  await typeInto(l1, 'npm run portfolio', 28);
  await new Promise(r => setTimeout(r, 150));
  await typeInto(l2, 'compiling creativity...', 22);
  await new Promise(r => setTimeout(r, 150));
  await typeInto(l3, 'loading gayantha.dev', 22);
  status.textContent = '✓ ready in 0.4s — welcome!';
  await new Promise(r => setTimeout(r, 600));

  boot.classList.add('hidden');
  document.body.classList.add('booted');
  startHeroTyping();
}

// =========================================================
// Hero name typewriter (runs after boot)
// =========================================================
function startHeroTyping() {
  const el = document.getElementById('typed-name');
  if (prefersReducedMotion) {
    el.textContent = "'Gayantha Lochana'";
    return;
  }
  typeInto(el, "'Gayantha Lochana'", 45);
}

// =========================================================
// Footer outro typewriter — triggers when footer scrolls into view
// =========================================================
function setupOutro() {
  const outroEl = document.getElementById('outro-line');
  const footer = document.getElementById('site-footer');
  if (!outroEl || !footer) return;
  let played = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !played) {
        played = true;
        if (prefersReducedMotion) {
          outroEl.textContent = 'process exited with code 0 — thanks for visiting';
        } else {
          typeInto(outroEl, 'process exited with code 0 — thanks for visiting', 26);
        }
      }
    });
  }, { threshold: 0.4 });

  observer.observe(footer);
}

// =========================================================
// Active tab highlighting on scroll
// =========================================================
function setupTabHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const tabs = document.querySelectorAll('.tab');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tabs.forEach((tab) => {
          tab.classList.toggle('active', tab.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-64px 0px -40% 0px' });

  sections.forEach((section) => observer.observe(section));
}

// =========================================================
// Mobile nav toggle
// =========================================================
function setupMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const tabs = document.getElementById('tabs');
  if (!toggle || !tabs) return;

  toggle.addEventListener('click', () => {
    const isOpen = tabs.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  tabs.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

// =========================================================
// GSAP scroll reveals
// =========================================================
function setupScrollReveals() {
  if (typeof gsap === 'undefined' || prefersReducedMotion) return;
  gsap.registerPlugin(ScrollTrigger);

  const groups = [
    '.about-window', '.about-copy > p', '.skill-card',
    '.work-card', '.contact-form', '.contact-info .info-row',
  ];

  groups.forEach((selector) => {
    const items = gsap.utils.toArray(selector);
    if (!items.length) return;
    gsap.from(items, {
      opacity: 0,
      y: 36,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: items[0],
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  gsap.utils.toArray('.section-title, .section-eyebrow').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

// =========================================================
// Smooth scroll for in-page links
// =========================================================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
}

// =========================================================
// Contact form — opens a pre-filled email (no backend wired up)
// =========================================================
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:gayanthalochana70@gmail.com?subject=${subject}&body=${body}`;

    note.textContent = '✓ opening your email client...';
    form.reset();
  });
}

// =========================================================
// Init
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  runBoot();
  setupOutro();
  setupTabHighlight();
  setupMobileNav();
  setupScrollReveals();
  setupSmoothScroll();
  setupContactForm();
});
