<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once 'config.php';

$conn = getConnection();
$action = $_GET['action'] ?? 'attendance';

if ($action === 'attendance') {
    $result = $conn->query("
        SELECT 
            DATE_FORMAT(date, '%M %Y') as month,
            DATE_FORMAT(date, '%Y-%m') as month_key,
            SUM(status = 'Present') as present,
            SUM(status = 'Absent') as absent,
            SUM(status = 'Leave') as leaves
        FROM attendance
        GROUP BY month_key
        ORDER BY month_key DESC
        LIMIT 12
    ");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $data]);
}
if ($action === 'other') {
    $reports = [
        ['name' => 'Performance Report', 'type' => 'performance', 'file_size' => '2.5 MB', 'created_at' => '2026-05-10'],
        ['name' => 'Salary Report', 'type' => 'salary', 'file_size' => '1.8 MB', 'created_at' => '2026-05-05'],
        ['name' => 'Department Report', 'type' => 'department', 'file_size' => '3.2 MB', 'created_at' => '2026-05-01'],
    ];
    echo json_encode(['success' => true, 'data' => $reports]);
}

$conn->close();