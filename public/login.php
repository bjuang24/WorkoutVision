<?php

require_once __DIR__ . '/../src/controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $auth = new AuthController();
    echo json_encode($auth->login($email, $password));
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
