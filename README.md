# XORVIA — Attendance Management System

A web-based attendance management system developed using Angular, PHP, and MySQL. XORVIA streamlines employee attendance tracking through QR-code-based check-ins, role-based access control, and automated attendance reporting.

## Features

* Secure role-based authentication (Admin / Employee)
* QR code attendance system with automatic QR rotation every 30 seconds
* Real-time attendance dashboard and analytics
* Employee management (Create, Update, Delete)
* Monthly attendance reports 
* Automatic absence marking for missed attendance records
* Password management and update functionality
* Responsive and user-friendly interface

## Tech Stack

### Frontend

* Angular 17
* TypeScript
* SCSS

### Backend

* PHP

### Database

* MySQL

### Development Tools

* XAMPP
* VS Code
* Git & GitHub

## Prerequisites

* Node.js 18+
* Angular CLI

  ```bash
  npm install -g @angular/cli
  ```
* XAMPP (Apache + MySQL)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/arshiya0713/Xorvia.git
cd Xorvia
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the database

1. Start Apache and MySQL in XAMPP.
2. Create a database named:

```sql
xorvia_db
```

3. Import:

```text
backend/database.sql
```

into MySQL.

### 4. Configure backend

Ensure the database configuration in:

```text
backend/config.php
```

matches your local MySQL setup.

### 5. Run the Angular application

```bash
ng serve
```

Navigate to:

```text
http://localhost:4200
```

## Project Structure

```text
Xorvia/
├── backend/
├── src/
├── public/
├── package.json
├── angular.json
└── README.md
```

## Future Enhancements

* Email notifications
* Biometric integration
* Department-wise analytics
* Mobile application support
* Cloud deployment



