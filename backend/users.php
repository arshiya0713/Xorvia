<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$conn = getConnection();

if ($method === 'GET') {
    $result = $conn->query('SELECT id, name, phone, address, whatsapp, status, employee_code, email, role FROM users ORDER BY id');
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $users]);

} elseif ($method === 'POST') {
    $name           = $input['name'] ?? '';
    $phone          = $input['phone'] ?? '';
    $address        = $input['address'] ?? '';
    $whatsapp       = $input['whatsapp'] ?? '';
    $status         = $input['status'] ?? 'Active';
    $employee_code  = $input['employee_code'] ?? '';
    $email          = $input['email'] ?? '';
    $password       = $input['password'] ?? 'password';
    $password_hash  = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare('INSERT INTO users (name, phone, address, whatsapp, status, employee_code, email, password_hash) VALUES (?,?,?,?,?,?,?,?)');
    $stmt->bind_param('ssssssss', $name, $phone, $address, $whatsapp, $status, $employee_code, $email, $password_hash);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $conn->error]);
    }

} elseif ($method === 'PUT') {
    $id             = $input['id'] ?? 0;
    $name           = $input['name'] ?? '';
    $phone          = $input['phone'] ?? '';
    $address        = $input['address'] ?? '';
    $whatsapp       = $input['whatsapp'] ?? '';
    $status         = $input['status'] ?? 'Active';
    $employee_code  = $input['employee_code'] ?? '';
    $email          = $input['email'] ?? '';

    $stmt = $conn->prepare('UPDATE users SET name=?, phone=?, address=?, whatsapp=?, status=?, employee_code=?, email=? WHERE id=?');
    $stmt->bind_param('sssssssi', $name, $phone, $address, $whatsapp, $status, $employee_code, $email, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Updated successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $conn->error]);
    }

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $stmt = $conn->prepare('DELETE FROM users WHERE id=?');
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Deleted successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $conn->error]);
    }
}

$conn->close();