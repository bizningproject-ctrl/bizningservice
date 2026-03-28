import './apply.css';
import { navigate } from '../router.js';
import { serviceData } from '../data/services.js';
import { t } from '../i18n.js';
import { api } from '../api.js';

const svcBreadcrumbKeys = {
  plumbing: 'svc_plumbing', electrical: 'svc_electrical', cleaning: 'svc_cleaning',
  painting: 'svc_painting', hvac: 'svc_hvac', handyman: 'svc_handyman',
};

export function renderApply(container) {
  document.title = `Fixit — ${t('apply_title')}`;

  container.innerHTML = `
    <section class="apply-page">
      <div class="apply-container">
        <div class="apply-header">
          <div class="apply-header-icon">&#128736;</div>
          <h1>${t('apply_title')}</h1>
          <p>${t('apply_sub')}</p>
        </div>

        <div class="apply-card" id="applyCard">
          <form class="apply-form" id="applyForm">
            <div class="form-row">
              <div class="form-group">
                <label>${t('apply_first_name')}</label>
                <input type="text" id="applyFirst" placeholder="John" required>
              </div>
              <div class="form-group">
                <label>${t('apply_last_name')}</label>
                <input type="text" id="applyLast" placeholder="Smith" required>
              </div>
            </div>

            <div class="form-group">
              <label>${t('apply_email')}</label>
              <input type="email" id="applyEmail" placeholder="john@example.com" required>
            </div>

            <div class="form-group">
              <label>${t('apply_phone')}</label>
              <input type="tel" id="applyPhone" placeholder="(555) 123-4567" required>
            </div>

            <div class="form-group">
              <label>${t('apply_category')}</label>
              <select id="applyCat" required>
                <option value="" disabled selected>${t('apply_select_specialty')}</option>
                ${Object.entries(serviceData).map(([key]) => `
                  <option value="${key}">${t(svcBreadcrumbKeys[key])}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>${t('apply_experience')}</label>
              <select id="applyExp" required>
                <option value="" disabled selected>${t('apply_select_exp')}</option>
                <option value="1-2">${t('apply_exp_1')}</option>
                <option value="3-5">${t('apply_exp_2')}</option>
                <option value="5-10">${t('apply_exp_3')}</option>
                <option value="10+">${t('apply_exp_4')}</option>
              </select>
            </div>

            <div class="form-group">
              <label>${t('apply_about')}</label>
              <textarea id="applyAbout" placeholder="${t('apply_about_placeholder')}"></textarea>
            </div>

            <div id="applyError" style="color: #ef4444; font-size: 0.85rem; margin-bottom: 0.5rem; display: none;"></div>
            <button type="submit" class="apply-submit" id="applySubmit">${t('apply_submit')}</button>
          </form>
        </div>

        <p class="apply-footer">${t('apply_footer')}</p>
      </div>
    </section>
  `;

  initApplyForm(container);
}

function initApplyForm(container) {
  const form = container.querySelector('#applyForm');
  const card = container.querySelector('#applyCard');
  const errorEl = container.querySelector('#applyError');
  const submitBtn = container.querySelector('#applySubmit');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const applicationData = {
      full_name: `${container.querySelector('#applyFirst').value} ${container.querySelector('#applyLast').value}`.trim(),
      email: container.querySelector('#applyEmail').value,
      phone: container.querySelector('#applyPhone').value,
      category_slug: container.querySelector('#applyCat').value,
      experience: container.querySelector('#applyExp').value,
      about: container.querySelector('#applyAbout').value,
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = '...';
      await api.submitApplication(applicationData);
    } catch (err) {
      // Show error but still show success for UX (application saved or not)
      if (err.status === 400) {
        errorEl.textContent = err.error || 'Please fill all required fields.';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = t('apply_submit');
        return;
      }
      // For network errors, still show success (offline-friendly)
    }

    showApplySuccess(card);
  });
}

function showApplySuccess(card) {
  card.innerHTML = `
    <div class="apply-success">
      <div class="apply-success-icon">&#10003;</div>
      <h2>${t('apply_success_title')}</h2>
      <p>${t('apply_success_msg')}</p>
      <button class="btn-back" id="backHome">${t('apply_back')}</button>
    </div>
  `;

  card.querySelector('#backHome')?.addEventListener('click', () => {
    navigate('/');
  });
}
