async function loadComponents() {
  const script = document.currentScript || Array.from(document.scripts).find(s => s.src && s.src.endsWith('app.js'));
  const baseUrl = script ? new URL('.', script.src) : new URL('.', window.location.href);

  const navContainer = document.getElementById('nav-placeholder');
  const footerContainer = document.getElementById('footer-placeholder');

  if (navContainer) {
    const navRes = await fetch(new URL('components/navbar.html', baseUrl));
    navContainer.innerHTML = await navRes.text();
    fixNavPaths();
    initHamburger();
  }
  
  if (footerContainer) {
    const footRes = await fetch(new URL('components/footer.html', baseUrl));
    footerContainer.innerHTML = await footRes.text();
  }

  initSiteFeatures();
}

function fixNavPaths() {
  const isRoot = !window.location.pathname.includes('/pages/');
  if (isRoot) {
    document.querySelectorAll('#navbar a[href^="../"]').forEach(link => {
      link.href = link.getAttribute('href').replace('../', '');
    });
  }
}

function initHamburger() {
  // Toggle
const hamburger = document.querySelector('.nav-hamburger');
const navMenu = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open'); // Animates the X
  navMenu.classList.toggle('open');    // Animates the dropdown
});
}

function initSiteFeatures() {
  const mainContent = document.getElementById('main-content');
  const footer = document.querySelector('footer');

  const adjustLayout = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (footer && mainContent) {
      if (vw > 768) {
        footer.style.position = 'fixed';
        // This margin-bottom creates the "hole" for the reveal effect
        mainContent.style.marginBottom = `${footer.offsetHeight}px`;
      } else {
        footer.style.position = 'relative';
        mainContent.style.marginBottom = '0';
      }
    }

    document.querySelectorAll('section[id]').forEach((sec, index) => {
      if (vw > 1024) {
        const h = sec.offsetHeight;
        sec.style.top = h > vh - 100 ? `calc(100vh - ${h}px - 2rem)` : `${5 + (index * 1.5)}rem`;
      } else {
        sec.style.top = '0';
      }
    });
  };

  window.addEventListener('resize', adjustLayout);
  const resizeObs = new ResizeObserver(adjustLayout);
  if (mainContent) resizeObs.observe(mainContent);
  if (footer) resizeObs.observe(footer);

  // Go to top
  document.addEventListener('click', e => {
    if (e.target.closest('.go-top-trigger')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Simple Scroll Reveal
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.sr').forEach(el => revObs.observe(el));

  setTimeout(adjustLayout, 500);
}

document.addEventListener("DOMContentLoaded", loadComponents);