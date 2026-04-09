import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  token: string; email: string; fullName: string;
  role: string; firstLogin: boolean; userId: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  currentUser = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => { localStorage.setItem('auth_user', JSON.stringify(res)); this.currentUser.set(res); })
    );
  }

  logout() {
    localStorage.removeItem('auth_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, { currentPassword, newPassword }).pipe(
      tap(() => {
        const user = this.currentUser();
        if (user) {
          const updated = { ...user, firstLogin: false };
          localStorage.setItem('auth_user', JSON.stringify(updated));
          this.currentUser.set(updated);
        }
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  isLoggedIn(): boolean { return !!this.currentUser(); }
  isAdmin(): boolean { return this.currentUser()?.role === 'ROLE_ADMIN'; }
  isFirstLogin(): boolean { return this.currentUser()?.firstLogin ?? false; }
  getToken(): string | null { return this.currentUser()?.token ?? null; }

  private loadUser(): AuthUser | null {
    try { const s = localStorage.getItem('auth_user'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  }
}
