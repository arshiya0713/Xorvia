import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">Settings</h1>
      <div class="card">
        <div class="section-title">Security</div>
        <div class="setting-row">
          <div>
            <div class="setting-name">Change Password</div>
            <div class="setting-desc">Update your account password</div>
          </div>
          <button class="action-btn" (click)="goToPassword()">Change</button>
        </div>
        <div class="divider"></div>
        <div class="section-title">Session</div>
        <div class="setting-row">
          <div>
            <div class="setting-name">Logout</div>
            <div class="setting-desc">Sign out of your account</div>
          </div>
          <button class="action-btn danger" (click)="logout()">Logout</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0; }
    .card {
      background: #fff; border-radius: 20px; padding: 28px;
      box-shadow: 0 4px 24px rgba(15,23,42,0.08); border: 1px solid #e0e7ff;
    }
    .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .setting-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 0; border-bottom: 1px solid #f1f5f9;
    }
    .setting-row:last-child { border-bottom: none; }
    .setting-name { font-size: 14px; font-weight: 600; color: #0f172a; }
    .setting-desc { font-size: 13px; color: #94a3b8; margin-top: 2px; }
    .divider { border-top: 1.5px solid #f1f5f9; margin: 20px 0; }
    .action-btn {
      padding: 8px 20px; border: none; border-radius: 10px;
      font-size: 13px; font-weight: 600; cursor: pointer;
      background: linear-gradient(90deg, #5b6cf6, #9d7bff); color: #fff;
    }
    .action-btn.danger { background: #fee2e2; color: #dc2626; }
    .action-btn:hover { opacity: 0.9; }
  `]
})
export class SettingsComponent {
  constructor(private router: Router) {}

  goToPassword() { this.router.navigate(['/password']); }

  logout() {
    localStorage.removeItem('xv_user');
    localStorage.removeItem('xv_token');
    this.router.navigate(['/login']);
  }
}