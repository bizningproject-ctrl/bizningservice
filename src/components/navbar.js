import './navbar.css';
import { t, getLang, getAvailableLangs } from '../i18n.js';
import { api } from '../api.js';
import { openAuthModal, setAuthChangeCallback } from './auth-modal.js';

function langSwitcherHTML() {
  const current = getLang();
  const langs = getAvailableLangs();
  return `
    <div class="lang-switcher">
      ${langs.map(l => `
        <button class="lang-btn${l.code === current ? ' lang-active' : ''}" data-lang="${l.code}">${l.label}</button>
      `).join('')}
    </div>
  `;
}

function authHTML() {
  if (api.isLoggedIn()) {
    const user = api.getUser();
    const name = user?.full_name?.split(' ')[0] || '';
    return `
      <div class="nav-auth">
        <span class="nav-user">${t('auth_welcome')}, ${name}</span>
        <button class="nav-logout" id="navLogout">${t('auth_logout')}</button>
      </div>
    `;
  }
  return `
    <div class="nav-auth">
      <button class="nav-login" id="navLogin">${t('auth_login')}</button>
      <button class="nav-register" id="navRegister">${t('auth_register')}</button>
    </div>
  `;
}

function themeToggleHTML() {
  return `
    <button class="theme-toggle" aria-label="Toggle dark mode">
      <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  `;
}

const LOGO_MARK = `
  <svg class="nav-logo-mark" width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="0" y="0" width="4.5" height="32" rx="2.25" fill="#1B2E4A"/>
    <rect x="12" y="0" width="4.5" height="32" rx="2.25" fill="#1B2E4A"/>
    <rect x="0" y="13.75" width="16.5" height="4.5" rx="2.25" fill="#1B2E4A"/>
    <path d="M23 7C23 4.2 25.5 2 29 2C32.5 2 35 4.2 35.5 7C36.2 10.2 33.5 12.2 30.5 14C27.5 15.8 24 17.8 24 21.5C24 25.2 27 29 31 29C35 29 37.5 26.5 38 23.5" stroke="#3B82F6" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <circle cx="29.5" cy="16.5" r="2.4" fill="#0EA5E9"/>
    <circle cx="32.5" cy="17.4" r="2.4" fill="#0EA5E9"/>
  </svg>
`;

export function createNavbar({ variant = 'home' } = {}) {
  const nav = document.createElement('nav');
  nav.id = 'navbar';

  if (variant === 'home') {
    nav.innerHTML = `
      <a href="/" class="nav-logo">
        ${LOGO_MARK}
        <span class="nav-logo-text">fixit</span>
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="#services">${t('nav_services')}</a></li>
        <li><a href="#how">${t('nav_how')}</a></li>
        <li><a href="#pros">${t('nav_pros')}</a></li>
        <li><a href="#reviews">${t('nav_reviews')}</a></li>
        <li><a href="/find" class="nav-find">${t('nav_find')}</a></li>
        <li><a href="/become-pro" class="nav-cta">${t('nav_become')}</a></li>
        <li>${langSwitcherHTML()}</li>
        <li>${themeToggleHTML()}</li>
        <li>${authHTML()}</li>
      </ul>
      <div class="nav-right-mobile">
        ${authHTML()}
        ${themeToggleHTML()}
        ${langSwitcherHTML()}
        <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;
  } else if (variant === 'find') {
    nav.classList.add('nav-service');
    nav.innerHTML = `
      <a href="/" class="nav-back nav-back-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>
        ${t('nav_back_home')}
      </a>
      <div class="nav-service-right">
        <a href="/" class="nav-logo nav-logo-sm">
          ${LOGO_MARK}
          <span class="nav-logo-text">fixit</span>
        </a>
        ${authHTML()}
        ${themeToggleHTML()}
        ${langSwitcherHTML()}
      </div>
    `;
  } else {
    nav.classList.add('nav-service');
    nav.innerHTML = `
      <a href="/find" class="nav-back nav-back-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>
        ${t('nav_all_services')}
      </a>
      <div class="nav-service-right">
        <a href="/" class="nav-logo nav-logo-sm">
          ${LOGO_MARK}
          <span class="nav-logo-text">fixit</span>
        </a>
        ${authHTML()}
        ${themeToggleHTML()}
        ${langSwitcherHTML()}
      </div>
    `;
  }

  return nav;
}

export function initNavbarBehavior() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Theme toggles
  navbar.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      import('../theme.js').then(({ toggleTheme }) => {
        toggleTheme();
      });
    });
  });

  // Language switcher
  navbar.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      import('../router.js').then(({ switchLang }) => {
        switchLang(btn.dataset.lang);
      });
    });
  });

  // Auth buttons
  setAuthChangeCallback(() => {
    // Re-render page after login/register/logout
    import('../router.js').then(({ navigate }) => {
      navigate(window.location.pathname + window.location.search);
    });
  });

  navbar.querySelectorAll('#navLogin').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('login');
    });
  });

  navbar.querySelectorAll('#navRegister').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('register');
    });
  });

  navbar.querySelectorAll('#navLogout').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      api.logout();
      import('../router.js').then(({ navigate }) => {
        navigate(window.location.pathname + window.location.search);
      });
    });
  });

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
