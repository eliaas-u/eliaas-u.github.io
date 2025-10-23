// Lädt assets/news.json + lokale saved news; ermöglicht Hinzufügen, Export und Löschen (localStorage)
(function () {
  const container = document.getElementById('news-list');
  const form = document.getElementById('news-form');
  const exportBtn = document.getElementById('news-export');
  const clearBtn = document.getElementById('news-clear');

  if (!container) return;

  const SAVED_KEY = 'news.saved.v1';
  let initialNews = [];
  let savedNews = loadSaved();

  // Try fetch initial JSON (graceful fallback)
  async function fetchInitial() {
    try {
      const res = await fetch('assets/news.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) initialNews = data;
    } catch (err) {
      console.warn('news: could not fetch assets/news.json — continuing with saved only.', err);
      initialNews = [];
    }
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('news: invalid saved data, clearing', e);
      localStorage.removeItem(SAVED_KEY);
      return [];
    }
  }

  function saveSaved() {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedNews));
  }

  function combined() {
    // show saved news first (most recent first), then initial
    const savedSorted = [...savedNews].sort((a,b)=> b.id - a.id);
    return savedSorted.concat(initialNews);
  }

  function renderNews(list) {
    if (!Array.isArray(list) || list.length === 0) {
      container.innerHTML = '<p>Keine News vorhanden.</p>';
      return;
    }
    container.innerHTML = '';
    list.forEach(item => {
      const date = item.date ? formatDate(item.date) : '';
      const img = item.image ? escapeHtml(item.image) : 'https://via.placeholder.com/400x240?text=No+Image';
      const article = document.createElement('article');
      article.className = 'news-item';
      article.innerHTML = `
        <figure class="news-figure"><img src="${img}" alt="${escapeHtml(item.title || '')}"></figure>
        <div class="news-body">
          <h3 class="news-title">${escapeHtml(item.title || 'Ohne Titel')}</h3>
          <time class="news-date" datetime="${escapeHtml(item.date || '')}">${escapeHtml(date)}</time>
          <p class="news-excerpt">${escapeHtml(item.excerpt || '')}</p>
        </div>
      `;
      container.appendChild(article);
    });
  }

  function formatDate(d) {
    const dt = new Date(d);
    if (isNaN(dt)) return d || '';
    return dt.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // Add new news (from form). id based on timestamp (ms)
  function addNewsFromForm(e) {
    e.preventDefault();
    if (!form) return;
    const title = form.querySelector('#news-title').value.trim();
    const date = form.querySelector('#news-date').value || new Date().toISOString().slice(0,10);
    const image = form.querySelector('#news-image').value.trim();
    const excerpt = form.querySelector('#news-excerpt').value.trim();
    const content = form.querySelector('#news-content').value.trim();

    if (!title || !excerpt) {
      alert('Bitte Titel und Kurztext ausfüllen.');
      return;
    }

    const id = Date.now();
    const item = { id, title, date, image, excerpt, content };
    savedNews.push(item);
    saveSaved();
    renderNews(combined());
    form.reset();
    // keep focus on title for quick multiple adds
    form.querySelector('#news-title').focus();
  }

  function exportNews() {
    const all = combined();
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'news-export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function clearSaved() {
    if (!confirm('Gespeicherte News löschen? (Initiale news bleiben erhalten)')) return;
    savedNews = [];
    saveSaved();
    renderNews(combined());
  }

  // init
  document.addEventListener('DOMContentLoaded', async () => {
    await fetchInitial();
    renderNews(combined());

    if (form) form.addEventListener('submit', addNewsFromForm);
    if (exportBtn) exportBtn.addEventListener('click', exportNews);
    if (clearBtn) clearBtn.addEventListener('click', clearSaved);
  });
})();