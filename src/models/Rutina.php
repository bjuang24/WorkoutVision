<?php

require_once __DIR__ . '/../services/Database.php';

class Rutina
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAllWithExercises() {
        $query = "
            SELECT r.*, e.nombre_ejercicio, e.descripcion AS descripcion_ejercicio, reh.series, reh.repeticiones, reh.peso
            FROM Rutina r
            LEFT JOIN Rutina_has_Ejercicio reh ON r.idRutina = reh.Rutina_idRutina
            LEFT JOIN Ejercicio e ON reh.Ejercicio_idEjercicio = e.idEjercicio
        ";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $rutinas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Agrupar los ejercicios por rutina
        $result = [];
        foreach ($rutinas as $rutina) {
            $idRutina = $rutina['idRutina'];
            if (!isset($result[$idRutina])) {
                $result[$idRutina] = [
                    'idRutina' => $rutina['idRutina'],
                    'nombre_rutina' => $rutina['nombre_rutina'],
                    'nivel' => $rutina['nivel'],
                    'descripcion' => $rutina['descripcion'],
                    'ejercicios' => []
                ];
            }
            if (!empty($rutina['nombre_ejercicio'])) {
                $result[$idRutina]['ejercicios'][] = [
                    'nombre_ejercicio' => $rutina['nombre_ejercicio'],
                    'descripcion' => $rutina['descripcion_ejercicio'],
                    'series' => $rutina['series'],
                    'repeticiones' => $rutina['repeticiones'],
                    'peso' => $rutina['peso']
                ];
            }
        }
        return array_values($result);
    }
    public function getUser_has_Rutinas($userId)
    {
        $query = "
            SELECT 
                r.idRutina,
                r.nombre_rutina,
                r.nivel,
                r.descripcion,
                e.idEjercicio,
                e.nombre_ejercicio,
                e.descripcion AS descripcion_ejercicio,
                eh.series,
                eh.repeticiones,
                eh.peso
            FROM User_has_Rutina ur
            INNER JOIN Rutina r ON ur.Rutina_idRutina = r.idRutina
            LEFT JOIN Rutina_has_Ejercicio eh ON eh.Rutina_idRutina = r.idRutina
            LEFT JOIN Ejercicio e ON eh.Ejercicio_idEjercicio = e.idEjercicio
            WHERE ur.User_idUser = :userId
            ORDER BY r.idRutina;
        ";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Organizar los datos en un formato adecuado
        $rutinas = [];
        foreach ($result as $row) {
            $rutinaId = $row['idRutina'];
            if (!isset($rutinas[$rutinaId])) {
                $rutinas[$rutinaId] = [
                    'idRutina' => $rutinaId,
                    'nombre_rutina' => $row['nombre_rutina'],
                    'nivel' => $row['nivel'],
                    'descripcion' => $row['descripcion'],
                    'ejercicios' => []
                ];
            }
    
            // Si hay ejercicios, añádelos a la rutina
            if (!empty($row['idEjercicio'])) {
                $rutinas[$rutinaId]['ejercicios'][] = [
                    'idEjercicio' => $row['idEjercicio'],
                    'nombre_ejercicio' => $row['nombre_ejercicio'],
                    'descripcion' => $row['descripcion_ejercicio'],
                    'series' => $row['series'],
                    'repeticiones' => $row['repeticiones'],
                    'peso' => $row['peso']
                ];
            }
        }
    
        return array_values($rutinas);
    }
    public function addUserRutina($userId, $rutinaId)
    {
        try {
            $query = "INSERT INTO User_has_Rutina (User_idUser, Rutina_idRutina) VALUES (:userId, :rutinaId)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':rutinaId', $rutinaId, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error en la consulta addUserRutina: " . $e->getMessage());
            return false;
        }
    }
    public function deleteUserRutina($userId, $rutinaId) {
        $query = "DELETE FROM User_has_Rutina WHERE User_idUser = :userId AND Rutina_idRutina = :rutinaId";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':rutinaId', $rutinaId, PDO::PARAM_INT);
        return $stmt->execute();
    }
}