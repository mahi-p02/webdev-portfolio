document.addEventListener("DOMContentLoaded", () => {
  const skillsSection = document.getElementById("skills");
  const skillsContainer = document.getElementById("skills-container");

  if (!skillsSection || !skillsContainer) return;
  const ANIMATION_DURATION = 3000;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillsContainer.classList.add("skills-loading");
          obs.unobserve(skillsSection);

          setTimeout(() => {
            skillsContainer.classList.remove("skills-loading");
            skillsContainer.classList.add("skills-loaded");
          }, ANIMATION_DURATION);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(skillsSection);
});

/* ── CURSOR ── */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let ringX = mouseX, ringY = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Add hover effect to interactive elements
document.querySelectorAll('a, button, .project-card, .skill-card, .bento-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('w-16', 'h-16', 'opacity-25', 'border-purple-3', 'bg-purple-2/10');
      cursorRing.classList.remove('w-10', 'h-10', 'opacity-40', 'border-purple-2');
  });
  el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('w-16', 'h-16', 'opacity-25', 'border-purple-3', 'bg-purple-2/10');
      cursorRing.classList.add('w-10', 'h-10', 'opacity-40', 'border-purple-2');
  });
});

/* ── INTRO ── */
const intro = document.getElementById('intro');
const portfolio = document.getElementById('portfolio');
const loadingPercent = document.getElementById('loading-percent');
const loadingRing = document.getElementById('loading-ring');

const CIRCUMFERENCE = 2 * Math.PI * 45; // r=45 → ≈282.7

// Animate both the number AND the ring together, driven by one rAF loop
function animateLoader(duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    const percent = Math.floor(progress * 100);
    loadingPercent.textContent = percent;

    const offset = CIRCUMFERENCE * (1 - progress);
    loadingRing.style.strokeDashoffset = offset;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

document.body.style.overflowY = 'hidden';

setTimeout(() => {
  animateLoader(2500);
}, 500);

setTimeout(() => {
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    portfolio.classList.add('visible');
    document.body.style.overflowY = 'auto';
    initBgCanvas();
    initScrollReveal();
    startTypewriter();

    document.querySelectorAll('.name-letter').forEach((letter, i) => {
      setTimeout(() => letter.classList.add('glow-in'), i * 150);
    });

  }, 800);
}, 3200);

/* ── TYPEWRITER ── */
function startTypewriter() {
  const name = 'Mahi';
  const el = document.getElementById('tw-word');
  if (!el) return;

  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    if (!isDeleting) {
      el.classList.add('typing');
      el.textContent = name.slice(0, ++charIndex);
      if (charIndex === name.length) {
        el.classList.remove('typing');
        isDeleting = true;
        setTimeout(tick, 1000);
        return;
      }
      setTimeout(tick, 120);
    } else {
      el.classList.add('typing');
      el.textContent = name.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 60);
    }
  }
  tick();
}

/* ── BACKGROUND CANVAS ── */
function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3,
    alpha: Math.random() * 0.4 + 0.1, twinkle: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.012
  }));

  const blobs = [
    { x: 0.15, y: 0.25, r: 0.3, hue: 270, sat: 70, lit: 35 },
    { x: 0.85, y: 0.65, r: 0.35, hue: 280, sat: 65, lit: 30 },
    { x: 0.5, y: 0.85, r: 0.25, hue: 255, sat: 80, lit: 38 }
  ];

  let time = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    blobs.forEach((blob, i) => {
      const x = blob.x * width + Math.sin(time * 0.08 + i * 2) * width * 0.03;
      const y = blob.y * height + Math.cos(time * 0.06 + i * 1.5) * height * 0.03;
      const r = blob.r * Math.min(width, height) * (1 + 0.08 * Math.sin(time * 0.05 + i));
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, `hsla(${blob.hue}, ${blob.sat}%, ${blob.lit}%, 0.12)`);
      gradient.addColorStop(0.5, `hsla(${blob.hue}, ${blob.sat}%, ${blob.lit}%, 0.05)`);
      gradient.addColorStop(1, `hsla(${blob.hue}, ${blob.sat}%, ${blob.lit}%, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });
    stars.forEach(star => {
      star.twinkle += star.speed;
      const alpha = star.alpha * (0.4 + 0.6 * Math.sin(star.twinkle));
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 180, 255, ${alpha})`;
      ctx.fill();
    });
    time += 0.01;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── SCROLL REVEAL & STATS ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  elements.forEach(el => observer.observe(el));
  animateStats();
}

function animateStats() {
  const nums = document.querySelectorAll('[data-target]');
  const sio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.target;
      const target = parseInt(raw, 10) || 0;
      const suffix = raw.replace(/[0-9]/g, '');
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + (p >= 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      sio.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => sio.observe(n));
}

/* ── NAV & SCROLL PROGRESS ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('text-purple-2', link.getAttribute('href') === '#' + current);
    link.classList.toggle('before:w-full', link.getAttribute('href') === '#' + current);
  });
  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - doc.clientHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress.style.width = percent + '%';
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});