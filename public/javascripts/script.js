document.addEventListener("DOMContentLoaded", function () {

    //Por defecto el mapa se centra en Malaga
    var map = L.map('map').setView([36.7213, -4.4213], 15);

    //Añadimos las tiles de OpenMaps
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Añadimos tres marcadores en ubicaciones dentro de Málaga
    var puntos = [
        { lat: 36.7196, lng: -4.4200, name: "Catedral de Málaga" },
        { lat: 36.7226, lng: -4.4305, name: "Castillo de Gibralfaro" },
        { lat: 36.7190, lng: -4.4171, name: "Teatro Romano de Málaga" }
    ];

    puntos.forEach(punto => {
        L.marker([punto.lat, punto.lng])
            .addTo(map)
            .bindPopup(`
                <div class="d-flex flex-column align-items-center text-center">
                    <img src="https://img.icons8.com/?size=50&id=6AGHyLA8bTw4&format=png&color=000000" alt="${punto.name}" class="mb-2">
                    <b>${punto.name}</b>
                </div>
            `)
            .openPopup();
    });
})
