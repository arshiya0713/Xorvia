<?php
require_once 'config.php';

$conn = getConnection();

$totalUsers = $conn->query('SELECT COUNT(*) as count FROM users WHERE role = "employee"')->fetch_assoc()['count'];

$today = date('Y-m-d');

$todayAttendance = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE date = '$today' AND status = 'Present'")->fetch_assoc()['count'];

$activeSessions = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE date = '$today' AND check_in IS NOT NULL AND check_out IS NULL")->fetch_assoc()['count'];

echo json_encode([
    'success' => true,
    'data' => [
        'total_users'      => (int)$totalUsers,
        'attendance_today' => (int)$todayAttendance,
        'active_sessions'  => (int)$activeSessions,
        'monthly_growth'   => 18.5
    ]
]);

$conn->close();