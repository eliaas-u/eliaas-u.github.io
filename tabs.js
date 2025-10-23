// Robust tab controller — waits for DOM and ensures activation works
document.addEventListener('DOMContentLoaded', function () {
  const buttons = Array.from(document.querySelectorAll('.tab-btn'));
  const panes = Array.from(document.querySelectorAll('.tab-pane'));

  function activate(targetId) {
    panes.forEach(p => {
      const isActive = p.id === targetId;
      p.classList.toggle('active', isActive);
      p.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
    buttons.forEach(b => {
      const isActive = b.dataset.target === targetId;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (targetId === 'tab-projects' && window.maps && Array.isArray(window.maps)) {
      setTimeout(() => {
        window.maps.forEach(obj => {
          try { obj.map.invalidateSize(); } catch (e) { /* ignore */ }
        });
      }, 200);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.target));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  const init = document.querySelector('.tab-btn.active')?.dataset.target || 'tab-about';
  activate(init);
});