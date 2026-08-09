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

document.querySelectorAll('a, button, .project-card, .skill-card, .bento-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ── INTRO ── */
const intro = document.getElementById('intro');
const portfolio = document.getElementById('portfolio');

setTimeout(() => {
  intro.style.opacity = '0';
  intro.style.transition = 'opacity 0.8s ease';
  setTimeout(() => {
    intro.style.display = 'none';
    portfolio.classList.add('visible');
    document.body.style.overflowY = 'auto';
    initBgCanvas();
    initOrb();
    initScrollReveal();
    startTypewriter();
  }, 800);
}, 3200);

document.body.style.overflowY = 'hidden';

/* ── TYPEWRITER ── */
function startTypewriter() {
  const name = 'Mahi';
  const el = document.getElementById('tw-word');
  if (!el) return;

  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    if (!isDeleting) {
      // ── TYPING PHASE ──
      el.classList.add('typing');               // ← show cursor
      el.textContent = name.slice(0, ++charIndex);

      if (charIndex === name.length) {
        // Name fully typed → HIDE cursor, wait 5s, then delete
        el.classList.remove('typing');          // ← cursor disappears here
        isDeleting = true;
        setTimeout(tick, 1000);
        return;
      }

      setTimeout(tick, 120);
    } else {
      // ── DELETING PHASE ──
      el.classList.add('typing');               // ← cursor back while deleting
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
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.3,
    alpha: Math.random() * 0.4 + 0.1,
    twinkle: Math.random() * Math.PI * 2,
    speed: 0.008 + Math.random() * 0.012
  }));

  const blobs = [
    { x: 0.15, y: 0.25, r: 0.3, hue: 270, sat: 70, lit: 35 },
    { x: 0.85, y: 0.65, r: 0.35, hue: 280, sat: 65, lit: 30 },
    { x: 0.5, y: 0.85, r: 0.25, hue: 255, sat: 80, lit: 38 }
  ];

  let time = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Blobs
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

    // Stars
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

/* ── ORB ── */
function initOrb() {
  const canvas = document.getElementById('orbCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrap = canvas.parentElement;
  let width, height, radius;

  function resize() {
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    radius = Math.min(width, height) * 0.4;
  }
  resize();
  window.addEventListener('resize', resize);

  const points = [];
  const latCount = 12, lonCount = 20;

  for (let i = 0; i <= latCount; i++) {
    const theta = (i / latCount) * Math.PI;
    for (let j = 0; j < lonCount; j++) {
      const phi = (j / lonCount) * Math.PI * 2;
      points.push({
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.cos(theta),
        z: Math.sin(theta) * Math.sin(phi)
      });
    }
  }

  let rotY = 0, rotX = 0.35;
  let targetRotY = 0, targetRotX = 0.35;

  document.addEventListener('mousemove', e => {
    const nx = (e.clientX / window.innerWidth - 0.5);
    const ny = (e.clientY / window.innerHeight - 0.5);
    targetRotY = nx * 1.2;
    targetRotX = 0.35 + ny * 0.6;
  });

  function project(point) {
    let x = point.x * Math.cos(rotY) - point.z * Math.sin(rotY);
    let z = point.x * Math.sin(rotY) + point.z * Math.cos(rotY);
    let y = point.y * Math.cos(rotX) - z * Math.sin(rotX);
    z = point.y * Math.sin(rotX) + z * Math.cos(rotX);
    
    const scale = 1 / (2 - z * 0.5);
    return {
      sx: x * radius * scale,
      sy: y * radius * scale,
      z,
      scale
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    rotY += (targetRotY - rotY) * 0.02 + 0.003;
    rotX += (targetRotX - rotX) * 0.03;

    const projected = points.map(project);
    const centerX = width / 2;
    const centerY = height / 2;

    // Longitude lines
    for (let j = 0; j < lonCount; j++) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= latCount; i++) {
        const p = projected[i * lonCount + j];
        if (p.z < -0.2) {
          started = false;
          continue;
        }
        const px = centerX + p.sx;
        const py = centerY + p.sy;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      const frontness = Math.cos(j / lonCount * Math.PI * 2 + rotY);
      ctx.strokeStyle = `rgba(167, 139, 250, ${0.06 + Math.max(0, frontness) * 0.18})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Latitude lines
    for (let i = 1; i < latCount; i++) {
      ctx.beginPath();
      let started = false;
      for (let j = 0; j <= lonCount; j++) {
        const p = projected[i * lonCount + (j % lonCount)];
        if (p.z < -0.2) {
          started = false;
          continue;
        }
        const px = centerX + p.sx;
        const py = centerY + p.sy;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Points
    projected.forEach(p => {
      if (p.z < -0.15) return;
      const px = centerX + p.sx;
      const py = centerY + p.sy;
      const brightness = (p.z + 1) / 2;
      
      ctx.beginPath();
      ctx.arc(px, py, 1.5 * p.scale * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 200, 255, ${0.2 + brightness * 0.6})`;
      ctx.fill();
    });

    // Core glow
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.5);
    coreGradient.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
    coreGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── SCROLL REVEAL ── */
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

/* ── STATS ── */
/* ── STAT COUNT-UP ── */
function animateStats() {
  const nums = document.querySelectorAll('.stat-num');
  const sio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.target;                 // e.g. "5+", "20"
      const target = parseInt(raw, 10) || 0;
      const suffix = raw.replace(/[0-9]/g, '');       // captures "+" if present, else ""
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
const navLinks = document.querySelectorAll('.nav-links a');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });

  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - doc.clientHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress.style.width = percent + '%';
}, { passive: true });

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});