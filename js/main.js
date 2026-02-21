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

/* ── Form helpers ─────────────────────────────────────────── */
function showFieldError(input, message) {
  input.classList.add('error');
  const errEl = input.closest('.form-group').querySelector('.field-error');
  if (errEl) errEl.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errEl = input.closest('.form-group').querySelector('.field-error');
  if (errEl) errEl.textContent = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(form) {
  let valid = true;

  const nameEl  = form.querySelector('[name="name"]');
  const tradeEl = form.querySelector('[name="trade"]');
  const emailEl = form.querySelector('[name="email"]');

  [nameEl, tradeEl, emailEl].forEach(el => { if (el) clearFieldError(el); });

  if (nameEl && !nameEl.value.trim()) {
    showFieldError(nameEl, 'Please enter your name.');
    valid = false;
  }
  if (tradeEl && !tradeEl.value) {
    showFieldError(tradeEl, 'Please select your trade.');
    valid = false;
  }
  if (emailEl) {
    if (!emailEl.value.trim()) {
      showFieldError(emailEl, 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(emailEl.value.trim())) {
      showFieldError(emailEl, 'Please enter a valid email address.');
      valid = false;
    }
  }

  return valid;
}

/* ── Web3Forms submission handler ────────────────────────── */
async function handleFormSubmit(form) {
  const submitBtn  = form.querySelector('.form-submit');
  const btnText    = form.querySelector('.btn-text');
  const btnLoading = form.querySelector('.btn-loading');
  const successMsg = form.querySelector('.form-success');

  // Show loading
  if (submitBtn)  submitBtn.disabled = true;
  if (btnText)    btnText.hidden     = true;
  if (btnLoading) btnLoading.hidden  = false;

  try {
    const data     = new FormData(form);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });
    const result = await response.json();

    if (result.success) {
      form.reset();
      if (submitBtn)  submitBtn.hidden  = true;
      if (successMsg) successMsg.hidden = false;
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch {
    // Re-enable button so user can try again
    if (submitBtn)  { submitBtn.disabled = false; }
    if (btnText)    { btnText.hidden     = false; }
    if (btnLoading) { btnLoading.hidden  = true; }
    alert('Something went wrong. Please email us directly at hello@web-orb.uk');
  }
}

/* ── Wire up all forms on the page ───────────────────────── */
['contact-form', 'founding-form'].forEach(id => {
  const form = document.getElementById(id);
  if (!form) return;

  // Live clear errors
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input',  () => clearFieldError(el));
    el.addEventListener('change', () => clearFieldError(el));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(form)) handleFormSubmit(form);
  });
});

/* ── Testimonials Carousel ───────────────────────────────── */
(function () {
  const track   = document.getElementById('testimonials-track');
  const dotsEl  = document.getElementById('t-dots');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  if (!track || !dotsEl || !prevBtn || !nextBtn) return;

  const cards  = [...track.querySelectorAll('.testimonial-card')];
  const total  = cards.length;
  let current  = 0;
  let perView  = calcPerView();
  let autoTimer = null;

  function calcPerView() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 580) return 2;
    return 1;
  }

  function maxIdx() { return Math.max(0, total - perView); }

  function cardStride() {
    if (!cards[0]) return 0;
    return cards[0].offsetWidth + 24; // width + gap
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const pages = maxIdx() + 1;
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      btn.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
      dotsEl.appendChild(btn);
    }
    updateDots();
  }

  function updateDots() {
    [...dotsEl.querySelectorAll('button')].forEach((b, i) => {
      b.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx()));
    track.style.transform = `translateX(-${current * cardStride()}px)`;
    updateDots();
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIdx();
  }

  function next() { goTo(current >= maxIdx() ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? maxIdx() : current - 1); }

  function startAuto() { autoTimer = setInterval(next, 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  // Pause on hover
  const viewport = track.closest('.carousel-viewport');
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // Touch / swipe
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = tx - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 48) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
  }, { passive: true });

  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const pv = calcPerView();
      if (pv !== perView) {
        perView = pv;
        current = 0;
        buildDots();
      }
      goTo(current);
    }, 120);
  }, { passive: true });

  // Init
  buildDots();
  goTo(0);
  startAuto();
})();

/* ── Portfolio Filter ────────────────────────────────────── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('#projects-grid .project-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.trade === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();
