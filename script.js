// Mobile menu toggle
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Scroll reveals
const revealTargets = document.querySelectorAll(
  '.lede, .general-infos, .stat-row, .pull-quote, .timeline-item, .project-card, .repo-row, .stack-group, .footer-title'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => io.observe(el));

// Stagger timeline / project-card / stack-group reveals slightly
document.querySelectorAll('.timeline-item, .project-card, .stack-group').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
});
document.querySelectorAll('.repo-row').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 0.05}s`;
});

// Animated stat counters (count up once visible)
const statNums = document.querySelectorAll('.stat-num');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.4 });
statNums.forEach(el => counterIO.observe(el));

// Hero "live latency" ticker — cosmetic signal motif referencing the 45% latency stat
const latencyEl = document.getElementById('latencyCounter');
if (latencyEl) {
  let value = 210;
  const target = 115; // simulated post-optimization latency
  const start = performance.now();
  const duration = 2200;
  function animateLatency(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    value = Math.round(210 - eased * (210 - target));
    latencyEl.textContent = value;
    if (progress < 1) {
      requestAnimationFrame(animateLatency);
    } else {
      // gentle idle jitter to feel "live"
      setInterval(() => {
        const jitter = target + Math.round((Math.random() - 0.5) * 8);
        latencyEl.textContent = jitter;
      }, 1800);
    }
  }
  requestAnimationFrame(animateLatency);
}

// Active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-chapters a');
const navIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '0.75';
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => navIO.observe(s));
