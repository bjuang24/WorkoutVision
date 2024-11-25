import { fetchRutinas, addRutinaToUser } from "../api/rutinas.js";

// Renderizar tarjetas dinámicamente
export function loadRutinas() {
    fetchRutinas().then(response => {
        if (response.success) {
            renderCards(response.data);
        } else {
            console.error("Error al cargar rutinas:", response.message);
        }
    });
}

function renderCards(rutinas) {
    const container = document.querySelector(".cards-container");
    container.innerHTML = rutinas
        .map(rutina => createCardHTML(rutina))
        .join("");

    $(".btn-add").on("click", handleAddRutina);
}

function createCardHTML(rutina) {
    return `
        <div class="card" data-id="${rutina.idRutina}">
            <h3>${rutina.nombre_rutina}</h3>
            <p>${rutina.descripcion}</p>
            <strong>Nivel: ${rutina.nivel}</strong>
            <button class="btn-add" data-id="${rutina.idRutina}">Agregar</button>
        </div>
    `;
}

function handleAddRutina(event) {
    const rutinaId = $(event.target).data("id");
    addRutinaToUser(rutinaId).then(response => {
        if (response.success) {
            $(`.card[data-id="${rutinaId}"]`).fadeOut(300, function () {
                $(this).remove();
            });
        } else {
            console.error("Error al agregar rutina:", response.message);
        }
    });
}
