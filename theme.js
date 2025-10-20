// Minimaler Theme-Controller: Schaltet UI, speichert in localStorage und benachrichtigt maps.js

(function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function applyState(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function setTheme(theme) {
    applyState(theme);
    localStorage.setItem('theme', theme);

    // Wenn maps.js stellt window.setTheme bereit, rufe es auf; ansonsten dispatche Event
    if (typeof window.setTheme === 'function') {
      window.setTheme(theme);
    } else {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
  }

  // Initialisieren: lese gespeichertes oder System-Präferenz
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');

  applyState(initial);
  if (typeof window.setTheme === 'function') {
    window.setTheme(initial);
  }

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  // Erlaubt Tastatur (Enter/Space) — button ist standardmäßig aktivierbar, zusätzliche absicherung:
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
})();