import { Component } from '@angular/core';

@Component({
  selector: 'app-salary-report',
  standalone: true,
  template: `
    <section class="page-shell">
      <div class="page-head">
        <h1>Salary Report</h1>
      </div>
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Base Salary</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="name-cell">John Smith</td>
              <td>May 2026</td>
              <td class="amount">$5,000</td>
              <td class="amount bonus">+$500</td>
              <td class="amount deduction">-$420</td>
              <td class="amount net">$5,080</td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="name-cell">Sarah Johnson</td>
              <td>May 2026</td>
              <td class="amount">$4,500</td>
              <td class="amount bonus">+$300</td>
              <td class="amount deduction">-$378</td>
              <td class="amount net">$4,422</td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="name-cell">Michael Brown</td>
              <td>May 2026</td>
              <td class="amount">$4,800</td>
              <td class="amount bonus">+$400</td>
              <td class="amount deduction">-$403</td>
              <td class="amount net">$4,797</td>
              <td><button class="dl-btn">↓ Download</button></td>
            </tr>
            <tr>
              <td class="name-cell">Emily Davis</td>
              <td>May 2026</td>
              <td class="amount">$4,200</td>
              <td class="amount bonus">+$250</td>
              <td class="amount deduction">-$353</td>
              <td class="amount net">$4,097</td>
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
    .amount {
      font-weight: 600;
      color: #1e293b;
      text-align: right;
    }
    .amount.bonus {
      color: #16a34a;
    }
    .amount.deduction {
      color: #dc2626;
    }
    .amount.net {
      color: #5b6cf6;
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
export class SalaryReportComponent {}
