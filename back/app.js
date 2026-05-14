/* --navbar collapse on mobile-- */
const btn = document.getElementById('menuBtn');
const menu = document.getElementById('mobileMenu');
btn.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});
/* ── Like System ──────────────────────────────── */
const likeCounts = {};
document.querySelectorAll('.like-btn').forEach(btn => {
  const id = btn.dataset.id;
  likeCounts[id] = 0;
  btn.addEventListener('click', () => {
    const heart = btn.querySelector('.heart');
    const liked = btn.classList.toggle('liked');
    likeCounts[id] += liked ? 1 : -1;
    heart.textContent = liked ? '❤️' : '🤍';
    heart.classList.remove('heart-animate');
    void heart.offsetWidth;                          // force reflow
    heart.classList.add('heart-animate');
    const counter = document.getElementById(`likes-${id}`);
    if (counter) counter.textContent = `${likeCounts[id]} like${likeCounts[id] !== 1 ? 's' : ''}`;
  });
});

/* ── Category Filter ──────────────────────────── */
const pills = document.querySelectorAll('.filter-pill');
const cards = document.querySelectorAll('#cardContainer .card');
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    cards.forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
    });
  });
});

/* ── Animated Counter ─────────────────────────── */
function animateCount(el, target, suffix = '') {
  const duration = 1400, start = performance.now();
  const update = now => {
    const t = Math.min((now - start) / duration, 1);
    const val = Math.round((1 - Math.pow(1 - t, 3)) * target);
    el.textContent = val >= 1000 ? (val / 1000).toFixed(0) + 'K' + suffix : val + suffix;
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
window.addEventListener('load', () => {
  setTimeout(() => {
    animateCount(document.getElementById('userNum'),  5000, '+');
    animateCount(document.getElementById('eventNum'), 200,  '');
  }, 600);
});

/* ── Scroll Reveal ────────────────────────────── */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Notification Bell ────────────────────────── */
let notifOpen = false;
document.getElementById('notifBtn').addEventListener('click', () => {
  document.getElementById('notifDot').style.display = 'none';
  notifOpen = !notifOpen;
});

/* ── Smooth Scroll Helper ─────────────────────── */
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Register CTA ─────────────────────────────── */
document.querySelectorAll('.reg-btn').forEach(btn => {
  btn.addEventListener('click', () => alert('🎉 Club registration coming soon! Stay tuned.'));
});

/* ── Action Buttons (Register / Follow) ──────── */
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = '✅ Registered!';
    btn.disabled = true;
    btn.style.cssText = 'background:#10b981;color:#fff;cursor:default;border-radius:9999px;padding:8px 16px;font-size:.75rem;';
  });
});
document.querySelectorAll('.follow-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = '✓ Following';
    btn.style.cssText = 'background:#5b3ff8;color:#fff;border:2px solid #5b3ff8;border-radius:9999px;padding:8px 16px;font-size:.75rem;';
  });
});