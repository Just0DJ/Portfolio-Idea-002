// Portfolio interactions: smooth reveals, gentle tilt, card opening cues

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal cards on scroll using IntersectionObserver
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
);

document.querySelectorAll('.card').forEach((el) => observer.observe(el));

// Subtle tilt on hover relative to cursor for interactive cards
const tiltCards = document.querySelectorAll('.card.interactive');

tiltCards.forEach((card) => {
  const damp = 30; // lower = stronger tilt
  let rafId = null;
  let targetRotateX = 0;
  let targetRotateY = 0;

  function applyTransform() {
    card.style.transform = `translateY(-0px) rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
    rafId = null;
  }

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    targetRotateY = Math.max(-4, Math.min(4, dx / damp));
    targetRotateX = Math.max(-4, Math.min(4, -dy / damp));

    if (!rafId) rafId = requestAnimationFrame(applyTransform);
  });

  card.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
    if (!rafId) rafId = requestAnimationFrame(applyTransform);
  });
});

// Smooth scroll for nav links (CSS handles modern browsers; this adds focus management)
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Move focus to section for accessibility after scroll
      setTimeout(() => {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 600);
    }
  });
});

// Optional: Click to "open" cards by expanding inner content
// This uses a data attribute. Add data-openable to any card to enable.
document.querySelectorAll('.card[data-openable] .card-title').forEach((title) => {
  const card = title.closest('.card');
  title.style.cursor = 'pointer';
  title.addEventListener('click', () => {
    card.classList.toggle('open');
  });
});