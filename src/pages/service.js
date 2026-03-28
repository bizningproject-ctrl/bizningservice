import './service.css';
import { serviceData } from '../data/services.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';
import { api } from '../api.js';

const svcBreadcrumbKeys = {
  plumbing: 'svc_plumbing', electrical: 'svc_electrical', cleaning: 'svc_cleaning',
  painting: 'svc_painting', hvac: 'svc_hvac', handyman: 'svc_handyman',
};
const svcTitleKeys = {
  plumbing: 'svc_plumbers', electrical: 'svc_electricians', cleaning: 'svc_cleaners',
  painting: 'svc_painters', hvac: 'svc_hvac_techs', handyman: 'svc_handymen',
};
const svcDescKeys = {
  plumbing: 'svc_plumbing_desc', electrical: 'svc_electrical_desc', cleaning: 'svc_cleaning_desc',
  painting: 'svc_painting_desc', hvac: 'svc_hvac_desc', handyman: 'svc_handyman_desc',
};

const PAGE_SIZE = 4;

export function renderService(container) {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'plumbing';
  const service = serviceData[type] || serviceData.plumbing;

  document.title = `Fixit — ${t(svcTitleKeys[type])}`;

  container.innerHTML = `
    <div class="page-header">
      <div class="breadcrumb"><a href="/">${t('service_home')}</a> / <span>${t(svcBreadcrumbKeys[type])}</span></div>
      <h1>${t(svcTitleKeys[type])} <span class="count" id="proCount"></span></h1>
      <p class="page-desc">${t(svcDescKeys[type])}</p>
    </div>

    <div class="filters">
      <button class="filter-btn active" data-filter="all">${t('service_all')}</button>
      <button class="filter-btn" data-filter="top-rated">${t('service_top_rated')}</button>
      <button class="filter-btn" data-filter="verified">${t('service_verified_only')}</button>
      <button class="filter-btn" data-filter="available-now">${t('service_available_now')}</button>
      <select class="filter-sort" id="sortSelect">
        <option value="rating">${t('service_sort_rating')}</option>
        <option value="price-low">${t('service_sort_price_low')}</option>
        <option value="price-high">${t('service_sort_price_high')}</option>
        <option value="jobs">${t('service_sort_jobs')}</option>
      </select>
    </div>

    <div class="pro-list" id="proList"></div>
    <div class="pagination" id="pagination"></div>
  `;

  initServiceInteractions(container, service, type);
}

