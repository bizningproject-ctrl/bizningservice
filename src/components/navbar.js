import './navbar.css';

export function createNavbar({ variant = 'home' } = {}) {
  const nav = document.createElement('nav');
  nav.id = 'navbar';

  if (variant === 'home') {
    nav.innerHTML = `
      <a href="/" class="nav-logo">
        <span class="logo-dot"></span>
        handly
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="#services">Services</a></li>
        <li><a href="#how">How It Works</a></li>
        <li><a href="#pros">Professionals</a></li>
        <li><a href="#reviews">Reviews</a></li>
        <li><a href="#" class="nav-cta">Become a Pro</a></li>
      </ul>
      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    `;
  } else {
    nav.classList.add('nav-service');
    nav.innerHTML = `
      <a href="/" class="nav-logo">
        <span class="logo-dot"></span>
        handly
      </a>
      <a href="/" class="nav-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Home
      </a>
    `;
  }

  return nav;
}

export function initNavbarBehavior() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile menu
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}
