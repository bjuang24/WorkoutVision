import { importNavbar } from "./components/navbar.js";
import { loadHeroSection } from "./components/hero.js";
import { login, register } from "./api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

// Inicializa la aplicación
function initApp() {
    // Cargar la barra de navegación
    importNavbar();

    // Verifica si estás en index.html antes de cargar la sección Hero
    if (document.title === "Workout Vision") {
        loadHeroSection();
    } else {
        console.log("No es la página de inicio, no se carga la sección Hero.");
    }

    // Configurar eventos de formularios
    setupLoginForm();
    setupSignupForm();

    console.log("Workout Vision: Aplicación inicializada.");
}

// Configurar el formulario de inicio de sesión
function setupLoginForm() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await login(email, password);

                if (response.success) {
                    alert("Inicio de sesión exitoso");
                    // Guardar estado de sesión
                    localStorage.setItem("userName", response.userName);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userId", response.userId);

                    // Redirigir a la página principal
                    window.location.href = "index.html";
                } else {
                    alert(`Error: ${response.message}`);
                }
            } catch (error) {
                console.error("Error en el inicio de sesión:", error);
                alert("Hubo un problema al intentar iniciar sesión.");
            }
        });
    }
}

// Configurar el formulario de registro
function setupSignupForm() {
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const apellido = document.getElementById("apellido").value;
            const email = document.getElementById("email").value;
            const telefono = document.getElementById("telefono").value;
            const password = document.getElementById("password").value;

            try {
                const response = await register({ nombre, apellido, email, telefono, password });

                if (response.success) {
                    alert("Registro exitoso");

                    // Guardar datos en localStorage
                    localStorage.setItem("userName", `${nombre} ${apellido}`);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userId", response.userId);

                    // Redirigir al usuario a la página principal
                    window.location.href = "index.html";
                } else {
                    alert(`Error: ${response.message}`);
                }
            } catch (error) {
                console.error("Error en el registro:", error);
                alert("Hubo un problema al intentar registrar el usuario.");
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    // Carga la sección hero principal
    loadHeroSection();

    // Configura el evento del botón de volver
    document.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.id === "btnBack") {
            loadHeroSection(); // Vuelve a cargar el hero principal
        }
    });
});