function renderPros(listEl, pros, service) {
  listEl.innerHTML = '';

  if (pros.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <h3>${t('service_no_pros')}</h3>
        <p>${t('service_adjust_filters')}</p>
      </div>
    `;
    return;
  }

  pros.forEach((pro, i) => {
    const card = document.createElement('div');
    card.className = 'pro-item';
    card.style.animationDelay = `${i * 0.08}s`;
    // Support both API format and static format
    const name = pro.name || pro.full_name;
    const isOnline = pro.online ?? pro.is_online;
    const isVerified = pro.verified ?? pro.is_verified;
    const jobs = pro.jobs ?? pro.total_jobs;
    const price = pro.price ?? pro.price_per_hour;
    const exp = pro.exp || (pro.experience_years ? `${pro.experience_years}yr exp` : '');
    const tags = Array.isArray(pro.tags) ? pro.tags : [];
    const proId = pro.id || null;

    card.dataset.proName = name;
    card.dataset.proId = proId || '';
    card.innerHTML = `
      <div class="pro-avatar" style="background: ${pro.category_gradient || service.gradient}">
        ${pro.category_icon || service.icon}
        ${isOnline ? '<span class="online-dot"></span>' : ''}
      </div>
      <div class="pro-body">
        <h3>${name}${isVerified ? `<span class="verified-badge">${t('service_verified')}</span>` : ''}</h3>
        <div class="pro-specialty">${pro.specialty} &bull; ${exp}</div>
        <div class="pro-tags">
          ${tags.map(tag => `<span class="pro-tag">${tag}</span>`).join('')}
        </div>
        <div class="pro-stats">
          <span class="stat"><span class="rating">&#9733; ${pro.rating}</span></span>
          <span class="stat"><strong>${(jobs || 0).toLocaleString()}</strong> ${t('service_jobs')}</span>
        </div>
      </div>
      <div class="pro-right">
        <span class="price">$${price}</span>
        <span class="price-unit">${t('service_hour')}</span>
        <button class="btn-book">${t('service_book_now')}</button>
      </div>
    `;
    listEl.appendChild(card);
  });
}

function renderPagination(paginationEl, totalPages, currentPage, onPageChange) {
  if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

  const buttons = [];
  buttons.push(`<button class="page-btn page-nav" data-page="1" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`);
  buttons.push(`<button class="page-btn page-nav" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>&lsaquo;</button>`);
  for (let p = 1; p <= totalPages; p++) {
    buttons.push(`<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`);
  }
  buttons.push(`<button class="page-btn page-nav" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>&rsaquo;</button>`);
  buttons.push(`<button class="page-btn page-nav" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`);

  paginationEl.innerHTML = buttons.join('');
  paginationEl.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page, 10);
      if (page !== currentPage) onPageChange(page);
    });
  });
}

async function initServiceInteractions(container, service, type) {
  const listEl = container.querySelector('#proList');
  const paginationEl = container.querySelector('#pagination');
  const sortSelect = container.querySelector('#sortSelect');
  const countEl = container.querySelector('#proCount');
  let activeFilter = 'all';
  let currentPage = 1;
  let useApi = true;

  // Test API availability
  try {
    await api.getPros({ category: type, limit: 1 });
  } catch {
    useApi = false;
  }

  const update = async () => {
    if (useApi) {
      try {
        const filterParam = activeFilter === 'all' ? undefined : activeFilter;
        const data = await api.getPros({
          category: type,
          sort: sortSelect.value,
          filter: filterParam,
          page: currentPage,
          limit: PAGE_SIZE
        });
        countEl.textContent = `(${data.total} ${t('service_available')})`;
        renderPros(listEl, data.pros, service);
        renderPagination(paginationEl, data.totalPages, currentPage, (page) => {
          currentPage = page;
          update();
          listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      } catch {
        useApi = false;
        update();
        return;
      }
    } else {
      // Fallback to static data
      let pros = [...service.pros];
      if (activeFilter === 'top-rated') pros = pros.filter(p => p.rating >= 4.8);
      else if (activeFilter === 'verified') pros = pros.filter(p => p.verified);
      else if (activeFilter === 'available-now') pros = pros.filter(p => p.online);

      const sort = sortSelect.value;
      if (sort === 'rating') pros.sort((a, b) => b.rating - a.rating);
      else if (sort === 'price-low') pros.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') pros.sort((a, b) => b.price - a.price);
      else if (sort === 'jobs') pros.sort((a, b) => b.jobs - a.jobs);

      countEl.textContent = `(${pros.length} ${t('service_available')})`;
      const totalPages = Math.ceil(pros.length / PAGE_SIZE);
      const start = (currentPage - 1) * PAGE_SIZE;
      renderPros(listEl, pros.slice(start, start + PAGE_SIZE), service);
      renderPagination(paginationEl, totalPages, currentPage, (page) => {
        currentPage = page;
        update();
        listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Click handlers
    listEl.querySelectorAll('.pro-item').forEach(card => {
      card.addEventListener('click', () => {
        const proId = card.dataset.proId;
        if (useApi && proId) {
          navigate(`/pro?type=${type}&id=${proId}`);
        } else {
          navigate(`/pro?type=${type}&name=${encodeURIComponent(card.dataset.proName)}`);
        }
      });
    });
  };

  await update();

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      currentPage = 1;
      update();
    });
  });

  sortSelect.addEventListener('change', () => {
    currentPage = 1;
    update();
  });
}
