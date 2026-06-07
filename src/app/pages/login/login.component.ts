import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">X</div>
          <h1>Xorvia</h1>
          <p>Sign in to your account</p>
        </div>
        <div class="field">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="admin@xorvia.com" (keyup.enter)="login()" />
        </div>
        <div class="field">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="login()" />
        </div>
        <div class="error" *ngIf="error">{{ error }}</div>
        <button class="login-btn" (click)="login()" [disabled]="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #1a2035 0%, #2d3561 50%, #5b4a8b 100%);
    }
    .login-card {
      background: #fff; border-radius: 20px; padding: 40px;
      width: 100%; max-width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .login-header { text-align: center; margin-bottom: 32px; }
    .logo {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #5b6cf6, #9d7bff);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      font-size: 28px; font-weight: 800; color: #fff;
    }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
    p { color: #94a3b8; font-size: 14px; margin: 0; }
    .field { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
    input {
      width: 100%; padding: 12px 16px;
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-size: 14px; outline: none; box-sizing: border-box;
    }
    input:focus { border-color: #5b6cf6; }
    .error { color: #dc2626; font-size: 13px; margin-bottom: 16px; }
    .login-btn {
      width: 100%; padding: 14px;
      background: linear-gradient(90deg, #5b6cf6, #9d7bff);
      color: #fff; border: none; border-radius: 10px;
      font-size: 15px; font-weight: 600; cursor: pointer;
    }
    .login-btn:hover { opacity: 0.9; }
    .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) this.router.navigate(['/dashboard']);
        else this.error = res.message || 'Login failed';
      },
      error: () => {
        this.loading = false;
        this.error = 'Password is incorrect';
      }
    });
  }
}