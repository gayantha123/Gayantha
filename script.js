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

function setProgress(bar, pct) {
  if (bar) bar.style.width = `${pct}%`;
}

// =========================================================
// Boot intro — cinematic multi-stage sequence
// =========================================================
async function runBoot() {
  const boot = document.getElementById('boot-screen');
  const stageCursor = document.getElementById('stage-cursor');
  const stageTerminal = document.getElementById('stage-terminal');
  const stageCompile = document.getElementById('stage-compile');
  const stageLogo = document.getElementById('stage-logo');
  const l1 = document.getElementById('boot-line-1');
  const l2 = document.getElementById('boot-line-2');
  const l3 = document.getElementById('boot-line-3');
  const status = document.getElementById('boot-status');
  const progressBar = document.getElementById('boot-progress-bar');
  const compilePercent = document.getElementById('compile-percent');
  const compileScroll = document.getElementById('compile-scroll');
  const logoBuild = document.getElementById('logo-build');
  const fragGl = logoBuild.querySelector('.frag-gl');
  const curtain = boot.querySelector('.boot-curtain');

  function showStage(el) {
    [stageCursor, stageTerminal, stageCompile, stageLogo].forEach((s) => s.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  if (prefersReducedMotion) {
    boot.style.display = 'none';
    document.body.classList.add('booted');
    startHeroTyping();
    return;
  }

  // Stage 0 — blinking cursor
  showStage(stageCursor);
  await new Promise(r => setTimeout(r, 550));

  // Stage 1 — terminal boot
  showStage(stageTerminal);
  await typeInto(l1, 'npm run portfolio', 24);
  setProgress(progressBar, 30);
  await new Promise(r => setTimeout(r, 120));
  await typeInto(l2, 'compiling creativity...', 18);
  setProgress(progressBar, 68);
  await new Promise(r => setTimeout(r, 120));
  await typeInto(l3, 'loading gayantha.dev', 18);
  setProgress(progressBar, 100);
  status.textContent = '✓ handing off to build pipeline...';
  await new Promise(r => setTimeout(r, 400));

  // Stage 2 — compiling flythrough
  const codeLines = [
    "import { Creativity } from 'gayantha';",
    "const build = () => ship();",
    "compiling → hero.jsx ... ok",
    "compiling → about.js ... ok",
    "compiling → dashboard.tsx ... ok",
    "bundling assets [====......] ",
    "optimizing animations ... ok",
    "resolving fonts: JetBrains Mono, Space Grotesk",
    "linking social endpoints ... ok",
    "minifying styles ... ok",
    "> build succeeded in 412ms",
  ];
  compileScroll.innerHTML = Array.from({ length: 4 }, () =>
    codeLines.map(line => `<div>${line}</div>`).join('')
  ).join('');
  showStage(stageCompile);

  let pct = 0;
  await new Promise((resolve) => {
    const timer = setInterval(() => {
      pct += Math.round(4 + Math.random() * 10);
      if (pct >= 100) { pct = 100; clearInterval(timer); resolve(); }
      compilePercent.textContent = `${pct}%`;
    }, 70);
  });
  await new Promise(r => setTimeout(r, 250));

  // Stage 3 — logo assembly + glitch
  showStage(stageLogo);
  await new Promise(r => setTimeout(r, 80));
  logoBuild.classList.add('assembled');
  await new Promise(r => setTimeout(r, 750));
  stageLogo.classList.add('tagline-in');
  await new Promise(r => setTimeout(r, 400));
  fragGl.classList.add('flash');
  await new Promise(r => setTimeout(r, 550));

  // Reveal — curtain wipe
  document.body.classList.add('booted');
  startHeroTyping();
  curtain.classList.add('open');
  await new Promise(r => setTimeout(r, 950));

  boot.classList.add('done');
  boot.style.display = 'none';
}

// =========================================================
// Live background — drifting code glyphs on canvas
// =========================================================
function setupBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const glyphs = ['{ }', '</>', '=>', ';', '( )', '01', '10', '#', '&&', '||', 'fn', 'let'];
  const colors = ['#c9a3ff', '#7ee8a8', '#7db8ff', '#ffab7a', '#f6d374'];
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = Math.min(38, Math.floor((w * h) / 42000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: 0.15 + Math.random() * 0.25,
      vx: (Math.random() - 0.5) * 0.12,
      size: 11 + Math.random() * 9,
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.06 + Math.random() * 0.09,
    }));
  }

  if (prefersReducedMotion) {
    resize();
    makeParticles();
    ctx.font = '13px JetBrains Mono';
    particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillText(p.glyph, p.x, p.y);
    });
    window.addEventListener('resize', () => { resize(); });
    return;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;

      ctx.font = `${p.size}px JetBrains Mono`;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillText(p.glyph, p.x, p.y);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  makeParticles();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); makeParticles(); }, 200);
  });
}

