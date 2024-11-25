<?php

require_once __DIR__ . '/../src/controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];
    $password = $_POST['password'];
    $auth = new AuthController();
    echo json_encode($auth->register($nombre, $apellido, $email, $telefono, $password));
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
