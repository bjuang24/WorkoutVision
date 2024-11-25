<?php

class Database
{
    private static $connection = null;

    public function __construct()
    {
        $env = parse_ini_file(__DIR__ . '/../../.env'); // Lee el archivo .env

        $host = $env['DB_HOST'] ?? 'localhost';
        $dbname = $env['DB_DATABASE'] ?? ''; // Cambiado a DB_DATABASE
        $user = $env['DB_USER'] ?? '';
        $pass = $env['DB_PASS'] ?? '';

        try {
            self::$connection = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
            self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            error_log("Error PDO: " . $e->getMessage());
            throw new Exception("Error de conexión a la base de datos");
        }
    }

    public static function getConnection()
    {
        if (self::$connection === null) {
            new self();
        }
        return self::$connection;
    }
}
