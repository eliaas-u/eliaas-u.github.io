// ...new file...
window.addEventListener('load', () => {
  // Beispiele: Hochheim am Main, Mainz (Stadt), Johannes Gutenberg-Universität Mainz
  const locations = [
    { id: 'map1', coords: [50.018, 8.395], title: 'Hochheim am Main' },
    { id: 'map2', coords: [49.992, 8.247], title: 'Mainz (Stadtzentrum)' },
    { id: 'map3', coords: [49.998, 8.241], title: 'Johannes Gutenberg-Universität Mainz' }
  ];

  locations.forEach(loc => {
    const map = L.map(loc.id, { scrollWheelZoom: false, attributionControl: true }).setView(loc.coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker(loc.coords).addTo(map).bindPopup(`<strong>${loc.title}</strong>`);

    L.control.scale({ position: 'bottomleft' }).addTo(map);

    // ensure tiles render correctly
    setTimeout(() => map.invalidateSize(), 200);
  });
});
// ...new file...