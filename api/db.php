<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$host = '127.0.0.1';
$database = 'dapur_mas_bayu';
$username = 'root';
$password = '';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]);
} catch (PDOException $error) {
  http_response_code(500);
  echo json_encode(['message' => 'Database belum terhubung. Pastikan MySQL XAMPP aktif dan database sudah diimport.']);
  exit;
}

function inputData(): array {
  return json_decode(file_get_contents('php://input'), true) ?? $_POST;
}

function responseJson(array $data, int $status = 200): void {
  http_response_code($status);
  echo json_encode($data);
  exit;
}
