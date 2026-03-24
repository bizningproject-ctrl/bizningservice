import './home.css';
import { serviceData, featuredPros, testimonials } from '../data/services.js';
import { navigate } from '../router.js';

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
            Trusted by 20,000+ homeowners
          </div>
          <h1>Your home<br>deserves <span class="text-blue">the best</span> hands</h1>
          <p class="hero-subtitle">Connect with verified plumbers, electricians, and cleaners in your neighborhood. Transparent pricing, real reviews, and guaranteed satisfaction.</p>

          <div class="search-box">
            <span class="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input type="text" placeholder="What service do you need?" id="searchInput">
            <button id="searchBtn">Search</button>
          </div>

          <div class="hero-tags">
            ${Object.entries(serviceData).map(([key, s]) => `
              <a href="#" class="hero-tag" data-service="${key}">${s.breadcrumb}</a>
            `).join('')}
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-card-stack">
            <div class="floating-badge badge-verified">&#10003; Verified Pro</div>
            <div class="floating-badge badge-online">&#9679; 12 online now</div>

            <div class="pro-card">
              <div class="pro-avatar" style="background: linear-gradient(135deg, #1B2E4A, #2D4A6F)">&#128295;</div>
              <div class="pro-info">
                <h4>Marcus Rivera</h4>
                <div class="pro-role">Master Plumber &bull; 12yr exp</div>
                <div class="pro-meta">
                  <span class="pro-rating">&#9733; 4.9</span>
                  <span class="pro-jobs">847 jobs</span>
                </div>
              </div>
              <div class="pro-price"><span class="amount">$65</span><span class="unit">/hour</span></div>
            </div>

            <div class="pro-card">
              <div class="pro-avatar" style="background: linear-gradient(135deg, #3B82F6, #60A5FA)">&#9889;</div>
              <div class="pro-info">
                <h4>Sarah Chen</h4>
                <div class="pro-role">Electrician &bull; 8yr exp</div>
                <div class="pro-meta">
                  <span class="pro-rating">&#9733; 4.8</span>
                  <span class="pro-jobs">623 jobs</span>
                </div>
              </div>
              <div class="pro-price"><span class="amount">$70</span><span class="unit">/hour</span></div>
            </div>

            <div class="pro-card">
              <div class="pro-avatar" style="background: linear-gradient(135deg, #2563EB, #4F86E7)">&#10024;</div>
              <div class="pro-info">
                <h4>Ana Kowalski</h4>
                <div class="pro-role">Home Cleaner &bull; 5yr exp</div>
                <div class="pro-meta">
                  <span class="pro-rating">&#9733; 5.0</span>
                  <span class="pro-jobs">1,204 jobs</span>
                </div>
              </div>
              <div class="pro-price"><span class="amount">$45</span><span class="unit">/hour</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="services" id="services">
      <div class="section-header reveal">
        <span class="section-label">What We Offer</span>
        <h2 class="section-title">Every service your<br>home needs</h2>
        <p class="section-subtitle">From leaky faucets to full rewiring, our network of certified professionals has you covered.</p>
      </div>
      <div class="services-grid">
        ${Object.entries(serviceData).map(([key, s]) => `
          <a href="#" class="service-card reveal" data-service="${key}">
            <div class="service-icon">${s.icon}</div>
            <h3>${s.breadcrumb}</h3>
            <p>${s.shortDesc}</p>
            <span class="service-count">&#128100; ${s.count} pros available</span>
          </a>
        `).join('')}
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-it-works" id="how">
      <div class="how-inner">
        <div class="section-header reveal">
          <span class="section-label">Simple Process</span>
          <h2 class="section-title">Booked in three<br>easy steps</h2>
          <p class="section-subtitle">No phone tag, no waiting around. Get matched with a pro and confirm your appointment in minutes.</p>
        </div>
        <div class="steps-grid">
          <div class="step-card reveal">
            <div class="step-number">01</div>
            <h3>Describe your need</h3>
            <p>Tell us what you need done, when you need it, and share any photos. The more detail, the better your match.</p>
          </div>
          <div class="step-card reveal">
            <div class="step-number">02</div>
            <h3>Get matched instantly</h3>
            <p>We surface the best-fit professionals in your area based on skill, rating, availability, and price.</p>
          </div>
          <div class="step-card reveal">
            <div class="step-number">03</div>
            <h3>Book &amp; relax</h3>
            <p>Confirm your pro, lock in the price, and track the job from start to finish. Pay securely when you're satisfied.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED PROS -->
    <section class="featured" id="pros">
      <div class="section-header reveal">
        <span class="section-label">Top Rated</span>
        <h2 class="section-title">Meet our highest-rated<br>professionals</h2>
        <p class="section-subtitle">These pros consistently deliver five-star service and have earned the trust of hundreds of homeowners.</p>
      </div>
      <div class="pros-grid">
        ${featuredPros.map(pro => `
          <div class="featured-pro reveal">
            <div class="featured-pro-img" style="background: ${pro.gradient}">
              ${pro.icon}
              <span class="featured-pro-verified">&#10003; Verified</span>
            </div>
            <div class="featured-pro-body">
              <h4>${pro.name}</h4>
              <div class="pro-specialty">${pro.specialty}</div>
              <div class="featured-pro-stats">
                <span class="stat"><span class="stat-rating">&#9733; ${pro.rating}</span></span>
                <span class="stat"><strong>${pro.jobs.toLocaleString()}</strong> jobs</span>
                <span class="stat"><strong>$${pro.price}</strong>/hr</span>
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
          <span class="section-label">Real Stories</span>
          <h2 class="section-title">Homeowners love<br>working with Handly</h2>
        </div>
        <div class="testimonials-grid">
          ${testimonials.map(t => `
            <div class="testimonial-card reveal">
              <div class="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <blockquote>${t.quote}</blockquote>
              <div class="testimonial-author">
                <div class="testimonial-avatar">${t.avatar}</div>
                <div class="testimonial-author-info">
                  <h5>${t.name}</h5>
                  <span>${t.context}</span>
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
        <h2>Ready to find your<br>perfect pro?</h2>
        <p>Join thousands of homeowners who've made home maintenance effortless.</p>
        <div class="cta-buttons">
          <button class="btn-primary" id="ctaSearch">Find a Professional</button>
          <a href="#" class="btn-secondary">Join as a Pro</a>
        </div>
      </div>
    </section>
  `;

  initHomeInteractions(container);
  initScrollReveal();
}

function initHomeInteractions(container) {
  // "Find a Pro" nav link → client-side navigate
  document.querySelector('.nav-find')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/find');
  });

  // Hero tag clicks → navigate to service page
  container.querySelectorAll('.hero-tag, .service-card').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const type = el.dataset.service;
      if (type) navigate(`/service?type=${type}`);
    });
  });

  // Search
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

  // CTA → scroll to top & focus search
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

  // Stagger grid children
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
