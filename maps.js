// ...new file...
/*
  Themeable Leaflet maps with SVG data-url pins.
  - Uses light/dark tile sets
  - Adds a marker (pin) on each map with popup
  - Pins and baselayers switch when window.setTheme(...) is called
  - Exposes window.maps (array of {map, marker, lightLayer, darkLayer})
*/

(function () {
  if (typeof L === 'undefined') return;

  // Tile providers
  const LIGHT_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  // Small SVG pin generator (returns data URL)
  function svgPinDataUrl(color = '#0b74de') {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 34">
        <defs>
          <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
          </filter>
        </defs>
        <path d="M12 0C7 0 3.5 3.5 3.5 8.5 3.5 15.7 12 34 12 34s8.5-18.3 8.5-25.5C20.5 3.5 17 0 12 0z"
              fill="${color}" filter="url(#s)"/>
        <circle cx="12" cy="8.5" r="3.5" fill="#ffffff" opacity="0.95"/>
      </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function createIcon(color) {
    return L.icon({
      iconUrl: svgPinDataUrl(color),
      iconSize: [24, 34],
      iconAnchor: [12, 34],
      popupAnchor: [0, -34],
      className: 'svg-pin-icon'
    });
  }

  // Map configurations and labels (centers updated)
  const mapConfigs = [
    // Kelweg, 65239 Hochheim (Hochheim am Main) - updated coordinates
    { id: 'map1', center: [50.016736, 8.349479], zoom: 13, title: 'Hochheim am Main — Kelweg 65239' },

    // Mainz (central)
    { id: 'map2', center: [50.0000, 8.2700], zoom: 13, title: 'Mainz' },

    // Lucie-Hildebrand-Straße 2, 55128 Mainz (University of Applied Sciences Mainz) - updated position
    { id: 'map3', center: [49.9889018, 8.2266451], zoom: 15, title: 'University of Applied Sciences Mainz — Lucie-Hildebrand-Straße 2' }
  ];

  // Determine initial theme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  const maps = [];

  mapConfigs.forEach(cfg => {
    const lightLayer = L.tileLayer(LIGHT_TILE_URL, {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    });
    const darkLayer = L.tileLayer(DARK_TILE_URL, {
      maxZoom: 19,
      attribution: '© OpenStreetMap, CartoDB'
    });

    const baseLayer = (initialTheme === 'dark') ? darkLayer : lightLayer;

    const map = L.map(cfg.id, {
      center: cfg.center,
      zoom: cfg.zoom,
      layers: [baseLayer],
      zoomControl: true
    });

    // marker color: use accent on light, lighter accent on dark for contrast
    const markerColor = (initialTheme === 'dark') ? '#61a9ff' : '#0b74de';
    const marker = L.marker(cfg.center, { icon: createIcon(markerColor) }).addTo(map);
    marker.bindPopup(`<strong>${cfg.title}</strong>`);

    maps.push({ map, lightLayer, darkLayer, marker, cfg });
  });

  // Expose maps array for tabs.js etc.
  window.maps = maps;

  // Theme switcher for maps: swaps baselayers and updates marker icons
  window.setTheme = function (theme) {
    if (!theme) return;
    maps.forEach(obj => {
      const { map, lightLayer, darkLayer, marker } = obj;
      // swap base layer
      if (map.hasLayer(lightLayer)) map.removeLayer(lightLayer);
      if (map.hasLayer(darkLayer)) map.removeLayer(darkLayer);
      if (theme === 'dark') {
        darkLayer.addTo(map);
      } else {
        lightLayer.addTo(map);
      }

      // update marker icon color for contrast
      const newColor = (theme === 'dark') ? '#61a9ff' : '#0b74de';
      try {
        marker.setIcon(createIcon(newColor));
      } catch (e) {
        // ignore icon update errors
      }
    });
  };

  // If theme already set on document, apply it to maps (safety)
  if (document.documentElement.getAttribute('data-theme')) {
    window.setTheme(document.documentElement.getAttribute('data-theme'));
  }
})();
// ...new file...