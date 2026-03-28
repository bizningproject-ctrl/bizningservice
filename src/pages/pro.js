import './pro.css';
import { serviceData } from '../data/services.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';
import { api } from '../api.js';

const svcBreadcrumbKeys = {
  plumbing: 'svc_plumbing', electrical: 'svc_electrical', cleaning: 'svc_cleaning',
  painting: 'svc_painting', hvac: 'svc_hvac', handyman: 'svc_handyman',
};

export async function renderPro(container) {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'plumbing';
  const proId = params.get('id');
  const proName = params.get('name') || '';

  let pro, gradient, icon, breadcrumb, proDbId;

  // Try API first
  if (proId) {
    try {
      const data = await api.getPro(proId);
      const p = data.pro;
      pro = {
        name: p.name,
        specialty: p.specialty,
        tags: p.tags,
        rating: p.rating,
        jobs: p.total_jobs,
        price: p.price_per_hour,
        exp: `${p.experience_years}yr exp`,
        verified: p.is_verified,
        online: p.is_online,
        bio: p.bio,
      };
      gradient = p.category_gradient;
      icon = p.category_icon;
      proDbId = p.id;
    } catch {
      // fallback
    }
  }

  // Fallback to static data
  if (!pro) {
    const service = serviceData[type] || serviceData.plumbing;
    const staticPro = service.pros.find(p => p.name === proName);
    if (!staticPro) {
      navigate(`/service?type=${type}`);
      return;
    }
    pro = staticPro;
    gradient = service.gradient;
    icon = service.icon;
  }

  breadcrumb = t(svcBreadcrumbKeys[type]);
  document.title = `Fixit — ${pro.name}`;

  const name = pro.name;
  const exp = pro.exp || `${pro.experience_years}yr exp`;
  const jobs = pro.jobs ?? pro.total_jobs ?? 0;
  const price = pro.price ?? pro.price_per_hour;
  const isVerified = pro.verified ?? pro.is_verified;
  const isOnline = pro.online ?? pro.is_online;
  const tags = Array.isArray(pro.tags) ? pro.tags : [];

  container.innerHTML = `
    <div class="pro-profile">
      <div class="breadcrumb">
        <a href="/">${t('service_home')}</a> / <a href="/service?type=${type}">${breadcrumb}</a> / <span>${name}</span>
      </div>

      <div class="pro-profile-header">
        <div class="pro-profile-avatar" style="background: ${gradient}">
          ${icon}
          ${isOnline ? '<span class="online-dot"></span>' : ''}
        </div>
        <div class="pro-profile-info">
          <h1>
            ${name}
            ${isVerified ? `<span class="pro-profile-verified">${t('service_verified')}</span>` : ''}
          </h1>
          <div class="pro-profile-specialty">${pro.specialty}</div>
          <div class="pro-profile-stats">
            <span class="pro-profile-stat"><span class="rating-star">&#9733; ${pro.rating}</span></span>
            <span class="pro-profile-stat"><strong>${jobs.toLocaleString()}</strong> ${t('pro_completed_jobs')}</span>
            <span class="pro-profile-stat">${exp}</span>
            ${isOnline ? `<span class="pro-profile-stat" style="color: #22c55e; font-weight: 600;">&#9679; ${t('pro_online_now')}</span>` : ''}
          </div>
        </div>
      </div>

      <div class="pro-profile-tags">
        ${tags.map(tag => `<span class="pro-profile-tag">${tag}</span>`).join('')}
      </div>

      <div class="pro-section">
        <h2>${t('pro_details')}</h2>
        <div class="pro-details-grid">
          <div class="pro-detail-card">
            <div class="pro-detail-icon">&#128176;</div>
            <div class="pro-detail-text">
              <h4>${t('pro_rate')}</h4>
              <p>$${price} ${t('service_hour')}</p>
            </div>
          </div>
          <div class="pro-detail-card">
            <div class="pro-detail-icon">&#128197;</div>
            <div class="pro-detail-text">
              <h4>${t('pro_experience')}</h4>
              <p>${exp}</p>
            </div>
          </div>
          <div class="pro-detail-card">
            <div class="pro-detail-icon">&#9733;</div>
            <div class="pro-detail-text">
              <h4>${t('pro_rating')}</h4>
              <p>${pro.rating} / 5.0</p>
            </div>
          </div>
          <div class="pro-detail-card">
            <div class="pro-detail-icon">&#128188;</div>
            <div class="pro-detail-text">
              <h4>${t('pro_jobs_done')}</h4>
              <p>${jobs.toLocaleString()} ${t('pro_completed')}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pro-section">
        <h2>${t('pro_about')}</h2>
        <p class="pro-about-text">${pro.bio || t('pro_about_text').replace('{name}', name.split(' ')[0]).replace('{specialty}', pro.specialty.split('•')[0].trim()).replace('{exp}', exp).replace('{jobs}', jobs.toLocaleString())}</p>
      </div>

      <div class="pro-section">
        <h2>${t('pro_why_choose')}</h2>
        <div class="pro-highlights">
          ${isVerified ? `
          <div class="pro-highlight">
            <div class="pro-highlight-icon">&#9989;</div>
            <h4>${t('pro_bg_checked')}</h4>
            <p>${t('pro_bg_checked_desc')}</p>
          </div>` : ''}
          <div class="pro-highlight">
            <div class="pro-highlight-icon">&#128170;</div>
            <h4>${t('pro_top_rated')}</h4>
            <p>${t('pro_top_rated_desc').replace('{rating}', pro.rating)}</p>
          </div>
          <div class="pro-highlight">
            <div class="pro-highlight-icon">&#128337;</div>
            <h4>${t('pro_responsive')}</h4>
            <p>${t('pro_responsive_desc')}</p>
          </div>
        </div>
      </div>

      <div class="pro-booking-bar">
        <div class="pro-booking-price">
          <span class="price-amount">$${price}</span>
          <span class="price-unit">${t('service_hour')}</span>
        </div>
        <button class="btn-book-pro" id="bookProBtn">${t('pro_book_now')} ${name.split(' ')[0]} &#10132;</button>
      </div>
    </div>
  `;

  container.querySelector('#bookProBtn')?.addEventListener('click', () => {
    if (proDbId) {
      navigate(`/book?type=${type}&proId=${proDbId}&pro=${encodeURIComponent(name)}`);
    } else {
      navigate(`/book?type=${type}&pro=${encodeURIComponent(name)}`);
    }
  });
}
