// Lädt assets/news.json und rendert die News dynamisch in #news-list
(function () {
  async function loadNews() {
    const container = document.getElementById('news-list');
    if (!container) return;

    try {
      const res = await fetch('assets/news.json', { cache: "no-cache" });
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>Keine News vorhanden.</p>';
        return;
      }

      container.innerHTML = '';
      data.forEach(item => {
        const article = document.createElement('article');
        article.className = 'news-item';

        const date = new Date(item.date);
        const dateStr = isNaN(date) ? item.date : date.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' });

        article.innerHTML = `
          <figure class="news-figure">
            <img src="${item.image}" alt="${escapeHtml(item.title)}">
          </figure>
          <div class="news-body">
            <h3 class="news-title">${escapeHtml(item.title)}</h3>
            <time class="news-date" datetime="${escapeHtml(item.date)}">${escapeHtml(dateStr)}</time>
            <p class="news-excerpt">${escapeHtml(item.excerpt)}</p>
          </div>
        `;
        container.appendChild(article);
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p>Fehler beim Laden der News.</p>';
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  document.addEventListener('DOMContentLoaded', loadNews);
})();