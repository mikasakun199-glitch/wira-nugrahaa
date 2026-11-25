<?php
require __DIR__ . '/db.php';
$number = strtoupper(trim($_GET['number'] ?? ''));
if (!$number) responseJson(['message' => 'Nomor pesanan wajib diisi.'], 400);

$statement = $pdo->prepare('SELECT order_number, customer_name, delivery_method, status, total, created_at FROM orders WHERE order_number = ? LIMIT 1');
$statement->execute([$number]);
$order = $statement->fetch();
if (!$order) responseJson(['message' => 'Pesanan tidak ditemukan.'], 404);

$items = $pdo->prepare('SELECT product_name AS name, quantity, subtotal AS total FROM order_items WHERE order_id = (SELECT id FROM orders WHERE order_number = ?)');
$items->execute([$number]);
$order['items'] = $items->fetchAll();
$order['status'] = ['received' => 'Pesanan Diterima', 'processing' => 'Sedang Diproses', 'ready' => 'Siap Diambil / Diantar', 'completed' => 'Selesai', 'cancelled' => 'Dibatalkan'][$order['status']] ?? $order['status'];
$order['method'] = $order['delivery_method'] === 'pickup' ? 'Ambil Sendiri' : 'Diantar';
responseJson($order);
