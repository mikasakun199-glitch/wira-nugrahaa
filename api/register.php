<?php
require __DIR__ . '/db.php';
$data = inputData();
$name = trim($data['name'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$phone = trim($data['phone'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$phone || strlen($password) < 6) responseJson(['message' => 'Data pendaftaran belum lengkap.'], 400);

try {
  $statement = $pdo->prepare('INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)');
  $statement->execute([$name, $email, $phone, password_hash($password, PASSWORD_DEFAULT)]);
  responseJson(['message' => 'Akun berhasil dibuat.'], 201);
} catch (PDOException $error) {
  if ($error->errorInfo[1] === 1062) responseJson(['message' => 'Email sudah terdaftar.'], 409);
  responseJson(['message' => 'Gagal membuat akun.'], 500);
}
