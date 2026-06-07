import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">Account</h1>
      <div class="card">
        <div class="section-title">Profile Information</div>
        <div class="info-row">
          <span class="label">Name</span>
          <span class="value">{{ user?.name || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">{{ user?.email || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Employee Code</span>
          <span class="value">{{ user?.employee_code || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Role</span>
          <span class="value role">{{ user?.role === 'admin' ? 'Administrator' : 'Employee' }}</span>
        </div>
        <div class="divider"></div>
        <div class="section-title">Account Status</div>
        <div class="info-row">
          <span class="label">Status</span>
          <span class="badge active">Active</span>
        </div>
        <div class="info-row">
          <span class="label">Member Since</span>
          <span class="value">{{ user?.created_at ? (user.created_at | date:'MMMM d, yyyy') : '-' }}</span>
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
    .info-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 0; border-bottom: 1px solid #f1f5f9;
    }
    .info-row:last-child { border-bottom: none; }
    .label { font-size: 14px; color: #94a3b8; }
    .value { font-size: 14px; color: #0f172a; font-weight: 500; }
    .role { text-transform: capitalize; }
    .divider { border-top: 1.5px solid #f1f5f9; margin: 20px 0; }
    .badge { padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .active { background: #dcfce7; color: #16a34a; }
  `]
})
export class AccountComponent {
  user = JSON.parse(localStorage.getItem('xv_user') || '{}');
}