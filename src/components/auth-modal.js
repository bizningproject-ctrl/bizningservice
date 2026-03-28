import './auth-modal.css';
import { t } from '../i18n.js';
import { api } from '../api.js';

let onAuthChange = null;

export function setAuthChangeCallback(cb) {
  onAuthChange = cb;
}

export function openAuthModal(mode = 'login') {
  closeAuthModal();

  const overlay = document.createElement('div');
  overlay.className = 'auth-overlay';
  overlay.id = 'authOverlay';

  overlay.innerHTML = buildModalHTML(mode);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeAuthModal();
  });

  overlay.querySelector('.auth-close').addEventListener('click', closeAuthModal);

  initForm(overlay, mode);
}

export function closeAuthModal() {
  document.getElementById('authOverlay')?.remove();
}

function buildModalHTML(mode) {
  const isLogin = mode === 'login';

  return `
    <div class="auth-modal">
      <button class="auth-close">&times;</button>
      <div class="auth-header">
        <h2>${isLogin ? t('auth_login_title') : t('auth_register_title')}</h2>
        <p>${isLogin ? t('auth_login_sub') : t('auth_register_sub')}</p>
      </div>
      <form class="auth-form" id="authForm">
        ${!isLogin ? `
        <div class="form-group">
          <label>${t('auth_full_name')}</label>
          <input type="text" id="authName" placeholder="John Smith" required>
        </div>
        ` : ''}
        <div class="form-group">
          <label>${t('auth_email')}</label>
          <input type="email" id="authEmail" placeholder="john@example.com" required>
        </div>
        <div class="form-group">
          <label>${t('auth_password')}</label>
          <input type="password" id="authPassword" placeholder="••••••••" required minlength="6">
        </div>
        ${!isLogin ? `
        <div class="form-group">
          <label>${t('auth_phone')}</label>
          <input type="tel" id="authPhone" placeholder="+998 90 123 4567">
        </div>
        ` : ''}
        <div class="auth-error" id="authError"></div>
        <button type="submit" class="auth-submit" id="authSubmit">
          ${isLogin ? t('auth_login_btn') : t('auth_register_btn')}
        </button>
      </form>
      <div class="auth-switch">
        ${isLogin ? t('auth_no_account') : t('auth_have_account')}
        <a href="#" id="authSwitchLink">${isLogin ? t('auth_register') : t('auth_login')}</a>
      </div>
    </div>
  `;
}

function initForm(overlay, mode) {
  const form = overlay.querySelector('#authForm');
  const errorEl = overlay.querySelector('#authError');
  const submitBtn = overlay.querySelector('#authSubmit');
  const switchLink = overlay.querySelector('#authSwitchLink');

  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    const newMode = mode === 'login' ? 'register' : 'login';
    openAuthModal(newMode);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const email = overlay.querySelector('#authEmail').value;
    const password = overlay.querySelector('#authPassword').value;

    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    try {
      if (mode === 'login') {
        await api.login(email, password);
      } else {
        const full_name = overlay.querySelector('#authName').value;
        const phone = overlay.querySelector('#authPhone')?.value || '';
        await api.register(email, password, full_name, phone);
      }
      closeAuthModal();
      if (onAuthChange) onAuthChange();
    } catch (err) {
      errorEl.textContent = err.error || 'Something went wrong. Please try again.';
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = mode === 'login' ? t('auth_login_btn') : t('auth_register_btn');
    }
  });
}
