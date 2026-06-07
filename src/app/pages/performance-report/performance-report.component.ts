import { Component } from '@angular/core';

@Component({
  selector: 'app-performance-report',
  standalone: true,
  template: `
    <section class="page-shell">
      <div class="page-head">
        <h1>Performance Report</h1>
      </div>
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Rating</th>
              <th>Tasks Completed</th>
              <th>Efficiency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="name-cell">John Smith</td>
              <td><span class="badge excellent">4.8/5.0</span></td>
              <td>47</td>
              <td><div class="progress"><div class="bar" style="width: 96%"></div></div></td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="name-cell">Sarah Johnson</td>
              <td><span class="badge very-good">4.5/5.0</span></td>
              <td>43</td>
              <td><div class="progress"><div class="bar" style="width: 90%"></div></div></td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="name-cell">Michael Brown</td>
              <td><span class="badge good">4.2/5.0</span></td>
              <td>39</td>
              <td><div class="progress"><div class="bar" style="width: 84%"></div></div></td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="name-cell">Emily Davis</td>
              <td><span class="badge good">4.0/5.0</span></td>
              <td>36</td>
              <td><div class="progress"><div class="bar" style="width: 80%"></div></div></td>
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
    th {
      text-align: left;
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
    .name-cell {
      color: #1e293b;
      font-weight: 600;
      font-size: 15px;
    }
    .badge {
      display: inline-block;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
    }
    .badge.excellent {
      background: #dcfce7;
      color: #16a34a;
    }
    .badge.very-good {
      background: #dbeafe;
      color: #0284c7;
    }
    .badge.good {
      background: #fef3c7;
      color: #d97706;
    }
    .progress {
      width: 100px;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }
    .progress .bar {
      height: 100%;
      background: linear-gradient(90deg, #5b6cf6 0%, #9d7bff 100%);
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
export class PerformanceReportComponent {}
