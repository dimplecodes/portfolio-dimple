/* ============================================
   PORTFOLIO - ANIMATIONS SCRIPT
   Author: Dimple
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSkillBars();
  initParticles();
});

/* ── Scroll Reveal Observer ─────────────────── */
function initScrollReveal() {
  // Elements with .reveal class
  const revealEls = document.querySelectorAll('.reveal');
  const staggerEls = document.querySelectorAll('.stagger-children');
  const timelineItems = document.querySelectorAll('.timeline-item');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));
  staggerEls.forEach(el => revealObserver.observe(el));
  timelineItems.forEach(el => revealObserver.observe(el));
}

/* ── Animated Skill Bars ────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = bar.dataset.width || '0';
          // Small delay for stagger effect
          const delay = parseInt(bar.dataset.delay || '0');
          setTimeout(() => {
            bar.style.width = `${target}%`;
          }, delay);
          barObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => barObserver.observe(bar));
}

/* ── Particle Canvas ────────────────────────── */
function initParticles() {
  const canvas  = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx     = canvas.getContext('2d');
  let particles = [];
  let animId;
  let width, height;

  /* Resize canvas to fill hero */
  function resize() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    width  = canvas.width  = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  /* Particle factory */
  function createParticle() {
    return {
      x:    Math.random() * width,
      y:    Math.random() * height,
      r:    Math.random() * 1.8 + 0.3,
      dx:   (Math.random() - 0.5) * 0.4,
      dy:   (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.4 + 0.1,
    };
  }

  /* Initialize particles */
  function initPool() {
    const count = Math.min(Math.floor((width * height) / 8000), 120);
    particles = Array.from({ length: count }, createParticle);
  }

  /* Draw loop */
  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      // Move
      p.x += p.dx;
      p.y += p.dy;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
      ctx.fill();

      // Draw lines to nearby particles
      particles.slice(i + 1).forEach(q => {
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 100) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    animId = requestAnimationFrame(draw);
  }

  /* Pause when not visible */
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animId) draw();
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { threshold: 0 }
    );
    visObserver.observe(heroSection);
  }

  resize();
  initPool();
  draw();

  window.addEventListener('resize', () => {
    resize();
    initPool();
  }, { passive: true });
}

