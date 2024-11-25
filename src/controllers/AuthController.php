<?php

require_once __DIR__ . '/../models/User.php';

class AuthController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function login($email, $password)
    {
        error_log("Intentando iniciar sesión con email: $email"); // Registro para depuración
    
        try {
            // Verificar si el usuario existe en la base de datos
            $user = $this->userModel->getUserByEmail($email);
    
            if (!$user) {
                error_log("Error: Usuario con email $email no encontrado.");
                echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
                return;
            }
    
            // Verificar si la contraseña coincide
            if (!password_verify($password, $user['password'])) {
                error_log("Error: Contraseña incorrecta para el email $email.");
                echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
                return;
            }
    
            // Inicio de sesión exitoso, devolver datos relevantes
            echo json_encode([
                'success' => true,
                'userId' => $user['idUser'],  // Asegúrate de que 'idUser' exista en la tabla User
                'userName' => $user['nombre']
            ]);
        } catch (Exception $e) {
            // Registrar el error y devolver una respuesta genérica
            error_log("Error en el inicio de sesión: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Ocurrió un problema al iniciar sesión. Intente nuevamente más tarde.']);
        }
    }

    public function register($data)
    {
        if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['telefono']) || empty($data['password'])) {
            echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
            return;
        }
    
        // Hashear la contraseña
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    
        // Crear el usuario y obtener el idUser
        $userId = $this->userModel->createUser($data['nombre'], $data['apellido'], $data['email'], $data['telefono'], $hashedPassword);
    
        if ($userId) {
            echo json_encode([
                'success' => true,
                'message' => 'Usuario registrado exitosamente.',
                'userId' => $userId,
                'userName' => $data['nombre']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario.']);
        }
    }

    public function getUserRutinasWithExercises($userId)
    {
        require_once __DIR__ . '/../models/Rutina.php';
        $rutinaModel = new Rutina();
        $rutinas = $rutinaModel->getRutinasByUserId($userId);
    
        if (empty($rutinas)) {
            // Si no hay rutinas, devuelve un array vacío con éxito
            return [];
        }
    
        return $rutinas;
    }
}
