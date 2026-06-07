import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">Attendance</h1>

      <!-- Admin filter -->
      <div class="filter-row" *ngIf="isAdmin">
        <select [(ngModel)]="selectedUserId" (change)="loadAttendance()" class="user-select">
          <option value="0">All Employees</option>
          <option *ngFor="let u of employees" [value]="u.id">
            {{ u.name }} ({{ u.employee_code }})
          </option>
        </select>
      </div>

      <div class="loading" *ngIf="loading">Loading attendance...</div>

      <div class="table-card" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th *ngIf="isAdmin && selectedUserId == 0">Employee</th>
              <th>Date</th>
              <th>Day</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of records" [class.weekend]="isWeekend(row.date)">
              <td *ngIf="isAdmin && selectedUserId == 0">
                {{ row.name }}
                <span class="emp-code">{{ row.employee_code }}</span>
              </td>
              <td>{{ row.date }}</td>
              <td [class.weekend-label]="isWeekend(row.date)">
                {{ getDayName(row.date) }}
              </td>
              <td>{{ row.check_in ? formatTime(row.check_in) : '-' }}</td>
              <td>{{ row.check_out ? formatTime(row.check_out) : '-' }}</td>
              <td>
                <span *ngIf="isWeekend(row.date)" class="badge weekend-badge">Weekend</span>
                <span *ngIf="!isWeekend(row.date)" class="badge"
                  [class.present]="row.status === 'Present'"
                  [class.absent]="row.status === 'Absent'"
                  [class.leave]="row.status === 'Leave'">
                  {{ row.status }}
                </span>
              </td>
            </tr>
            <tr *ngIf="records.length === 0">
              <td colspan="6" class="empty">No attendance records found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0; }
    .filter-row { display: flex; gap: 12px; align-items: center; }
    .user-select {
      padding: 10px 16px; border: 1.5px solid #e2e8f0;
      border-radius: 10px; font-size: 14px; font-weight: 500;
      background: #fff; outline: none; cursor: pointer;
      min-width: 250px;
    }
    .user-select:focus { border-color: #5b6cf6; }
    .loading { text-align: center; padding: 40px; color: #64748b; }
    .table-card {
      background: #fff; border-radius: 20px; overflow: hidden;
      box-shadow: 0 4px 24px rgba(15,23,42,0.08); border: 1px solid #e0e7ff;
    }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: linear-gradient(90deg, #5b6cf6, #9d7bff); }
    th { padding: 18px 24px; color: #fff; font-size: 14px; font-weight: 600; text-align: left; }
    td { padding: 16px 24px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #f8faff; }
    tbody tr.weekend { background: #fafafa; }
    tbody tr.weekend td { color: #94a3b8; }
    .emp-code { font-size: 11px; color: #94a3b8; margin-left: 6px; }
    .weekend-label { color: #94a3b8; font-style: italic; }
    .badge { padding: 6px 16px; border-radius: 999px; font-weight: 600; font-size: 13px; }
    .present { background: #dbeafe; color: #1d4ed8; }
    .absent  { background: #ede9fe; color: #7c3aed; }
    .leave   { background: #dcfce7; color: #16a34a; }
    .weekend-badge { background: #f1f5f9; color: #94a3b8; }
    .empty   { text-align: center; color: #94a3b8; padding: 40px; }
  `]
})
export class AttendanceComponent implements OnInit {
  records: any[] = [];
  employees: any[] = [];
  loading = false;
  isAdmin = false;
  selectedUserId = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser;
    this.isAdmin = user?.role === 'admin';
    if (this.isAdmin) this.loadEmployees();
    this.loadAttendance();
  }

  loadEmployees() {
  this.http.get<any>('http://localhost/Xorvia/backend/users.php').subscribe({
    next: (res) => {
      if (res.success) this.employees = res.data.filter((u: any) => u.role !== 'Admin');
        this.cdr.detectChanges();
      }
    });
  }

  loadAttendance() {
    this.loading = true;
    this.cdr.detectChanges();

    const user = this.authService.currentUser;
    let url = '';

    if (this.isAdmin) {
      url = this.selectedUserId > 0
        ? `http://localhost/Xorvia/backend/attendance.php?user_id=${this.selectedUserId}`
        : 'http://localhost/Xorvia/backend/attendance.php';
    } else {
      url = `http://localhost/Xorvia/backend/attendance.php?user_id=${user?.id}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success) {
          // Filter out weekends from absent records
          this.records = res.data.filter((r: any) => {
            if (r.status === 'Absent' && this.isWeekend(r.date)) return false;
            return true;
          });
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isWeekend(dateStr: string): boolean {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }

  getDayName(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  }

  formatTime(time: string): string {
    if (!time) return '-';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m} ${ampm}`;
  }
}