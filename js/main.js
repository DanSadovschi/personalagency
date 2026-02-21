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

/* ── Form ─────────────────────────────────────────────────── */
function showFieldError(input, msg) {
  input.classList.add('error');
  const err = input.closest('.form-group').querySelector('.field-error');
  if (err) err.textContent = msg;
}

function clearFieldError(input) {
  input.classList.remove('error');
  const err = input.closest('.form-group').querySelector('.field-error');
  if (err) err.textContent = '';
}

function validateForm(form) {
  let ok = true;
  const name  = form.querySelector('[name="name"]');
  const trade = form.querySelector('[name="trade"]');
  const email = form.querySelector('[name="email"]');

  [name, trade, email].forEach(el => el && clearFieldError(el));

  if (name && !name.value.trim()) {
    showFieldError(name, 'Please enter your name.');
    ok = false;
  }
  if (trade && !trade.value) {
    showFieldError(trade, 'Please select your trade.');
    ok = false;
  }
  if (email) {
    if (!email.value.trim()) {
      showFieldError(email, 'Please enter your email.');
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email.');
      ok = false;
    }
  }
  return ok;
}

async function submitToWeb3Forms(form) {
  const btn     = form.querySelector('.form-submit');
  const txtSpan = form.querySelector('.btn-text');
  const ldSpan  = form.querySelector('.btn-loading');
  const success = form.querySelector('.form-success');

  btn.disabled   = true;
  txtSpan.hidden = true;
  ldSpan.hidden  = false;

  try {
    const payload = Object.fromEntries(new FormData(form));

    const res = await fetch('https://api.web3forms.com/submit', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body   : JSON.stringify(payload)
    });

    const json = await res.json();

    if (json.success) {
      form.reset();
      btn.hidden     = true;
      success.hidden = false;
    } else {
      throw new Error(json.message || 'Submission failed');
    }
  } catch (err) {
    btn.disabled   = false;
    txtSpan.hidden = false;
    ldSpan.hidden  = true;
    alert(err.message || 'Something went wrong — please email hello@web-orb.uk');
  }
}

/* ── Wire up all forms on the page ───────────────────────── */
['contact-form', 'founding-form'].forEach(id => {
  const form = document.getElementById(id);
  if (!form) return;

  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input',  () => clearFieldError(el));
    el.addEventListener('change', () => clearFieldError(el));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(form)) submitToWeb3Forms(form);
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
