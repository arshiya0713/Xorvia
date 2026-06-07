import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <section class="page-shell">
      <div class="page-head">
        <div>
          <h1>User Information</h1>
          <p>Manage employees and add new users.</p>
        </div>
        <button class="create-button" type="button" (click)="toggleForm()">
          {{ showForm ? '✕ Cancel' : '+ Add New User' }}
        </button>
      </div>

      <div class="form-card" *ngIf="showForm">
        <form (ngSubmit)="saveUser()" #userForm="ngForm">
          <div class="form-row">
            <label>Name
              <input type="text" [(ngModel)]="formUser.name" name="name" required />
            </label>
            <label>Employee Code
              <input type="text" [(ngModel)]="formUser.employee_code" name="employee_code" />
            </label>
          </div>
          <div class="form-row">
            <label>Phone
              <input type="tel" [(ngModel)]="formUser.phone" name="phone" required />
            </label>
            <label>WhatsApp
              <input type="tel" [(ngModel)]="formUser.whatsapp" name="whatsapp" />
            </label>
          </div>
          <div class="form-row">
            <label>Email
              <input type="email" [(ngModel)]="formUser.email" name="email" />
            </label>
            <label>Address
              <input type="text" [(ngModel)]="formUser.address" name="address" />
            </label>
          </div>
          <div class="form-row">
            <label>Status
              <select [(ngModel)]="formUser.status" name="status">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <label *ngIf="!editingUser">Password
              <input type="password" [(ngModel)]="formUser.password" name="password" placeholder="Default: password" />
            </label>
          </div>
          <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
          <div class="form-actions">
            <button type="submit" [disabled]="!userForm.form.valid">
              {{ editingUser ? 'Update User' : 'Save User' }}
            </button>
          </div>
        </form>
      </div>

      <div class="loading" *ngIf="loading">Loading users...</div>

      <div class="table-card" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>S.No</th><th>Name</th><th>Phone</th><th>WhatsApp</th>
              <th>Address</th><th>Status</th><th>Employee Code</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.whatsapp }}</td>
              <td>{{ user.address }}</td>
              <td>
                <span class="badge" [class.active]="user.status === 'Active'" [class.inactive]="user.status === 'Inactive'">
                  {{ user.status }}
                </span>
              </td>
              <td>{{ user.employee_code }}</td>
              <td class="actions">
                <button class="icon-btn edit" (click)="editUser(user)">✎</button>
                <button class="icon-btn delete" (click)="deleteUser(user.id)">🗑</button>
              </td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="8" class="empty">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-head { display: flex; justify-content: space-between; align-items: center; }
    .page-head h1 { margin: 0; font-size: 2rem; color: #0f172a; }
    .page-head p { margin: 4px 0 0; color: #64748b; font-size: 14px; }
    .create-button {
      border: none; background: linear-gradient(90deg, #5b6cf6, #9d7bff);
      color: white; padding: 12px 20px; border-radius: 12px;
      cursor: pointer; font-size: 14px; font-weight: 600; white-space: nowrap;
    }
    .form-card, .table-card {
      background: white; border-radius: 20px; padding: 24px;
      box-shadow: 0 4px 24px rgba(15,23,42,0.08); border: 1px solid #e0e7ff;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: #374151; }
    input, select {
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      padding: 10px 14px; font-size: 14px; background: #f8fafc; outline: none;
    }
    input:focus, select:focus { border-color: #5b6cf6; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 8px; }
    .form-actions button {
      border: none; background: linear-gradient(90deg, #5b6cf6, #9d7bff);
      color: white; padding: 12px 28px; border-radius: 10px;
      cursor: pointer; font-size: 14px; font-weight: 600;
    }
    .form-actions button:disabled { opacity: 0.5; cursor: not-allowed; }
    .error-msg { color: #dc2626; font-size: 13px; margin-bottom: 8px; }
    .loading { text-align: center; padding: 40px; color: #64748b; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: linear-gradient(90deg, #5b6cf6, #9d7bff); }
    th { padding: 16px 18px; color: #fff; font-size: 13px; font-weight: 600; text-align: left; }
    td { padding: 16px 18px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #f8faff; }
    .badge { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .active { background: #dcfce7; color: #16a34a; }
    .inactive { background: #fee2e2; color: #dc2626; }
    .actions { display: flex; gap: 8px; }
    .icon-btn { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
    .edit { background: #eef2ff; color: #5b6cf6; }
    .edit:hover { background: #e0e7ff; }
    .delete { background: #fee2e2; color: #dc2626; }
    .delete:hover { background: #fecaca; }
    .empty { text-align: center; color: #94a3b8; padding: 40px; }
    @media (max-width: 860px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class UserInfoComponent implements OnInit {
  users: any[] = [];
  showForm = false;
  editingUser: any = null;
  loading = false;
  errorMsg = '';
  formUser: any = this.emptyForm();

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  emptyForm() {
    return { name: '', phone: '', whatsapp: '', address: '', employee_code: '', email: '', status: 'Active', password: 'password' };
  }

  loadUsers() {
    this.loading = true;
    this.cdr.detectChanges();
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        if (res.success) this.users = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Could not connect to database.';
        this.cdr.detectChanges();
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.editingUser = null;
    this.formUser = this.emptyForm();
    this.errorMsg = '';
  }

  editUser(user: any) {
    this.editingUser = user;
    this.formUser = { ...user };
    this.showForm = true;
    this.errorMsg = '';
  }

  saveUser() {
    this.errorMsg = '';
    if (this.editingUser) {
      this.userService.updateUser(this.formUser).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.showForm = false;
            this.editingUser = null;
            this.loadUsers();
          } else {
            this.errorMsg = res.message;
            this.cdr.detectChanges();
          }
        },
        error: () => { this.errorMsg = 'Update failed.'; this.cdr.detectChanges(); }
      });
    } else {
      this.userService.addUser(this.formUser).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.showForm = false;
            this.formUser = this.emptyForm();
            this.loadUsers();
          } else {
            this.errorMsg = res.message;
            this.cdr.detectChanges();
          }
        },
        error: () => { this.errorMsg = 'Could not add user.'; this.cdr.detectChanges(); }
      });
    }
  }

  deleteUser(id: number) {
    if (!confirm('Delete this user?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: () => { this.errorMsg = 'Delete failed.'; this.cdr.detectChanges(); }
    });
  }

  isValidName(name: string): boolean {
    return /^[A-Za-z\s]*$/.test(name);
  }
}