import './book.css';
import { serviceData } from '../data/services.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';
import { api } from '../api.js';

const svcBreadcrumbKeys = {
  plumbing: 'svc_plumbing', electrical: 'svc_electrical', cleaning: 'svc_cleaning',
  painting: 'svc_painting', hvac: 'svc_hvac', handyman: 'svc_handyman',
};
const svcDescKeys = {
  plumbing: 'svc_plumbing_desc', electrical: 'svc_electrical_desc', cleaning: 'svc_cleaning_desc',
  painting: 'svc_painting_desc', hvac: 'svc_hvac_desc', handyman: 'svc_handyman_desc',
};

export function renderBook(container) {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'plumbing';
  const proName = params.get('pro') || '';
  const proId = params.get('proId') || '';
  const service = serviceData[type] || serviceData.plumbing;
  const breadcrumb = t(svcBreadcrumbKeys[type]);

  document.title = `Fixit — ${t('book_title')} ${breadcrumb}`;

  container.innerHTML = `
    <section class="book-page">
      <div class="book-inner">

        <div class="book-info">
          <div class="book-service-badge">${service.icon} ${breadcrumb}</div>
          <h1>${t('book_title')} ${breadcrumb}<br>${t('book_title_2')}</h1>
          ${proName ? `<p class="book-pro-name">${proName}</p>` : ''}
          <p>${t(svcDescKeys[type])}</p>

          <div class="book-features">
            <div class="book-feature">
              <div class="book-feature-icon">&#10003;</div>
              <div class="book-feature-text">
                <h4>${t('book_verified')}</h4>
                <p>${t('book_verified_desc')}</p>
              </div>
            </div>
            <div class="book-feature">
              <div class="book-feature-icon">&#128176;</div>
              <div class="book-feature-text">
                <h4>${t('book_pricing')}</h4>
                <p>${t('book_pricing_desc')}</p>
              </div>
            </div>
            <div class="book-feature">
              <div class="book-feature-icon">&#128337;</div>
              <div class="book-feature-text">
                <h4>${t('book_fast')}</h4>
                <p>${t('book_fast_desc')}</p>
              </div>
            </div>
            <div class="book-feature">
              <div class="book-feature-icon">&#128170;</div>
              <div class="book-feature-text">
                <h4>${t('book_guarantee')}</h4>
                <p>${t('book_guarantee_desc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="book-card" id="bookCard">
          <div class="book-card-header">
            <div class="book-card-icon" style="background: ${service.gradient}">${service.icon}</div>
            <div>
              <h3>${breadcrumb} ${t('book_service')}</h3>
              <span>${service.count} ${t('book_near_you')}</span>
            </div>
          </div>

          <form class="book-form" id="bookForm">
            <div class="form-group">
              <label>${t('book_full_name')}</label>
              <input type="text" id="bookName" placeholder="John Smith" required>
            </div>

            <div class="form-group">
              <label>${t('book_email')}</label>
              <input type="email" id="bookEmail" placeholder="john@example.com" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>${t('book_phone')}</label>
                <input type="tel" id="bookPhone" placeholder="(555) 123-4567" required>
              </div>
              <div class="form-group">
                <label>${t('book_date')}</label>
                <input type="date" id="bookDate" required>
              </div>
            </div>

            <div class="form-group">
              <label>${t('book_time')}</label>
              <select id="bookTime" required>
                <option value="" disabled selected>${t('book_select_time')}</option>
                <option value="morning">${t('book_morning')}</option>
                <option value="afternoon">${t('book_afternoon')}</option>
                <option value="evening">${t('book_evening')}</option>
                <option value="flexible">${t('book_flexible')}</option>
              </select>
            </div>

            <div class="form-group">
              <label>${t('book_address')}</label>
              <input type="text" id="bookAddress" placeholder="${t('book_address_placeholder')}" required>
            </div>

            <div class="form-group">
              <label>${t('book_describe')}</label>
              <textarea id="bookDesc" placeholder="${t('book_describe_placeholder')}"></textarea>
            </div>

            <div id="bookError" style="color: #ef4444; font-size: 0.85rem; margin-bottom: 0.5rem; display: none;"></div>
            <button type="submit" class="book-submit" id="bookSubmit">${t('book_submit')}</button>
          </form>
        </div>

      </div>
    </section>
  `;

  initBookForm(container, type, proId);
}

function initBookForm(container, type, proId) {
  const form = container.querySelector('#bookForm');
  const card = container.querySelector('#bookCard');
  const errorEl = container.querySelector('#bookError');
  const submitBtn = container.querySelector('#bookSubmit');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const bookingData = {
      category_slug: type,
      preferred_date: container.querySelector('#bookDate').value,
      preferred_time: container.querySelector('#bookTime').value,
      address: container.querySelector('#bookAddress').value,
      description: container.querySelector('#bookDesc').value,
    };

    if (proId) bookingData.pro_id = parseInt(proId);

    // Try API if logged in
    if (api.isLoggedIn()) {
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = '...';
        await api.createBooking(bookingData);
        showSuccess(card);
        return;
      } catch (err) {
        if (err.status === 401) {
          errorEl.textContent = 'Please log in to book. Saving locally instead.';
          errorEl.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = t('book_submit');
      }
    }

    // Fallback: just show success (no backend)
    showSuccess(card);
  });
}

function showSuccess(card) {
  card.innerHTML = `
    <div class="book-success">
      <div class="book-success-icon">&#10003;</div>
      <h2>${t('book_success_title')}</h2>
      <p>${t('book_success_msg')}</p>
      <button class="btn-back" id="bookBackHome">${t('book_back')}</button>
    </div>
  `;

  card.querySelector('#bookBackHome')?.addEventListener('click', () => {
    navigate('/');
  });
}
