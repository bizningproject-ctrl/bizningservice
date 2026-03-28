const STORAGE_KEY = 'fixit-theme';

export function getTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  return 'light';
}

export function setTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';

  // Enable smooth transition on ALL elements
  document.documentElement.classList.add('theme-transitioning');

  // Apply the theme
  setTheme(next);

  // Remove transition override after animation completes
  // so normal hover/interaction speeds return
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 800);

  return next;
}

export function isDark() {
  return getTheme() === 'dark';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function initTheme() {
  // Apply immediately on load — no transition class = instant, no flash
  applyTheme(getTheme());

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}
