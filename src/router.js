import { createNavbar, initNavbarBehavior } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { renderHome } from './pages/home.js';
import { renderService } from './pages/service.js';

const routes = {
  '/': { render: renderHome, navVariant: 'home', hasFooter: true },
  '/service': { render: renderService, navVariant: 'service', hasFooter: false },
  '/service.html': { render: renderService, navVariant: 'service', hasFooter: false },
};

function getRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return routes[path] || routes['/'];
}

function mount(route) {
  document.body.innerHTML = '';

  const nav = createNavbar({ variant: route.navVariant });
  document.body.appendChild(nav);

  const main = document.createElement('main');
  document.body.appendChild(main);

  route.render(main);

  if (route.hasFooter) {
    document.body.appendChild(createFooter());
  }

  initNavbarBehavior();
  window.scrollTo(0, 0);
}

export function navigate(href) {
  window.history.pushState({}, '', href);
  mount(getRoute());
}

export function initRouter() {
  mount(getRoute());
  window.addEventListener('popstate', () => mount(getRoute()));
}