// =========================================================
// Hero spotlight + 3D tilt (mouse-driven)
// =========================================================
function setupHeroInteraction() {
  const hero = document.querySelector('.hero');
  const spotlight = document.querySelector('.hero-spotlight');
  const tiltCard = document.querySelector('.hero-window');
  if (!hero || prefersReducedMotion) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    if (spotlight) {
      spotlight.style.setProperty('--mx', `${px}%`);
      spotlight.style.setProperty('--my', `${py}%`);
    }
    if (tiltCard) {
      const rx = ((py - 50) / 50) * -6;
      const ry = ((px - 50) / 50) * 8;
      tiltCard.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(1.2deg)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    if (tiltCard) {
      tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) rotate(1.2deg)';
    }
  });
}

// =========================================================
// Live status bar — reflects real scroll position, per-section file
// =========================================================
function setupStatusBar() {
  const posEl = document.getElementById('status-position');
  const fileEl = document.getElementById('status-file');
  if (!posEl) return;

  const fileMap = {
    home: 'index.html',
    about: 'about.js',
    work: 'work.py',
    dashboard: 'dashboard.tsx',
    contact: 'contact.md',
  };

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;
    const line = Math.max(1, Math.round(pct * 480) + 1);
    const col = 1 + Math.round((Math.sin(scrollTop / 37) + 1) * 20);
    posEl.textContent = `Ln ${line}, Col ${col}`;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  });
  update();

  // sync file name with the section currently in view
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fileEl.textContent = fileMap[entry.target.id] || 'index.html';
      }
    });
  }, { threshold: 0.4, rootMargin: '-64px 0px -40% 0px' });
  sections.forEach((s) => observer.observe(s));
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
    '.work-card', '.dash-card', '.contact-form', '.contact-info .info-row',
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
// Dashboard widgets
// =========================================================
function setupDashboard() {
  setupContribGrid();
  setupCountUps();
  setupSkillBars();
  setupLiveClock();
}

function setupContribGrid() {
  const grid = document.getElementById('contrib-grid');
  if (!grid) return;
  const cols = window.innerWidth <= 640 ? 24 : 48;
  const total = cols * 7;
  const cells = [];

  for (let i = 0; i < total; i++) {
    const rand = Math.random();
    let level = 0;
    if (rand > 0.92) level = 4;
    else if (rand > 0.8) level = 3;
    else if (rand > 0.62) level = 2;
    else if (rand > 0.4) level = 1;
    const cell = document.createElement('span');
    cell.className = 'contrib-cell';
    cell.setAttribute('data-level', String(level));
    grid.appendChild(cell);
    cells.push(cell);
  }

  if (prefersReducedMotion) {
    cells.forEach((c) => c.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cells.forEach((c, i) => setTimeout(() => c.classList.add('in'), i * 4));
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  observer.observe(grid);
}

function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

function setupCountUps() {
  const nums = document.querySelectorAll('.dash-stat-num[data-target]');
  if (!nums.length) return;

  if (prefersReducedMotion) {
    nums.forEach((el) => { el.textContent = Number(el.dataset.target).toLocaleString(); });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target, Number(entry.target.dataset.target));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach((el) => observer.observe(el));
}

function setupSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;

  if (prefersReducedMotion) {
    fills.forEach((f) => f.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach((f) => observer.observe(f));
}

function setupLiveClock() {
  const clockEl = document.getElementById('dash-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'Asia/Colombo',
    }).format(now);
    clockEl.textContent = formatted;
  }
  update();
  setInterval(update, 1000);
}

// =========================================================
// Init
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  setupBgCanvas();
  runBoot();
  setupOutro();
  setupTabHighlight();
  setupMobileNav();
  setupScrollReveals();
  setupSmoothScroll();
  setupContactForm();
  setupHeroInteraction();
  setupStatusBar();
  setupDashboard();
});
