/* ═══════════════════════════════════════════════════════════
   WebOrb — main.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Sticky Nav ───────────────────────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile Menu ──────────────────────────────────────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── Smooth Scroll for anchor links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav').offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Scroll Reveal ────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ── Counter Animation ────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
})();

/* ── Contact Form Validation ─────────────────────────────── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = form.querySelector('.form-submit');
  const btnText    = form.querySelector('.btn-text');
  const btnLoading = form.querySelector('.btn-loading');
  const successMsg = form.querySelector('.form-success');

  function showError(input, message) {
    input.classList.add('error');
    const errEl = input.closest('.form-group').querySelector('.field-error');
    if (errEl) errEl.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.closest('.form-group').querySelector('.field-error');
    if (errEl) errEl.textContent = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    let valid = true;

    const name  = form.querySelector('#name');
    const trade = form.querySelector('#trade');
    const email = form.querySelector('#email');

    clearError(name);
    clearError(trade);
    clearError(email);

    if (!name.value.trim()) {
      showError(name, 'Please enter your name.');
      valid = false;
    }

    if (!trade.value) {
      showError(trade, 'Please select your trade.');
      valid = false;
    }

    if (!email.value.trim()) {
      showError(email, 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    return valid;
  }

  // Clear errors on input
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    // Show loading state
    submitBtn.disabled = true;
    btnText.hidden     = true;
    btnLoading.hidden  = false;

    // Simulate submission (replace with real endpoint)
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Show success
    form.reset();
    submitBtn.hidden  = true;
    successMsg.hidden = false;
  });
})();
