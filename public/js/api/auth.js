import { ajaxRequest } from "../utils/ajax.js";

// Iniciar sesión
export function login(email, password) {
    localStorage.setItem("isLoggedIn", "true");
    return ajaxRequest("routes/api.php", {
        action: "login",
        email: email,
        password: password,
    });
}

// Función para registrar un nuevo usuario
export function register(userData) {
    return ajaxRequest("routes/api.php", {
        action: "register",
        ...userData,
    });
}
