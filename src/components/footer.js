import './footer.css';

export function createFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="nav-logo">
          <span class="logo-dot"></span>
          handly
        </a>
        <p>Connecting homeowners with trusted, verified professionals since 2023. Your home is in good hands.</p>
      </div>
      <div class="footer-col">
        <h5>Services</h5>
        <ul>
          <li><a href="/service?type=plumbing">Plumbing</a></li>
          <li><a href="/service?type=electrical">Electrical</a></li>
          <li><a href="/service?type=cleaning">Cleaning</a></li>
          <li><a href="/service?type=painting">Painting</a></li>
          <li><a href="/service?type=hvac">HVAC</a></li>
          <li><a href="/service?type=handyman">Handyman</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">How It Works</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Press</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Support</h5>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Safety</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Handly. All rights reserved.</p>
      <div class="footer-social">
        <a href="#" aria-label="Twitter">&#120143;</a>
        <a href="#" aria-label="Instagram">&#9635;</a>
        <a href="#" aria-label="LinkedIn">in</a>
      </div>
    </div>
  `;
  return footer;
}
