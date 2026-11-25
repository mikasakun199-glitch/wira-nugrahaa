<?php
require __DIR__ . '/db.php';
$data = inputData();
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';
$statement = $pdo->prepare('SELECT id, name, email, phone, password_hash FROM users WHERE email = ? LIMIT 1');
$statement->execute([$email]);
$user = $statement->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) responseJson(['message' => 'Email atau kata sandi salah.'], 401);
unset($user['password_hash']);
responseJson(['message' => 'Login berhasil.', 'user' => $user]);
