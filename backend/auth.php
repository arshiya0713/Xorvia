<?php
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

$conn = getConnection();



if ($action === 'login') {
    $email    = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    $stmt = $conn->prepare('SELECT id, name, email, role, employee_code, password_hash FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password_hash'])) {
            unset($user['password_hash']);
            $token = base64_encode($user['id'] . ':' . time() . ':' . bin2hex(random_bytes(16)));
            echo json_encode(['success' => true, 'user' => $user, 'token' => $token]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Wrong password']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
}

if ($action === 'change_password') {
    $user_id     = $input['user_id'] ?? 0;
    $old_password = $input['old_password'] ?? '';
    $new_password = $input['new_password'] ?? '';

    $stmt = $conn->prepare('SELECT password_hash FROM users WHERE id = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($old_password, $user['password_hash'])) {
            $new_hash = password_hash($new_password, PASSWORD_BCRYPT);
            $stmt2 = $conn->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
            $stmt2->bind_param('si', $new_hash, $user_id);
            $stmt2->execute();
            echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Old password is incorrect']);
        }
    }
}
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
$conn->close();