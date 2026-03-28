import './footer.css';
import { t } from '../i18n.js';

export function createFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="nav-logo">
          <span class="logo-dot"></span>
          fixit
        </a>
        <p>${t('footer_desc')}</p>
      </div>
      <div class="footer-col">
        <h5>${t('footer_services')}</h5>
        <ul>
          <li><a href="/service?type=plumbing">${t('svc_plumbing')}</a></li>
          <li><a href="/service?type=electrical">${t('svc_electrical')}</a></li>
          <li><a href="/service?type=cleaning">${t('svc_cleaning')}</a></li>
          <li><a href="/service?type=painting">${t('svc_painting')}</a></li>
          <li><a href="/service?type=hvac">${t('svc_hvac')}</a></li>
          <li><a href="/service?type=handyman">${t('svc_handyman')}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>${t('footer_company')}</h5>
        <ul>
          <li><a href="#">${t('footer_about')}</a></li>
          <li><a href="#">${t('footer_how')}</a></li>
          <li><a href="#">${t('footer_careers')}</a></li>
          <li><a href="#">${t('footer_press')}</a></li>
          <li><a href="#">${t('footer_blog')}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>${t('footer_support')}</h5>
        <ul>
          <li><a href="#">${t('footer_help')}</a></li>
          <li><a href="#">${t('footer_safety')}</a></li>
          <li><a href="#">${t('footer_terms')}</a></li>
          <li><a href="#">${t('footer_privacy')}</a></li>
          <li><a href="#">${t('footer_contact')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>${t('footer_rights')}</p>
      <div class="footer-social">
        <a href="#" aria-label="Twitter">&#120143;</a>
        <a href="#" aria-label="Instagram">&#9635;</a>
        <a href="#" aria-label="LinkedIn">in</a>
      </div>
    </div>
  `;
  return footer;
}
