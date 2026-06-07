<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';
$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Auto mark absent for yesterday if not weekend
$yesterday = date('Y-m-d', strtotime('-1 day'));
$dayOfWeek = date('N', strtotime('-1 day')); // 6=Sat, 7=Sun
if ($dayOfWeek < 6) {
    $users = $conn->query("SELECT id FROM users WHERE role = 'employee'");
    while ($u = $users->fetch_assoc()) {
        $uid = $u['id'];
        $check = $conn->query("SELECT id FROM attendance WHERE user_id = $uid AND date = '$yesterday'");
        if ($check->num_rows === 0) {
            $conn->query("INSERT INTO attendance (user_id, date, status) VALUES ($uid, '$yesterday', 'Absent')");
        }
    }
}

if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? 0;

    if ($user_id) {
        $stmt = $conn->prepare('SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC LIMIT 30');
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query('SELECT a.*, u.name, u.employee_code FROM attendance a JOIN users u ON a.user_id = u.id ORDER BY a.date DESC LIMIT 100');
    }

    $records = [];
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $records]);
}

if ($method === 'POST') {
    $input   = json_decode(file_get_contents('php://input'), true);
    $user_id = $input['user_id'] ?? 0;
    $qr_code = $input['qr_code'] ?? '';
    $today   = date('Y-m-d');
    $now     = date('H:i:s');

    $stmt = $conn->prepare('SELECT id FROM qr_codes WHERE code = ? AND is_active = 1');
    $stmt->bind_param('s', $qr_code);
    $stmt->execute();
    $qr_result = $stmt->get_result();

    if ($qr_result->num_rows === 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired QR code']);
        $conn->close();
        exit();
    }

    $stmt2 = $conn->prepare('SELECT id, check_in, check_out FROM attendance WHERE user_id = ? AND date = ?');
    $stmt2->bind_param('is', $user_id, $today);
    $stmt2->execute();
    $existing = $stmt2->get_result()->fetch_assoc();

    if (!$existing) {
        $stmt3 = $conn->prepare('INSERT INTO attendance (user_id, date, check_in, status) VALUES (?, ?, ?, "Present")');
        $stmt3->bind_param('iss', $user_id, $today, $now);
        $stmt3->execute();
        echo json_encode(['success' => true, 'message' => 'Checked in at ' . date('h:i A')]);
    } elseif (!$existing['check_out']) {
        $stmt3 = $conn->prepare('UPDATE attendance SET check_out = ? WHERE user_id = ? AND date = ?');
        $stmt3->bind_param('sis', $now, $user_id, $today);
        $stmt3->execute();
        echo json_encode(['success' => true, 'message' => 'Checked out at ' . date('h:i A')]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Already checked in and out today']);
    }
}

$conn->close();