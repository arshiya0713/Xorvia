import { Component } from '@angular/core';

@Component({
  selector: 'app-department-report',
  standalone: true,
  template: `
    <section class="page-shell">
      <div class="page-head">
        <h1>Department Report</h1>
      </div>
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Total Staff</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
              <th>Avg Performance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="dept-cell">Human Resources</td>
              <td><span class="badge-count">8</span></td>
              <td><span class="badge present">7</span></td>
              <td><span class="badge absent">1</span></td>
              <td><span class="percentage">87.5%</span></td>
              <td><span class="rating">4.6/5.0</span></td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="dept-cell">Engineering</td>
              <td><span class="badge-count">12</span></td>
              <td><span class="badge present">11</span></td>
              <td><span class="badge absent">1</span></td>
              <td><span class="percentage">91.7%</span></td>
              <td><span class="rating">4.7/5.0</span></td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="dept-cell">Sales</td>
              <td><span class="badge-count">10</span></td>
              <td><span class="badge present">9</span></td>
              <td><span class="badge absent">1</span></td>
              <td><span class="percentage">90.0%</span></td>
              <td><span class="rating">4.4/5.0</span></td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="dept-cell">Finance</td>
              <td><span class="badge-count">6</span></td>
              <td><span class="badge present">6</span></td>
              <td><span class="badge absent">0</span></td>
              <td><span class="percentage">100.0%</span></td>
              <td><span class="rating">4.8/5.0</span></td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .page-shell {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-head h1 {
      margin: 0;
      font-size: 2rem;
      color: #0f172a;
    }
    .table-card {
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
      border: 1px solid #e0e7ff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead tr {
      background: linear-gradient(90deg, #5b6cf6 0%, #9d7bff 100%);
    }
    th {\n      text-align: left;
      padding: 18px 28px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    td {
      text-align: left;
      padding: 18px 28px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    tbody tr:hover {
      background: #f8faff;
    }
    .dept-cell {
      color: #1e293b;
      font-weight: 600;
      font-size: 15px;
    }
    .badge-count {
      display: inline-block;
      padding: 0.35rem 0.65rem;
      background: #f1f5f9;
      border-radius: 6px;
      font-weight: 600;
      color: #1e293b;
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
    }
    .badge.present {
      background: #dcfce7;
      color: #16a34a;
    }
    .badge.absent {
      background: #fee2e2;
      color: #dc2626;
    }
    .percentage {
      font-weight: 600;
      color: #0f172a;
    }
    .rating {
      display: inline-block;
      padding: 0.35rem 0.65rem;
      background: #dbeafe;
      color: #0284c7;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
    }
    .dl-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e0e7ff;
      background: #f8faff;
      color: #5b6cf6;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
    }
    .dl-btn:hover {
      background: #eef2ff;
    }
  `]
})
export class DepartmentReportComponent {}
