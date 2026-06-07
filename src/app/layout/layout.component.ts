import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-shell">
      <header class="main-header">
        <div class="brand-wrap">
          <div class="header-brand">Xorvia</div>
        </div>

        <div class="header-actions">
          <button class="profile-button" type="button" (click)="toggleUserMenu()">
            <span class="profile-avatar">👤</span>
            <span class="profile-name">{{ currentUser?.name || 'User' }}</span>
            <span class="profile-chevron">▾</span>
          </button>

          <div class="user-menu" *ngIf="showUserMenu">
            <button type="button" class="menu-link" (click)="navigate('/account')">Account</button>
            <button type="button" class="menu-link" (click)="navigate('/settings')">Settings</button>
            <button type="button" class="menu-link logout" (click)="logout()">Logout</button>
          </div>
        </div>
      </header>

      <div class="page-shell">
        <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
          <button class="collapse-btn" type="button" (click)="toggleSidebar()">
            <span>{{ sidebarCollapsed ? '›' : '‹' }}</span>
          </button>

          <nav class="sidebar-menu">
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              <span class="icon">▣</span>
              <span class="label" *ngIf="!sidebarCollapsed">Dashboard</span>
            </a>
            <a routerLink="/attendance" routerLinkActive="active" *ngIf="currentUser?.role === 'admin'">
              <span class="icon">🗓️</span>
              <span class="label" *ngIf="!sidebarCollapsed">Attendance</span>
            </a>
            <a routerLink="/user-info" routerLinkActive="active" *ngIf="currentUser?.role === 'admin'">
              <span class="icon">👥</span>
              <span class="label" *ngIf="!sidebarCollapsed">User Info</span>
            </a>
            <a routerLink="/password" routerLinkActive="active">
              <span class="icon">🔒</span>
              <span class="label" *ngIf="!sidebarCollapsed">Password</span>
            </a>
            <a routerLink="/scanner" routerLinkActive="active" *ngIf="currentUser?.role !== 'admin'">
              <span class="icon">📷</span>
              <span class="label" *ngIf="!sidebarCollapsed">Scanner</span>
            </a>
            <a routerLink="/qr-generator" routerLinkActive="active" *ngIf="currentUser?.role === 'admin'">
              <span class="icon">🔳</span>
              <span class="label" *ngIf="!sidebarCollapsed">QR Generator</span>
            </a>
          </nav>

          <div class="report-menu">
            <button class="report-toggle" type="button" (click)="toggleReportMenu()">
              <span class="icon">📄</span>
              <span class="label" *ngIf="!sidebarCollapsed">Reports</span>
              <span class="chevron" *ngIf="!sidebarCollapsed">{{ reportsOpen ? '▾' : '▸' }}</span>
            </button>

            <div class="submenu" *ngIf="reportsOpen && !sidebarCollapsed">
              <a routerLink="/reports/attendance" routerLinkActive="active">Attendance Reports</a>
              <a routerLink="/reports/performance" routerLinkActive="active">Performance Report</a>
              <a routerLink="/reports/salary" routerLinkActive="active">Salary Report</a>
              <a routerLink="/reports/department" routerLinkActive="active">Department Report</a>
            </div>
          </div>
        </aside>

        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #eef2ff;
        color: #0f172a;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .layout-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .main-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.75rem;
        min-height: 72px;
        background: linear-gradient(90deg, #4c6ef5 0%, #9e76fd 100%);
        color: white;
        position: relative;
        box-shadow: 0 14px 40px rgba(15, 23, 42, 0.14);
        overflow: visible;
      }
      .brand-wrap {
        display: flex;
        align-items: center;
      }
      .header-brand {
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: 0.02em;
      }
      .header-actions {
        position: relative;
        overflow: visible;
      }
      .profile-button {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.85rem 1rem;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.12);
        color: white;
        cursor: pointer;
        font-size: 0.95rem;
        white-space: nowrap;
      }
      .profile-avatar {
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
      }
      .profile-name {
        font-weight: 600;
      }
      .profile-chevron {
        font-size: 0.9rem;
      }
      .user-menu {
        position: absolute;
        right: 0;
        top: 78px;
        width: 220px;
        border-radius: 1rem;
        background: white;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);
        overflow: hidden;
        z-index: 10;
      }
      .menu-link {
        width: 100%;
        padding: 0.95rem 1.15rem;
        border: none;
        background: transparent;
        text-align: left;
        color: #0f172a;
        font-size: 0.97rem;
        cursor: pointer;
      }
      .menu-link:hover {
        background: #f8fafc;
      }
      .logout {
        color: #dc2626;
        font-weight: 700;
      }
      .page-shell {
        display: flex;
        flex: 1;
      }
      .sidebar {
        width: 250px;
        min-width: 250px;
        background: #0b1736;
        padding: 1.35rem 0.85rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .sidebar.collapsed {
        width: 90px;
        min-width: 90px;
      }
      .collapse-btn {
        border: none;
        background: transparent;
        color: #94a3b8;
        align-self: flex-end;
        cursor: pointer;
        padding: 0.75rem;
        font-size: 1rem;
      }
      .sidebar-menu {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .sidebar-menu a,
      .report-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.95rem 1rem;
        border-radius: 1rem;
        color: #cbd5e1;
        text-decoration: none;
        background: transparent;
        border: none;
        font-size: 0.96rem;
        cursor: pointer;
        transition: background 0.25s ease, transform 0.2s ease;
      }
      .sidebar-menu a.active,
      .sidebar-menu a:hover,
      .report-toggle:hover {
        background: rgba(255, 255, 255, 0.08);
        color: white;
        transform: translateX(1px);
      }
      .sidebar-menu a.active {
        background: rgba(96, 111, 237, 0.2);
      }
      .sidebar-menu a .icon,
      .report-toggle .icon {
        width: 2rem;
        text-align: center;
        font-size: 1.1rem;
      }
      .label {
        white-space: nowrap;
      }
      .report-menu {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .chevron {
        margin-left: auto;
        opacity: 0.8;
      }
      .submenu {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        padding-left: 1.75rem;
      }
      .submenu a {
        display: block;
        padding: 0.75rem 0.85rem;
        border-radius: 0.85rem;
        color: #d8e0f6;
        background: transparent;
        text-decoration: none;
      }
      .submenu a:hover,
      .submenu a.active {
        background: rgba(255, 255, 255, 0.08);
        color: white;
      }
      .content-area {
        flex: 1;
        padding: 2rem;
        overflow: auto;
      }
      @media (max-width: 960px) {
        .page-shell {
          flex-direction: column;
        }
        .sidebar {
          width: 100%;
          min-width: 100%;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .sidebar.collapsed {
          width: 100%;
        }
        .sidebar-menu,
        .report-menu,
        .submenu {
          width: 100%;
        }
        .content-area {
          padding: 1.25rem;
        }
      }
      @media (max-width: 900px) {
        .page-shell {
          flex-direction: column;
        }
        .sidebar {
          width: 100%;
          flex-direction: row;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          gap: 1rem;
        }
        .sidebar-menu,
        .report-section {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .content-area {
          padding: 1rem;
        }
      }
    `
  ]
})
export class LayoutComponent {
  sidebarCollapsed = false;
  reportsOpen = true;
  showUserMenu = false;
  currentUser: any = JSON.parse(localStorage.getItem('xv_user') || '{}');

  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleReportMenu() {
    this.reportsOpen = !this.reportsOpen;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
  navigate(path: string) {
  this.showUserMenu = false;
  this.router.navigate([path]);
}
  logout() {
    localStorage.removeItem('xv_token');
    this.router.navigate(['/login']);
  }
}
