import './find.css';
import { serviceData } from '../data/services.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

const svcTitleKeys = {
  plumbing: 'svc_plumbers', electrical: 'svc_electricians', cleaning: 'svc_cleaners',
  painting: 'svc_painters', hvac: 'svc_hvac_techs', handyman: 'svc_handymen',
};
const svcShortKeys = {
  plumbing: 'svc_plumbing_short', electrical: 'svc_electrical_short', cleaning: 'svc_cleaning_short',
  painting: 'svc_painting_short', hvac: 'svc_hvac_short', handyman: 'svc_handyman_short',
};

export function renderFind(container) {
  document.title = `Fixit — ${t('nav_find')}`;

  const keys = Object.keys(serviceData);

  container.innerHTML = `
    <div class="find-hero">
      <div class="find-hero-inner">
        <span class="find-label">${t('find_label')}</span>
        <h1>${t('find_title')}</h1>
        <p class="find-subtitle">${t('find_subtitle')}</p>
        <div class="find-search-wrap">
          <span class="find-search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          <input type="text" id="findSearch" placeholder="${t('find_search_placeholder')}" autocomplete="off">
          <button class="find-clear" id="findClear" aria-label="Clear search">&#x2715;</button>
        </div>
      </div>
    </div>

    <div class="find-body">
      <div class="find-results-info" id="findResultsInfo">${t('find_showing_all')} ${keys.length} ${t('find_services')}</div>
      <div class="find-grid" id="findGrid">
        ${keys.map(key => renderCard(key, serviceData[key])).join('')}
      </div>
      <div class="find-empty" id="findEmpty" style="display:none">
        <div class="find-empty-icon">&#128269;</div>
        <h3>${t('find_no_found')}</h3>
        <p>${t('find_try_different')}</p>
      </div>
    </div>
  `;

  initFindInteractions(container);
}

function renderCard(key, s) {
  return `
    <button class="find-card" data-service="${key}">
      <div class="find-card-icon" style="background: ${s.gradient}">${s.icon}</div>
      <div class="find-card-body">
        <h3>${t(svcTitleKeys[key])}</h3>
        <p>${t(svcShortKeys[key])}</p>
      </div>
      <div class="find-card-foot">
        <span class="find-card-count">&#128100; ${s.count} ${t('find_pros')}</span>
        <span class="find-card-cta">${t('find_browse')} <span aria-hidden="true">&#8594;</span></span>
      </div>
    </button>
  `;
}

function initFindInteractions(container) {
  const grid = container.querySelector('#findGrid');
  const searchInput = container.querySelector('#findSearch');
  const clearBtn = container.querySelector('#findClear');
  const resultsInfo = container.querySelector('#findResultsInfo');
  const emptyState = container.querySelector('#findEmpty');
  const keys = Object.keys(serviceData);

  const filter = () => {
    const q = searchInput.value.trim().toLowerCase();
    clearBtn.style.display = q ? 'flex' : 'none';

    let visible = 0;
    grid.querySelectorAll('.find-card').forEach(card => {
      const key = card.dataset.service;
      const s = serviceData[key];
      const text = `${s.title} ${s.breadcrumb} ${s.shortDesc} ${s.desc} ${t(svcTitleKeys[key])} ${t(svcShortKeys[key])}`.toLowerCase();
      const show = !q || text.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    resultsInfo.textContent = q
      ? `${visible} ${t('find_service')} ${t('find_matching')} "${searchInput.value.trim()}"`
      : `${t('find_showing_all')} ${keys.length} ${t('find_services')}`;

    emptyState.style.display = visible === 0 ? 'flex' : 'none';
    grid.style.display = visible === 0 ? 'none' : '';
  };

  searchInput.addEventListener('input', filter);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    filter();
  });

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.find-card');
    if (card) navigate(`/service?type=${card.dataset.service}`);
  });
}
