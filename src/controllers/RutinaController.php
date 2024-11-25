<?php

require_once __DIR__ . '/../models/Rutina.php';

class RutinaController
{
    private $rutinaModel;

    public function __construct()
    {
        $this->rutinaModel = new Rutina();
    }

    public function getAllRutinasWithExercises()
    {
        try {
            $rutinas = $this->rutinaModel->getAllWithExercises();
            echo json_encode(['success' => true, 'rutinas' => $rutinas]);
        } catch (Exception $e) {
            error_log("Error al obtener todas las rutinas: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Error al obtener las rutinas.']);
        }
    }

    public function getUser_has_Rutinas($userId)
    {
        // Verificar si el ID de usuario está presente
        if (!$userId) {
            echo json_encode(['success' => false, 'message' => 'ID de usuario no proporcionado.']);
            return;
        }
    
        try {
            // Obtener las rutinas del modelo
            $rutinas = $this->rutinaModel->getUser_has_Rutinas($userId);
    
            // Log para depuración
            error_log("Datos procesados antes de enviar JSON: " . print_r($rutinas, true));
    
            // Retornar JSON con las rutinas o un array vacío si no hay resultados
            echo json_encode([
                'success' => true,
                'rutinas' => $rutinas ?: [] // Si $rutinas está vacío, envía un array vacío
            ]);
        } catch (Exception $e) {
            // Loguear el error y enviar un mensaje genérico
            error_log("Error al obtener rutinas del usuario: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener rutinas vinculadas al usuario.'
            ]);
        }
    }
    public function addUserRutina($userId, $rutinaId)
    {
        try {
            require_once __DIR__ . '/../models/Rutina.php';
            $rutinaModel = new Rutina();
            return $rutinaModel->addUserRutina($userId, $rutinaId);
        } catch (Exception $e) {
            error_log("Error al agregar rutina al usuario: " . $e->getMessage());
            return false;
        }
    }
    public function deleteUserRutina($userId, $rutinaId) {
        require_once __DIR__ . '/../models/Rutina.php';
        $rutinaModel = new Rutina();
        return $rutinaModel->deleteUserRutina($userId, $rutinaId);
    } 
}
