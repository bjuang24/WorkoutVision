<?php

require_once __DIR__ . '/../services/Database.php';

class User
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getUserByEmail($email)
    {
        $query = "SELECT * FROM User WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createUser($nombre, $apellido, $email, $telefono, $password)
    {
        try {
            $query = "INSERT INTO User (nombre, apellido, email, telefono, password) VALUES (:nombre, :apellido, :email, :telefono, :password)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->bindParam(':apellido', $apellido, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);

            // Ejecutar la consulta
            if ($stmt->execute()) {
                // Retornar el ID del usuario recién creado
                return $this->db->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error al crear usuario: " . $e->getMessage());
            return false;
        }
    }
}
