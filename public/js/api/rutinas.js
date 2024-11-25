import { ajaxRequest } from "../utils/ajax.js";

// Traer las rutinas vinculadas al usuario logueado
export function fetchUserRutinas(userId) {
    return $.ajax({
        url: "routes/api.php",
        method: "POST",
        dataType: "json",
        data: {
            action: "fetchUserRutinas",
            userId: userId, // Enviar el ID del usuario
        },
    });
}

// Obtener todas las rutinas disponibles con ejercicios
export function fetchAllRutinasWithExercises() {
    return ajaxRequest("routes/api.php", { action: "fetchAllRutinasWithExercises" });
}

export function addUserRutina(userId, rutinaId) {
    return ajaxRequest("routes/api.php", {
        action: "addUserRutina",
        userId: userId,
        rutinaId: rutinaId,
    });
}

export function deleteUserRutina(userId, rutinaId) {
    return $.ajax({
        url: "routes/api.php",
        method: "POST",
        dataType: "json",
        data: {
            action: "deleteUserRutina", // Acción específica para la eliminación
            userId: userId,
            rutinaId: rutinaId,
        },
    });
}

