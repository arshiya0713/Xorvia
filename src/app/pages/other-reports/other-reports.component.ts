import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-other-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <h1 class="page-title">{{ pageTitle }}</h1>

      <div class="loading" *ngIf="loading">Loading...</div>

      <div class="reports-list" *ngIf="!loading">
        <div class="report-item" *ngFor="let r of reports">
          <div class="report-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="report-info">
            <div class="report-name">{{ r.name }}</div>
            <div class="report-meta">{{ r.created_at }} • {{ r.file_size }}</div>
          </div>
          <button class="dl-btn" (click)="download(r)">↓ Download</button>
        </div>
        <div class="empty" *ngIf="reports.length === 0">No reports available</div>
      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0; }
    .loading { text-align: center; padding: 40px; color: #64748b; }
    .reports-list { display: flex; flex-direction: column; gap: 16px; }
    .report-item {
      background: #fff; border-radius: 16px; padding: 20px 24px;
      display: flex; align-items: center; gap: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      border: 1px solid #e0e7ff;
      transition: box-shadow 0.2s;
    }
    .report-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .report-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      background: linear-gradient(135deg, #5b6cf6, #9d7bff);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .report-info { flex: 1; }
    .report-name { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
    .report-meta { font-size: 13px; color: #94a3b8; }
    .dl-btn {
      padding: 10px 20px; border: none;
      background: linear-gradient(90deg, #5b6cf6, #9d7bff);
      color: #fff; border-radius: 10px;
      font-size: 13px; font-weight: 600; cursor: pointer;
      white-space: nowrap;
    }
    .dl-btn:hover { opacity: 0.9; }
    .empty { text-align: center; color: #94a3b8; padding: 40px; }
  `]
})
export class OtherReportsComponent implements OnInit {
  reports: any[] = [];
  loading = false;
  pageTitle = 'Reports';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Set title based on route
    this.route.url.subscribe(segments => {
      const path = segments[segments.length - 1]?.path;
      if (path === 'performance') this.pageTitle = 'Performance Report';
      else if (path === 'salary') this.pageTitle = 'Salary Report';
      else if (path === 'department') this.pageTitle = 'Department Report';
      else this.pageTitle = 'Other Reports';
    });

    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.cdr.detectChanges();
    this.http.get<any>('http://localhost/Xorvia/backend/reports.php?action=other').subscribe({
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

  download(r: any) {
    const csv = `Report,Date,Size\n${r.name},${r.created_at},${r.file_size}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${r.name.replace(' ', '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}