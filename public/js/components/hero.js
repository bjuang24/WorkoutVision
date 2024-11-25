import { fetchUserRutinas, fetchAllRutinasWithExercises, addUserRutina, deleteUserRutina} from "../api/rutinas.js";

export async function loadHeroSection() {
    const heroContainer = document.getElementById("hero-section");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");
    
    if (!document.getElementById("hero-section")) {
        console.log("La sección 'hero-section' no está disponible en esta página.");
        return;
    }
    heroContainer.innerHTML = ""; // Limpia el contenedor

    if (!isLoggedIn || !userId) {
        heroContainer.innerHTML = `
            <section class="hero" id="hero-default">
                <div class="hero-content">
                    <h1>Bienvenido a Workout Vision</h1>
                    <p>Empieza tu viaje fitness con nosotros.</p>
                    <a href="registro.html" class="btn-hero">Regístrate</a>
                </div>
            </section>
        `;
        return;
    }

    try {
        // Obtener rutinas del usuario
        const response = await fetchUserRutinas(userId);
        if (!response.success || response.rutinas.length === 0) {
            heroContainer.innerHTML = `
                <section class="hero" id="hero-no-rutinas">
                    <div class="hero-content">
                        <h1>¿Aún no tienes rutinas?</h1>
                        <p>¡Que esperas para construir las tuyas!</p>
                        <a href="#" class="btn-hero" id="btnVerRutinas">Ver Rutinas</a>
                    </div>
                </section>
            `;
            setupViewAllRutinasButton();
            return;
        }

        // Mostrar las rutinas del usuario
        heroContainer.innerHTML = `
            <section class="hero" id="hero-rutinas">
                <div class="hero-content">
                    <h1>Tus Rutinas:</h1>
                    <div class="rutinas-container">
                        ${response.rutinas
                            .map(
                                (rutina) => `
                                <div class="rutina-card">
                                    <button class="btn-delete" data-id="${rutina.idRutina}">
                                        <i class="fa-solid fa-x"></i>
                                    </button>
                                    <h3>${rutina.nombre_rutina} (${rutina.nivel})</h3>
                                    <p>${rutina.descripcion}</p>
                                    <ul>
                                        ${rutina.ejercicios
                                            .map(
                                                (ej) => `
                                            <li><strong>${ej.nombre_ejercicio}</strong> - ${ej.series || 0}x${ej.repeticiones || 0}</li>
                                        `
                                            )
                                            .join("")}
                                    </ul>
                                </div>
                            `
                            )
                            .join("")}
                    </div>
                    <button class="btn-hero btn-view-all" id="btnViewAllRutinas">Ver Más Rutinas</button>
                </div>
            </section>
        `;
        setupDeleteButtons();
        setupMoreRutinasButton();
    } catch (error) {
        console.error("Error al cargar la sección hero:", error);
        heroContainer.innerHTML = `
            <section class="hero" id="hero-error">
                <div class="hero-content">
                    <h1>Error al cargar las rutinas</h1>
                    <p>Ocurrió un problema al intentar obtener las rutinas. Por favor, intenta nuevamente más tarde.</p>
                </div>
            </section>
        `;
    }
}

export function setupViewAllRutinasButton() {
    const viewAllRutinasButton = document.getElementById("btnVerRutinas");

    if (!viewAllRutinasButton) {
        console.error("No se encontró el botón para ver todas las rutinas.");
        return;
    }

    viewAllRutinasButton.addEventListener("click", async () => {
        try {
            const response = await fetchAllRutinasWithExercises();

            if (!response.success) {
                throw new Error(response.message || "Error al obtener las rutinas disponibles.");
            }

            renderAllRutinasHero(response.rutinas);
        } catch (error) {
            console.error("Error al cargar todas las rutinas:", error);
        }
    });
}

