<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once 'config.php';
$conn = getConnection();

// Make sure table only ever has ONE row
$conn->query('CREATE TABLE IF NOT EXISTS qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active TINYINT(1) DEFAULT 1
)');

function generateCode($conn) {
    $code = str_pad(rand(100000, 999999), 6, '0', STR_PAD_LEFT);
    // Delete all old codes and insert fresh one — only one row ever
    $conn->query('DELETE FROM qr_codes');
    $stmt = $conn->prepare('INSERT INTO qr_codes (code, is_active) VALUES (?, 1)');
    $stmt->bind_param('s', $code);
    $stmt->execute();
    return $code;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query('SELECT * FROM qr_codes LIMIT 1');
    if ($result->num_rows === 0) {
        $code = generateCode($conn);
        echo json_encode(['success' => true, 'code' => $code, 'generated_at' => date('Y-m-d H:i:s')]);
    } else {
        $qr = $result->fetch_assoc();
        echo json_encode(['success' => true, 'code' => $qr['code'], 'generated_at' => $qr['generated_at']]);
    }
}

if ($method === 'POST') {
    $code = generateCode($conn);
    echo json_encode(['success' => true, 'code' => $code, 'generated_at' => date('Y-m-d H:i:s')]);
}

$conn->close();