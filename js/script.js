// Catarina Chia - Portfolio Scripts v3

document.addEventListener('DOMContentLoaded', () => {

  /* Active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  /* Header scroll shadow */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (header) {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    updateProgress();
    updateParallax();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Scroll progress bar */
  const progressBar = document.querySelector('.progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  updateProgress();

  /* Parallax elements */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  function updateParallax() {
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top - window.innerHeight / 2;
      el.style.transform = 'translateY(' + (centerOffset * speed * -0.15) + 'px)';
    });
  }
  updateParallax();

  /* Custom cursor */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(min-width: 901px)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('a, button, .card, .creator-card, .magnetic');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });
  }

  /* Magnetic buttons */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.35) + 'px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* Scroll reveal system */
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-mask';
  const revealEls = document.querySelectorAll(revealSelectors);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* Animated stat counters */
  function formatNum(n) {
    if (n >= 1000000) {
      const v = n / 1000000;
      return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + 'M';
    }
    if (n >= 1000) {
      const v = n / 1000;
      return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + 'K';
    }
    return Math.floor(n).toString();
  }

  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterIO.observe(c));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    if (isNaN(target)) return;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = formatNum(current) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNum(target) + suffix;
    }
    requestAnimationFrame(tick);
  }

});
