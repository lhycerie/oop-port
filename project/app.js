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
  initTypewriter(); // Add the typewriter initiation here
  initGoToTopButton();
}

function fixNavPaths() {
  const isRoot = !window.location.pathname.includes('/pages/');
  if (isRoot) {
    document.querySelectorAll('#navbar a[href^="../"]').forEach(link => {
      link.href = link.getAttribute('href').replace('../', '');
    });
  }
}

function initGoToTopButton() {
  const isRoot = !window.location.pathname.includes('/pages/');
  if (isRoot) return;

  const btn = document.createElement('button');
  btn.className = 'go-top-trigger go-top-float';
  btn.innerHTML = '↑';
  btn.title = 'Go to top';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
}

function initHamburger() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu = document.querySelector('nav ul');

  if(hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open'); 
      navMenu.classList.toggle('open');    
    });
  }
}

function initTypewriter() {
  const el = document.querySelector('.hero-name.typing');
  if (!el) return;

  const words = ["China De Oro", "チナ・デ・オロ"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  // Clear initially so JS takes over perfectly
  el.textContent = "";

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    el.textContent = currentWord.substring(0, charIndex);

    let typeSpeed = 120; // Typing speed

    if (isDeleting) {
      typeSpeed /= 2; // Delete faster
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2500; // Pause at the end of the word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 600; // Pause before starting the next word
    }

    setTimeout(type, typeSpeed);
  }

  // Start the typing effect after a small delay
  setTimeout(type, 800);
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
        mainContent.style.marginBottom = `${footer.offsetHeight}px`;
      } else {
        footer.style.position = 'relative';
        mainContent.style.marginBottom = '0';
      }
    }

    // Notice the :not(#home) added here!
    document.querySelectorAll('section[id]:not(#home)').forEach((sec, index) => {
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

  document.addEventListener('click', e => {
    if (e.target.closest('.go-top-trigger')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.sr').forEach(el => revObs.observe(el));

  setTimeout(adjustLayout, 500);
}

document.addEventListener("DOMContentLoaded", loadComponents);