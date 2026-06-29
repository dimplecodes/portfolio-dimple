/* ============================================
   PORTFOLIO - MAIN SCRIPT
   Author: Dimple
   ============================================ */

'use strict';

/* ── DOM Ready ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initHamburger();
  initSmoothScroll();
  initActiveNav();
  initBackToTop();
  initContactForm();
  initTypingEffect();
});

/* ── Navbar scroll effect ───────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}

/* ── Scroll progress bar ────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ── Mobile hamburger menu ──────────────────── */
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Smooth Scroll ──────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Active nav link on scroll ──────────────── */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');
  const navHeight = 80;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: `-${navHeight}px 0px -60% 0px`, threshold: 0 }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ── Back-to-top button ─────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Contact form ───────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn     = form.querySelector('.form-submit');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('i');

    // Simulate sending
    btn.disabled = true;
    btnText.textContent = 'Sending…';
    btnIcon.className = 'fa-solid fa-spinner fa-spin';

    setTimeout(() => {
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      btnIcon.className = 'fa-solid fa-paper-plane';
      form.reset();
      showToast('Message sent successfully! I\'ll get back to you soon. 🎉');
    }, 1800);
  });
}

/* ── Toast notification ─────────────────────── */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle toast-icon"></i><span class="toast-msg"></span>`;
    document.body.appendChild(toast);
  }

  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── Typing effect ──────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const roles = [
    'Artificial Intelligence & Machine Learning Student',
    'Problem Solver',
    'Software Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === current.length) {
      if (!isPaused) {
        isPaused = true;
        delay = 1800;
        setTimeout(() => { isDeleting = true; isPaused = false; type(); }, delay);
        return;
      }
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ── Lazy load images ───────────────────────── */
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach(img => observer.observe(img));
}

document.addEventListener('DOMContentLoaded', initLazyLoad);

