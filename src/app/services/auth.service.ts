import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost/Xorvia/backend';
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php`, {
      action: 'login', email, password
    }).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('xv_user', JSON.stringify(res.user));
          localStorage.setItem('xv_token', res.token);
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('xv_user');
    localStorage.removeItem('xv_token');
    this.currentUserSubject.next(null);
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('xv_token');
  }

  private getStoredUser() {
    const u = localStorage.getItem('xv_user');
    return u ? JSON.parse(u) : null;
  }

  changePassword(userId: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php`, {
      action: 'change_password',
      user_id: userId,
      old_password: oldPassword,
      new_password: newPassword
    });
  }
}