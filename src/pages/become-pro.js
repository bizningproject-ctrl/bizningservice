import './become-pro.css';
import { initScrollReveal } from './home.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

export function renderBecomePro(container) {
  document.title = `Fixit — ${t('nav_become')}`;

  container.innerHTML = `
    <!-- HERO -->
    <section class="bp-hero">
      <div class="bp-hero-floats">
        <span class="bp-float-icon bp-float-gear">&#9881;</span>
        <span class="bp-float-icon bp-float-bolt">&#9889;</span>
        <span class="bp-float-icon bp-float-wrench">&#128295;</span>
        <span class="bp-float-icon bp-float-hammer">&#128296;</span>
        <span class="bp-float-icon bp-float-paintbrush">&#128396;</span>
        <span class="bp-float-icon bp-float-house">&#127968;</span>
      </div>
      <div class="bp-hero-content">
        <div class="bp-hero-badge">
          <span class="badge-dot"></span>
          ${t('bp_badge')}
        </div>
        <h1>${t('bp_title_1')}<br>${t('bp_title_2')} <span class="text-gradient">Fixit</span></h1>
        <p class="bp-hero-sub">${t('bp_sub')}</p>
        <div class="bp-hero-cta">
          <button class="btn-glow" id="bpApply">${t('bp_apply_free')}</button>
          <a href="#bp-how" class="btn-secondary">${t('bp_how')}</a>
        </div>
        <div class="bp-hero-scroll">
          <span>${t('bp_scroll')}</span>
          <div class="scroll-line"></div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="bp-stats">
      <div class="bp-stats-inner">
        <div class="bp-stat">
          <div class="bp-stat-number">${t('bp_stat1_num')}</div>
          <div class="bp-stat-label">${t('bp_stat1_label')}</div>
        </div>
        <div class="bp-stat">
          <div class="bp-stat-number">${t('bp_stat2_num')}</div>
          <div class="bp-stat-label">${t('bp_stat2_label')}</div>
        </div>
        <div class="bp-stat">
          <div class="bp-stat-number">${t('bp_stat3_num')}</div>
          <div class="bp-stat-label">${t('bp_stat3_label')}</div>
        </div>
        <div class="bp-stat">
          <div class="bp-stat-number">${t('bp_stat4_num')}</div>
          <div class="bp-stat-label">${t('bp_stat4_label')}</div>
        </div>
      </div>
    </section>

    <!-- BENEFITS -->
    <section class="bp-benefits">
      <div class="section-header reveal">
        <span class="section-label">${t('bp_why_label')}</span>
        <h2 class="section-title">${t('bp_why_title')}</h2>
        <p class="section-subtitle">${t('bp_why_sub')}</p>
      </div>
      <div class="bp-benefits-grid">
        <div class="bp-benefit reveal">
          <div class="bp-benefit-icon"><span>&#128176;</span></div>
          <h3>${t('bp_benefit1_title')}</h3>
          <p>${t('bp_benefit1_desc')}</p>
        </div>
        <div class="bp-benefit reveal">
          <div class="bp-benefit-icon"><span>&#128197;</span></div>
          <h3>${t('bp_benefit2_title')}</h3>
          <p>${t('bp_benefit2_desc')}</p>
        </div>
        <div class="bp-benefit reveal">
          <div class="bp-benefit-icon"><span>&#128200;</span></div>
          <h3>${t('bp_benefit3_title')}</h3>
          <p>${t('bp_benefit3_desc')}</p>
        </div>
        <div class="bp-benefit reveal">
          <div class="bp-benefit-icon"><span>&#128274;</span></div>
          <h3>${t('bp_benefit4_title')}</h3>
          <p>${t('bp_benefit4_desc')}</p>
        </div>
        <div class="bp-benefit reveal">
          <div class="bp-benefit-icon"><span>&#11088;</span></div>
          <h3>${t('bp_benefit5_title')}</h3>
          <p>${t('bp_benefit5_desc')}</p>
        </div>
        <div class="bp-benefit reveal">
          <div class="bp-benefit-icon"><span>&#128640;</span></div>
          <h3>${t('bp_benefit6_title')}</h3>
          <p>${t('bp_benefit6_desc')}</p>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="bp-how" id="bp-how">
      <div class="bp-how-inner">
        <div class="section-header reveal">
          <span class="section-label">${t('bp_steps_label')}</span>
          <h2 class="section-title">${t('bp_steps_title')}</h2>
        </div>
        <div class="bp-steps">
          <div class="bp-step reveal">
            <div class="bp-step-num">1</div>
            <div class="bp-step-content">
              <h3>${t('bp_step1_title')}</h3>
              <p>${t('bp_step1_desc')}</p>
            </div>
          </div>
          <div class="bp-step reveal">
            <div class="bp-step-num">2</div>
            <div class="bp-step-content">
              <h3>${t('bp_step2_title')}</h3>
              <p>${t('bp_step2_desc')}</p>
            </div>
          </div>
          <div class="bp-step reveal">
            <div class="bp-step-num">3</div>
            <div class="bp-step-content">
              <h3>${t('bp_step3_title')}</h3>
              <p>${t('bp_step3_desc')}</p>
            </div>
          </div>
          <div class="bp-step reveal">
            <div class="bp-step-num">4</div>
            <div class="bp-step-content">
              <h3>${t('bp_step4_title')}</h3>
              <p>${t('bp_step4_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bp-cta">
      <div class="bp-cta-box reveal">
        <h2>${t('bp_cta_title')}</h2>
        <p>${t('bp_cta_sub')}</p>
        <button class="btn-glow" id="bpApply2">${t('bp_apply')}</button>
      </div>
    </section>
  `;

  initBpAnimations(container);
  initScrollReveal();
}

function initBpAnimations(container) {
  const floatIcons = container.querySelectorAll('.bp-float-icon');
  const speeds = [0.35, 0.5, 0.25, 0.4, 0.3, 0.45];

  const onScroll = () => {
    const scrollY = window.scrollY;
    floatIcons.forEach((icon, i) => {
      const speed = speeds[i] || 0.3;
      icon.style.transform = `translateY(${-scrollY * speed}px)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bp-stat').forEach(stat => {
          stat.classList.add('visible');
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = container.querySelector('.bp-stats-inner');
  if (statsSection) statsObserver.observe(statsSection);

  container.querySelector('.bp-hero-cta .btn-secondary')?.addEventListener('click', (e) => {
    e.preventDefault();
    container.querySelector('#bp-how')?.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('.bp-hero-scroll')?.addEventListener('click', () => {
    container.querySelector('.bp-stats')?.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#bpApply')?.addEventListener('click', () => {
    navigate('/apply');
  });

  container.querySelector('#bpApply2')?.addEventListener('click', () => {
    navigate('/apply');
  });
}
