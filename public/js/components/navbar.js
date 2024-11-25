// Importa y configura la barra de navegación según el estado del usuario
export function importNavbar() {
    const userName = localStorage.getItem("userName");
    if (userName) {
        renderLoggedInNavbar(userName);
    } else {
        renderLoggedOutNavbar();
    }
}

// Renderiza la barra de navegación para usuarios logueados
function renderLoggedInNavbar(userName) {
    $("#auth-buttons").html(`
        <i class="fa-solid fa-right-from-bracket btn-logout" id="logoutButton"></i>
    `);
    $("#login-message").html(`¡Bienvenido, ${userName}!`);
    $("#logoutButton").on("click", handleLogout);
}

// Renderiza la barra de navegación para usuarios no logueados
function renderLoggedOutNavbar() {
    $("#auth-buttons").html(`
        <a class="btn-login" id="loginButton" href="inicio_sesion.html">Iniciar sesión</a>
    `);
}

// Maneja el evento de cierre de sesión
function handleLogout() {
    // Eliminar todas las claves relacionadas con el inicio de sesión
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    
    // Recargar la página para reiniciar el estado
    location.reload();
}
