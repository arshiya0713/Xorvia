import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'attendance', loadComponent: () => import('./pages/attendance/attendance.component').then(m => m.AttendanceComponent) },
      { path: 'user-info', loadComponent: () => import('./pages/user-info/user-info.component').then(m => m.UserInfoComponent) },
      { path: 'password', loadComponent: () => import('./pages/password/password.component').then(m => m.PasswordComponent) },
      { path: 'scanner', loadComponent: () => import('./pages/scanner/scanner.component').then(m => m.ScannerComponent) },
      { path: 'qr-generator', loadComponent: () => import('./pages/qr-generator/qr-generator.component').then(m => m.QrGeneratorComponent) },
      { path: 'reports/attendance', loadComponent: () => import('./pages/attendance-reports/attendance-reports.component').then(m => m.AttendanceReportsComponent) },
      { path: 'reports/performance', loadComponent: () => import('./pages/performance-report/performance-report.component').then(m => m.PerformanceReportComponent) },
      { path: 'reports/salary', loadComponent: () => import('./pages/salary-report/salary-report.component').then(m => m.SalaryReportComponent) },
      { path: 'reports/department', loadComponent: () => import('./pages/department-report/department-report.component').then(m => m.DepartmentReportComponent) },
      { path: 'account', loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];