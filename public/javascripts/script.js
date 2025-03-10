document.addEventListener("DOMContentLoaded", async function () {
    console.log("Documento cargado, iniciando mapa...");

    // Inicializar el mapa centrado en Málaga
    var map = L.map('map').setView([36.7213, -4.4213], 15);

    // Añadir tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Definir icono personalizado
    var customIcon = L.icon({
        iconUrl: '../icons/studio.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32] 
    });

    // Guardar todos los puntos en un array
    let monumentosData = [];

    async function cargarLocations() {
        try {
            console.log("Cargando datos desde GeoJSON...");
            const response = await fetch("da_cultura_ocio_monumentos-4326.geojson");

            if (!response.ok) {
                throw new Error("Error fetching data");
            }

            const geojson = await response.json();
            console.log("Datos cargados correctamente:", geojson);

            const nameList = document.getElementById("names-list");

            geojson.features.forEach((feature, index) => {
                const lat = feature.geometry.coordinates[1];
                const lng = feature.geometry.coordinates[0];
                const nombre = feature.properties?.NOMBRE || "Sin nombre";
                const descripcion = feature.properties?.DESCRIPCION || "Sin descripción";

                const marker = L.marker([lat, lng], { icon: customIcon })
                    .addTo(map)
                    .on("click", () => mostrarModal(nombre, descripcion, lat, lng));

                monumentosData.push({ nombre, descripcion, lat, lng, marker });

                const listItem = document.createElement("li");
                listItem.className = "list-group-item list-group-item-action";
                listItem.textContent = nombre;
                listItem.style.cursor = "pointer";
                listItem.addEventListener("click", () => centrarEnMapa(nombre));
                nameList.appendChild(listItem);
            });

        } catch (error) {
            console.error("Error cargando los puntos:", error);
        }
    }

    function centrarEnMapa(nombre) {
        const monumento = monumentosData.find(item => item.nombre === nombre);

        if (monumento) {
            console.log(`Centrando en: ${monumento.nombre}`);
            map.flyTo([monumento.lat, monumento.lng], 17);
            mostrarModal(monumento.nombre, monumento.descripcion, monumento.lat, monumento.lng);

        } else {
            console.warn(`No se encontró el monumento con nombre: ${nombre}`);
        }
    }

    function mostrarModal(nombre, descripcion, lat, lng) {
        console.log(`Mostrando modal para: ${nombre}`);

        document.getElementById("modal-title").textContent = nombre;
        document.getElementById("modal-description").textContent = descripcion;

        let modal = new bootstrap.Modal(document.getElementById("infoModal"));
        modal.show();
    }

    // Cargar los monumentos al iniciar la página
    cargarLocations();
});
