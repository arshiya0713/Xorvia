import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">Change Password</h1>
      <div class="card">
        <div class="lock-icon">🔒</div>
        <div class="field">
          <label>Old Password</label>
          <input type="password" [(ngModel)]="oldPassword" placeholder="Enter current password" />
        </div>
        <div class="field">
          <label>New Password</label>
          <input type="password" [(ngModel)]="newPassword" placeholder="Enter new password" />
        </div>
        <div class="field">
          <label>Confirm New Password</label>
          <input type="password" [(ngModel)]="confirmPassword" placeholder="Confirm new password" />
        </div>
        <div class="error" *ngIf="error">{{ error }}</div>
        <div class="success" *ngIf="success">{{ success }}</div>
        <button class="submit-btn" (click)="changePassword()" [disabled]="loading">
          {{ loading ? 'Changing...' : 'Change Password' }}
        </button>
      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0; }
    .card {
      background: #fff; border-radius: 20px; padding: 36px;
      max-width: 500px;
      box-shadow: 0 4px 24px rgba(15,23,42,0.08); border: 1px solid #e0e7ff;
    }
    .lock-icon {
      font-size: 40px; text-align: center; margin-bottom: 24px;
    }
    .field { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
    input {
      width: 100%; padding: 12px 16px;
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-size: 14px; outline: none; box-sizing: border-box;
    }
    input:focus { border-color: #5b6cf6; }
    .error { color: #dc2626; font-size: 13px; margin-bottom: 12px; }
    .success { color: #16a34a; font-size: 13px; margin-bottom: 12px; }
    .submit-btn {
      width: 100%; padding: 14px; border: none;
      background: linear-gradient(90deg, #5b6cf6, #9d7bff);
      color: #fff; border-radius: 10px;
      font-size: 15px; font-weight: 600; cursor: pointer;
    }
    .submit-btn:hover { opacity: 0.9; }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class PasswordComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';

  constructor(private http: HttpClient) {}

  changePassword() {
    this.error = '';
    this.success = '';

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.error = 'Please fill all fields';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'New passwords do not match';
      return;
    }
    if (this.newPassword.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    const user = JSON.parse(localStorage.getItem('xv_user') || '{}');
    this.loading = true;

    this.http.post<any>('http://localhost/Xorvia/backend/auth.php', {
      action: 'change_password',
      user_id: user.id,
      old_password: this.oldPassword,
      new_password: this.newPassword
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.success = 'Password changed successfully!';
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.error = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Server error. Please try again.';
      }
    });
  }
}