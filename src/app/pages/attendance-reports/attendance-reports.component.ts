import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">Attendance Reports</h1>

      <div class="loading" *ngIf="loading">Loading reports...</div>

      <div class="table-card" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Leaves</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of reports">
              <td class="month-cell">{{ row.month }}</td>
              <td><span class="badge present">{{ row.present }}</span></td>
              <td><span class="badge absent">{{ row.absent }}</span></td>
              <td><span class="badge leave">{{ row.leaves }}</span></td>
              <td>
                <button class="dl-btn" (click)="download(row)">↓ Download</button>
              </td>
            </tr>
            <tr *ngIf="reports.length === 0">
              <td colspan="5" class="empty">No reports found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0; }
    .loading { text-align: center; padding: 40px; color: #64748b; }
    .table-card {
      background: #fff; border-radius: 20px; overflow: hidden;
      box-shadow: 0 4px 24px rgba(15,23,42,0.08); border: 1px solid #e0e7ff;
    }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: linear-gradient(90deg, #5b6cf6, #9d7bff); }
    th { padding: 18px 28px; color: #fff; font-size: 14px; font-weight: 600; text-align: left; }
    td { padding: 18px 28px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #f8faff; }
    .month-cell { color: #1e293b; font-weight: 600; font-size: 15px; }
    .badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 40px; padding: 6px 14px;
      border-radius: 999px; font-weight: 700; font-size: 13px;
    }
    .present { background: #dcfce7; color: #16a34a; }
    .absent  { background: #ede9fe; color: #7c3aed; }
    .leave   { background: #dbeafe; color: #1d4ed8; }
    .dl-btn {
      padding: 8px 20px;
      background: linear-gradient(90deg, #5b6cf6, #9d7bff);
      color: #fff; border: none; border-radius: 10px;
      font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .dl-btn:hover { opacity: 0.9; }
    .empty { text-align: center; color: #94a3b8; padding: 40px; }
  `]
})
export class AttendanceReportsComponent implements OnInit {
  reports: any[] = [];
  loading = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loading = true;
    this.cdr.detectChanges();
    this.http.get<any>('http://localhost/Xorvia/backend/reports.php?action=attendance').subscribe({
      next: (res) => {
        if (res.success) this.reports = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  download(row: any) {
    const csv = `Month,Present,Absent,Leaves\n${row.month},${row.present},${row.absent},${row.leaves}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${row.month.replace(' ', '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}