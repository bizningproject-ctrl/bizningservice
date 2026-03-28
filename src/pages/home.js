import './home.css';
import { serviceData, featuredPros, testimonials } from '../data/services.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

const svcBreadcrumbKeys = {
  plumbing: 'svc_plumbing', electrical: 'svc_electrical', cleaning: 'svc_cleaning',
  painting: 'svc_painting', hvac: 'svc_hvac', handyman: 'svc_handyman',
};

const svcTagIcons = {
  plumbing: `<svg class="hero-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  electrical: `<svg class="hero-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  cleaning: `<svg class="hero-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.09 3.36L16.36 6l-3.27 1.09L12 10.36 10.91 7.09 7.64 6l3.27-1.09z"/><path d="M18 10l.6 1.84L20.44 12.44l-1.84.6L18 14.88l-.6-1.84-1.84-.6 1.84-.6z"/><path d="M6 14l.6 1.84 1.84.6-1.84.6L6 18.88l-.6-1.84-1.84-.6 1.84-.6z"/></svg>`,
  painting: `<svg class="hero-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><path d="M12 10v4"/><rect x="9" y="14" width="6" height="7" rx="1"/></svg>`,
  hvac: `<svg class="hero-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="8"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/><line x1="12" y1="22" x2="12" y2="16"/><line x1="19.07" y1="19.07" x2="14.83" y2="14.83"/><line x1="22" y1="12" x2="16" y2="12"/><line x1="19.07" y1="4.93" x2="14.83" y2="9.17"/></svg>`,
  handyman: `<svg class="hero-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>`,
};
const svcShortKeys = {
  plumbing: 'svc_plumbing_short', electrical: 'svc_electrical_short', cleaning: 'svc_cleaning_short',
  painting: 'svc_painting_short', hvac: 'svc_hvac_short', handyman: 'svc_handyman_short',
};
const testimonialKeys = [
  { quote: 'testimonial1', ctx: 'testimonial1_ctx' },
  { quote: 'testimonial2', ctx: 'testimonial2_ctx' },
  { quote: 'testimonial3', ctx: 'testimonial3_ctx' },
];

