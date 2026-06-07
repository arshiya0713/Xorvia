import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">Dashboard</h1>
      <div class="stats-grid">

        <div class="stat-card" style="background: linear-gradient(135deg, #6a8ecb, #5b7bc9);">
          <div class="stat-top">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="badge">+12%</span>
          </div>
          <div class="stat-value">{{ totalUsers }}</div>
          <div class="stat-label">Total Users</div>
        </div>

        <div class="stat-card" style="background: linear-gradient(135deg, #9b5fb5, #b87dd9);">
          <div class="stat-top">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="badge">+8%</span>
          </div>
          <div class="stat-value">{{ attendanceToday }}</div>
          <div class="stat-label">Attendance Today</div>
        </div>

        <div class="stat-card" style="background: linear-gradient(135deg, #7b95c4, #6a88b8);">
          <div class="stat-top">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span class="badge">+23%</span>
          </div>
          <div class="stat-value">{{ activeSessions }}</div>
          <div class="stat-label">Active Sessions</div>
        </div>

        <div class="stat-card" style="background: linear-gradient(135deg, #b87fc9, #a060b8);">
          <div class="stat-top">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
            <span class="badge">+5%</span>
          </div>
          <div class="stat-value">{{ monthlyGrowth }}%</div>
          <div class="stat-label">Monthly Growth</div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    @media (max-width: 900px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .stat-card {
      border-radius: 20px;
      padding: 28px;
      color: #fff;
      transition: transform 0.2s;
      min-height: 170px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .stat-card:hover { transform: translateY(-4px); }
    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .badge {
      background: rgba(255,255,255,0.28);
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .stat-value {
      font-size: 44px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 14px;
      opacity: 0.88;
      font-weight: 500;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  attendanceToday = 0;
  activeSessions = 0;
  monthlyGrowth = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any>('http://localhost/Xorvia/backend/dashboard.php').subscribe({
      next: (res) => {
        if (res.success) {
          this.totalUsers      = res.data.total_users;
          this.attendanceToday = res.data.attendance_today;
          this.activeSessions  = res.data.active_sessions;
          this.monthlyGrowth   = res.data.monthly_growth;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.totalUsers      = 0;
        this.attendanceToday = 0;
        this.activeSessions  = 0;
        this.monthlyGrowth   = 18.5;
        this.cdr.detectChanges();
      }
    });
  }
}