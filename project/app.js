// 1. Dynamically Load Components
async function loadComponents() {
  const script = document.currentScript || Array.from(document.scripts).find(s => s.src && s.src.endsWith('app.js'));
  const baseUrl = script ? new URL('.', script.src) : new URL('.', window.location.href);

  const navContainer = document.getElementById('nav-placeholder');
  const footerContainer = document.getElementById('footer-placeholder');

  if (navContainer) {
    const navRes = await fetch(new URL('components/navbar.html', baseUrl));
    navContainer.innerHTML = await navRes.text();
    fixNavPaths(); // 👈 called right after navbar is injected
  }
  if (footerContainer) {
    const footRes = await fetch(new URL('components/footer.html', baseUrl));
    footerContainer.innerHTML = await footRes.text();
  }

  // 2. Initialize the site features AFTER components are loaded
  initSiteFeatures();
}

// Fix navbar links depending on current page depth
function fixNavPaths() {
  const isRoot = !window.location.pathname.includes('/pages/');
  if (isRoot) {
    document.querySelectorAll('#navbar a[href^="../"]').forEach(link => {
      link.href = link.getAttribute('href').replace('../', '');
    });
  }
}

function initSiteFeatures() {
  // Footer Reveal & Sticky Layout
  const adjustLayout = () => {
    const vh = window.innerHeight;
    document.querySelectorAll('section[id]').forEach((sec, index) => {
      const h = sec.offsetHeight;
      sec.style.top = h > vh - 100 ? `calc(100vh - ${h}px - 2rem)` : `${5 + (index * 1.2)}rem`;
    });
    const footer = document.querySelector('footer');
    const main = document.getElementById('main-content');
    if (footer && main) main.style.marginBottom = `${footer.offsetHeight}px`;
  };

  const observer = new ResizeObserver(adjustLayout);
  document.querySelectorAll('section[id], .article-container').forEach(el => observer.observe(el));
  window.addEventListener('resize', adjustLayout);
  setTimeout(adjustLayout, 200);

  // Smooth Go To Top
  const goTopBtn = document.querySelector('.go-top-trigger');
  if (goTopBtn) {
    goTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Reveal Animation
  const srEls = document.querySelectorAll('.sr');
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  srEls.forEach(el => revObs.observe(el));

  // Active Nav Tracker
  const navLinks = document.querySelectorAll('nav ul li a[data-nav]');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        const a = document.querySelector(`nav ul li a[data-nav="${e.target.id}"]`);
        if (a) a.classList.add('is-active');
      }
    });
  }, { rootMargin: '-38% 0px -58% 0px' });
  document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));
}

// Boot the app
document.addEventListener("DOMContentLoaded", loadComponents);