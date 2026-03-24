import './find.css';
import { serviceData } from '../data/services.js';
import { navigate } from '../router.js';

export function renderFind(container) {
  document.title = 'Handly — Find a Professional';

  const keys = Object.keys(serviceData);

  container.innerHTML = `
    <div class="find-hero">
      <div class="find-hero-inner">
        <span class="find-label">Browse Services</span>
        <h1>Find the right pro<br>for the job</h1>
        <p class="find-subtitle">Choose a service category to browse verified professionals in your area.</p>
        <div class="find-search-wrap">
          <span class="find-search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          <input type="text" id="findSearch" placeholder="Search plumbers, electricians, cleaners…" autocomplete="off">
          <button class="find-clear" id="findClear" aria-label="Clear search">&#x2715;</button>
        </div>
      </div>
    </div>

    <div class="find-body">
      <div class="find-results-info" id="findResultsInfo">Showing all ${keys.length} services</div>
      <div class="find-grid" id="findGrid">
        ${keys.map(key => renderCard(key, serviceData[key])).join('')}
      </div>
      <div class="find-empty" id="findEmpty" style="display:none">
        <div class="find-empty-icon">&#128269;</div>
        <h3>No services found</h3>
        <p>Try a different search term — e.g. "plumb", "electric", "clean".</p>
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
        <h3>${s.title}</h3>
        <p>${s.shortDesc}</p>
      </div>
      <div class="find-card-foot">
        <span class="find-card-count">&#128100; ${s.count} pros</span>
        <span class="find-card-cta">Browse <span aria-hidden="true">&#8594;</span></span>
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
      const text = `${s.title} ${s.breadcrumb} ${s.shortDesc} ${s.desc}`.toLowerCase();
      const show = !q || text.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    resultsInfo.textContent = q
      ? `${visible} service${visible !== 1 ? 's' : ''} matching "${searchInput.value.trim()}"`
      : `Showing all ${keys.length} services`;

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
