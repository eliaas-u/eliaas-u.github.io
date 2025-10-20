// JavaScript code to initialize and display three Leaflet maps

// Initialize the map
function initMap(mapId, lat, lng, zoom) {
    var map = L.map(mapId).setView([lat, lng], zoom);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add a marker
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Marker at ' + lat + ', ' + lng)
        .openPopup();
}

// Function to create the maps
function createMaps() {
    initMap('map1', 50.0, 8.0, 10); // Example coordinates for map 1
    initMap('map2', 49.0, 8.5, 10); // Example coordinates for map 2
    initMap('map3', 48.5, 8.0, 10); // Example coordinates for map 3
}

// Call the createMaps function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', createMaps);