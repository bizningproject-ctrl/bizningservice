import './service.css';
import { serviceData } from '../data/services.js';

const PAGE_SIZE = 4;

export function renderService(container) {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'plumbing';
  const service = serviceData[type] || serviceData.plumbing;

  document.title = `handly. — ${service.title}`;

  container.innerHTML = `
    <div class="page-header">
      <div class="breadcrumb"><a href="/">Home</a> / <span>${service.breadcrumb}</span></div>
      <h1>${service.title} <span class="count">(${service.pros.length} available)</span></h1>
      <p class="page-desc">${service.desc}</p>
    </div>

    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="top-rated">Top Rated</button>
      <button class="filter-btn" data-filter="verified">Verified Only</button>
      <button class="filter-btn" data-filter="available-now">Available Now</button>
      <select class="filter-sort" id="sortSelect">
        <option value="rating">Sort by: Rating</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="jobs">Most Jobs</option>
      </select>
    </div>

    <div class="pro-list" id="proList"></div>
    <div class="pagination" id="pagination"></div>
  `;

  initServiceInteractions(container, service);
}

function renderPros(listEl, pros, service, page) {
  listEl.innerHTML = '';

  if (pros.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <h3>No professionals found</h3>
        <p>Try adjusting your filters to see more results.</p>
      </div>
    `;
    return;
  }

  const start = (page - 1) * PAGE_SIZE;
  const pagePros = pros.slice(start, start + PAGE_SIZE);

  pagePros.forEach((pro, i) => {
    const card = document.createElement('div');
    card.className = 'pro-item';
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="pro-avatar" style="background: ${service.gradient}">
        ${service.icon}
        ${pro.online ? '<span class="online-dot"></span>' : ''}
      </div>
      <div class="pro-body">
        <h3>${pro.name}${pro.verified ? '<span class="verified-badge">&#10003; Verified</span>' : ''}</h3>
        <div class="pro-specialty">${pro.specialty} &bull; ${pro.exp}</div>
        <div class="pro-tags">
          ${pro.tags.map(t => `<span class="pro-tag">${t}</span>`).join('')}
        </div>
        <div class="pro-stats">
          <span class="stat"><span class="rating">&#9733; ${pro.rating}</span></span>
          <span class="stat"><strong>${pro.jobs.toLocaleString()}</strong> jobs</span>
        </div>
      </div>
      <div class="pro-right">
        <span class="price">$${pro.price}</span>
        <span class="price-unit">/hour</span>
        <button class="btn-book">Book Now</button>
      </div>
    `;
    listEl.appendChild(card);
  });
}

function renderPagination(paginationEl, pros, currentPage, onPageChange) {
  const totalPages = Math.ceil(pros.length / PAGE_SIZE);

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  const buttons = [];

  buttons.push(`<button class="page-btn page-nav" data-page="1" ${currentPage === 1 ? 'disabled' : ''} aria-label="First page">&laquo;</button>`);
  buttons.push(`<button class="page-btn page-nav" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">&lsaquo;</button>`);

  for (let p = 1; p <= totalPages; p++) {
    buttons.push(`<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`);
  }

  buttons.push(`<button class="page-btn page-nav" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">&rsaquo;</button>`);
  buttons.push(`<button class="page-btn page-nav" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Last page">&raquo;</button>`);

  paginationEl.innerHTML = buttons.join('');

  paginationEl.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page, 10);
      if (page !== currentPage) onPageChange(page);
    });
  });
}

function getFiltered(pros, filter) {
  if (filter === 'top-rated') return pros.filter(p => p.rating >= 4.8);
  if (filter === 'verified') return pros.filter(p => p.verified);
  if (filter === 'available-now') return pros.filter(p => p.online);
  return [...pros];
}

function getSorted(pros, sort) {
  const list = [...pros];
  if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  else if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
  else if (sort === 'jobs') list.sort((a, b) => b.jobs - a.jobs);
  return list;
}

function initServiceInteractions(container, service) {
  const listEl = container.querySelector('#proList');
  const paginationEl = container.querySelector('#pagination');
  const sortSelect = container.querySelector('#sortSelect');
  let activeFilter = 'all';
  let currentPage = 1;

  const update = () => {
    const filtered = getSorted(getFiltered(service.pros, activeFilter), sortSelect.value);
    renderPros(listEl, filtered, service, currentPage);
    renderPagination(paginationEl, filtered, currentPage, (page) => {
      currentPage = page;
      update();
      listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  update();

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
