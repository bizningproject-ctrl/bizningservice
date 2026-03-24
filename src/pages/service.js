import './service.css';
import { serviceData } from '../data/services.js';

export function renderService(container) {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'plumbing';
  const service = serviceData[type] || serviceData.plumbing;

  document.title = `Handly — ${service.title}`;

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
  `;

  initServiceInteractions(container, service);
}

function renderPros(listEl, pros, service) {
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

  pros.forEach((pro, i) => {
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
  const sortSelect = container.querySelector('#sortSelect');
  let activeFilter = 'all';

  const update = () => {
    const filtered = getSorted(getFiltered(service.pros, activeFilter), sortSelect.value);
    renderPros(listEl, filtered, service);
  };

  update();

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      update();
    });
  });

  sortSelect.addEventListener('change', update);
}