export function renderHome(container) {
  container.innerHTML = `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg-shape"></div>
      <div class="hero-bg-shape"></div>
      <div class="hero-bg-shape"></div>

      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            ${t('hero_badge')}
          </div>
          <h1>${t('hero_title_1')}<br>${t('hero_title_2')} <span class="text-blue">${t('hero_title_3')}</span> ${t('hero_title_4')}</h1>
          <p class="hero-subtitle">${t('hero_subtitle')}</p>

          <div class="search-box">
            <span class="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input type="text" placeholder="${t('hero_search_placeholder')}" id="searchInput">
            <button id="searchBtn">${t('hero_search_btn')}</button>
          </div>

          <div class="hero-tags">
            ${Object.entries(serviceData).map(([key]) => `
              <a href="#" class="hero-tag" data-service="${key}">
                ${svcTagIcons[key] || ''}
                <span>${t(svcBreadcrumbKeys[key])}</span>
              </a>
            `).join('')}
          </div>

        </div>

        <div class="hero-visual">
          <div class="hero-tools-grid">
            <div class="hero-tool" data-tool="wrench">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div class="hero-tool" data-tool="bolt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div class="hero-tool" data-tool="sparkle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.09 3.36L16.36 6l-3.27 1.09L12 10.36 10.91 7.09 7.64 6l3.27-1.09z"/><path d="M18 10l.6 1.84L20.44 12.44l-1.84.6L18 14.88l-.6-1.84-1.84-.6 1.84-.6z"/><path d="M6 14l.6 1.84 1.84.6-1.84.6L6 18.88l-.6-1.84-1.84-.6 1.84-.6z"/></svg>
            </div>
            <div class="hero-tool" data-tool="roller">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><path d="M12 10v4"/><rect x="9" y="14" width="6" height="7" rx="1"/></svg>
            </div>
            <div class="hero-tool" data-tool="snowflake">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="8"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/><line x1="12" y1="22" x2="12" y2="16"/><line x1="19.07" y1="19.07" x2="14.83" y2="14.83"/><line x1="22" y1="12" x2="16" y2="12"/><line x1="19.07" y1="4.93" x2="14.83" y2="9.17"/></svg>
            </div>
            <div class="hero-tool" data-tool="hammer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>
            </div>
            <div class="hero-tool" data-tool="drill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M14 14l7-7"/><path d="M16 16l2-2"/><circle cx="18" cy="18" r="3"/></svg>
            </div>
            <div class="hero-tool" data-tool="plunger">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="14"/><path d="M5 14h14a0 0 0 0 1 0 0c0 3.87-3.13 7-7 7s-7-3.13-7-7a0 0 0 0 1 0 0z"/></svg>
            </div>
            <div class="hero-tool" data-tool="ruler">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="services" id="services">
      <div class="section-header reveal">
        <span class="section-label">${t('services_label')}</span>
        <h2 class="section-title">${t('services_title')}</h2>
        <p class="section-subtitle">${t('services_subtitle')}</p>
      </div>
      <div class="services-grid">
        ${Object.entries(serviceData).map(([key, s]) => {
          const isSoon = key === 'painting';
          return `
          <div class="service-card reveal${isSoon ? ' service-card--soon' : ''}" data-service="${isSoon ? '' : key}">
            ${isSoon ? `<span class="soon-badge">${t('services_soon')}</span>` : ''}
            <div class="service-icon">${s.icon}</div>
            <h3>${t(svcBreadcrumbKeys[key])}</h3>
            <p>${t(svcShortKeys[key])}</p>
            <span class="service-count">&#128100; ${s.count} ${t('services_pros_available')}</span>
          </div>
        `;
        }).join('')}
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-it-works" id="how">
      <div class="how-inner">
        <div class="section-header reveal">
          <span class="section-label">${t('how_label')}</span>
          <h2 class="section-title">${t('how_title')}</h2>
          <p class="section-subtitle">${t('how_subtitle')}</p>
        </div>
        <div class="steps-grid">
          <div class="step-card reveal">
            <div class="step-number">01</div>
            <h3>${t('how_step1_title')}</h3>
            <p>${t('how_step1_desc')}</p>
          </div>
          <div class="step-card reveal">
            <div class="step-number">02</div>
            <h3>${t('how_step2_title')}</h3>
            <p>${t('how_step2_desc')}</p>
          </div>
          <div class="step-card reveal">
            <div class="step-number">03</div>
            <h3>${t('how_step3_title')}</h3>
            <p>${t('how_step3_desc')}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED PROS -->
    <section class="featured" id="pros">
      <div class="section-header reveal">
        <span class="section-label">${t('featured_label')}</span>
        <h2 class="section-title">${t('featured_title')}</h2>
        <p class="section-subtitle">${t('featured_subtitle')}</p>
      </div>
      <div class="pros-grid">
        ${featuredPros.map(pro => `
          <div class="featured-pro reveal">
            <div class="featured-pro-img" style="background: ${pro.gradient}">
              ${pro.icon}
              <span class="featured-pro-verified">${t('featured_verified')}</span>
            </div>
            <div class="featured-pro-body">
              <h4>${pro.name}</h4>
              <div class="pro-specialty">${pro.specialty}</div>
              <div class="featured-pro-stats">
                <span class="stat"><span class="stat-rating">&#9733; ${pro.rating}</span></span>
                <span class="stat"><strong>${pro.jobs.toLocaleString()}</strong> ${t('featured_jobs')}</span>
                <span class="stat"><strong>$${pro.price}</strong>${t('featured_hr')}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials" id="reviews">
      <div class="testimonials-inner">
        <div class="section-header reveal">
          <span class="section-label">${t('testimonials_label')}</span>
          <h2 class="section-title">${t('testimonials_title')}</h2>
        </div>
        <div class="testimonials-grid">
          ${testimonials.map((tm, i) => `
            <div class="testimonial-card reveal">
              <div class="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <blockquote>${t(testimonialKeys[i].quote)}</blockquote>
              <div class="testimonial-author">
                <div class="testimonial-avatar">${tm.avatar}</div>
                <div class="testimonial-author-info">
                  <h5>${tm.name}</h5>
                  <span>${t(testimonialKeys[i].ctx)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-box reveal">
        <h2>${t('cta_title')}</h2>
        <p>${t('cta_subtitle')}</p>
        <div class="cta-buttons">
          <button class="btn-primary" id="ctaSearch">${t('cta_find')}</button>
          <a href="/become-pro" class="btn-secondary" id="ctaBecomePro">${t('cta_join')}</a>
        </div>
      </div>
    </section>
  `;

  initHomeInteractions(container);
  initScrollReveal();
}

function initHomeInteractions(container) {
  document.querySelector('.nav-find')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/find');
  });

  document.querySelector('.nav-cta')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/become-pro');
  });

  container.querySelector('#ctaBecomePro')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/become-pro');
  });

  container.querySelectorAll('.hero-tag, .service-card').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const type = el.dataset.service;
      if (type) navigate(`/service?type=${type}`);
    });
  });

  const searchInput = container.querySelector('#searchInput');
  const searchBtn = container.querySelector('#searchBtn');

  const doSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    container.querySelectorAll('.service-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.outline = '2px solid var(--blue)';
        card.style.outlineOffset = '2px';
        setTimeout(() => { card.style.outline = ''; card.style.outlineOffset = ''; }, 3000);
      }
    });
  };

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });

  container.querySelector('#ctaSearch')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => searchInput?.focus(), 800);
  });
}

export function initScrollReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.services-grid, .steps-grid, .pros-grid, .testimonials-grid').forEach(grid => {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal').forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 120);
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    gridObserver.observe(grid);
  });
}