// Renderiza un nuevo hero con todas las rutinas disponibles
function renderAllRutinasHero(rutinas) {
    const heroContainer = document.getElementById("hero-section");
    heroContainer.innerHTML = `
        <section class="hero" id="hero-all-rutinas">
            <button class="btn-back" id="btnBack">Volver</button>
            <div class="hero-content">
                <h1>Rutinas Disponibles</h1>
                <div class="rutinas-container">
                    ${rutinas.map(rutina => `
                        <div class="rutina-card">
                            <h3>${rutina.nombre_rutina} (${rutina.nivel})</h3>
                            <p>${rutina.descripcion}</p>
                            <ul>
                                ${rutina.ejercicios.map(ejercicio => `
                                    <li>
                                        <strong>${ejercicio.nombre_ejercicio}</strong>: 
                                        ${ejercicio.series || 0}x${ejercicio.repeticiones || 0} 
                                        ${ejercicio.peso ? `@ ${ejercicio.peso}kg` : ""}
                                    </li>
                                `).join("")}
                            </ul>
                            <button class="btn-add" data-id="${rutina.idRutina}">Agregar</button>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>
    `;
    setupAddButtons(); // Configura los eventos de los botones
}
function setupAddButtons() {
    const userId = localStorage.getItem("userId"); // Obtener el ID del usuario logueado
    const addButtons = document.querySelectorAll(".btn-add");

    addButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const rutinaId = button.dataset.id; // ID de la rutina directamente desde el atributo data-id
            const card = button.closest(".rutina-card"); // Encuentra la tarjeta asociada al botón

            if (!userId || !rutinaId) {
                console.error("Datos incompletos para agregar rutina.");
                return;
            }

            try {
                // Enviar solicitud al backend para vincular la rutina al usuario
                const response = await addUserRutina(userId, rutinaId);
                if (response.success) {
                    console.log(`Rutina ${rutinaId} agregada al usuario ${userId}`);

                    // Animación para eliminar la tarjeta
                    card.style.transition = "opacity 0.5s ease";
                    card.style.opacity = "0";
                    setTimeout(() => card.remove(), 500);
                } else {
                    console.error("Error al agregar rutina:", response.message);
                }
            } catch (error) {
                console.error("Error al comunicarse con el backend:", error);
            }
        });
    });
}
// Configurar el evento del botón "Ver Más Rutinas"
export function setupMoreRutinasButton() {
    const viewAllRutinasButton = document.getElementById("btnViewAllRutinas");

    if (!viewAllRutinasButton) {
        console.error("No se encontró el botón para ver más rutinas.");
        return;
    }

    viewAllRutinasButton.addEventListener("click", async () => {
        try {
            const response = await fetchAllRutinasWithExercises();

            if (!response.success) {
                throw new Error(response.message || "Error al obtener las rutinas disponibles.");
            }

            renderAllRutinasHero(response.rutinas);
        } catch (error) {
            console.error("Error al cargar todas las rutinas:", error);
        }
    });
}
function setupDeleteButtons() {
    const userId = localStorage.getItem("userId"); // Obtener el ID del usuario logueado
    const deleteButtons = document.querySelectorAll(".btn-delete");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const rutinaId = button.dataset.id; // ID de la rutina directamente desde el atributo data-id
            const card = button.closest(".rutina-card"); // Encuentra la tarjeta asociada al botón

            if (!userId || !rutinaId) {
                console.error("Datos incompletos para eliminar rutina.");
                return;
            }

            try {
                // Enviar solicitud al backend para desvincular la rutina del usuario
                const response = await deleteUserRutina(userId, rutinaId);
                if (response.success) {
                    console.log(`Rutina ${rutinaId} eliminada del usuario ${userId}`);

                    // Animación para eliminar la tarjeta
                    card.style.transition = "opacity 0.5s ease";
                    card.style.opacity = "0";
                    setTimeout(() => card.remove(), 500);
                } else {
                    console.error("Error al eliminar rutina:", response.message);
                }
            } catch (error) {
                console.error("Error al comunicarse con el backend:", error);
            }
        });
    });
}