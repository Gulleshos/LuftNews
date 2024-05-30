import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User, UserRoleEnum, AuthResponse } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = new BehaviorSubject<boolean>(false);
  private _authUser = new BehaviorSubject<AuthResponse | null>(null);
  private readonly serverUrl = environment.serverUrl;

  constructor(private readonly http: HttpClient) {
    this.isAuthenticated();
  }

  private isAuthenticated() {
    const isAuth = localStorage.getItem('session') || null;

    if (!isAuth) {
      this.logout();
      return;
    }

    const { user, token } = JSON.parse(isAuth);
    const decodedToken = jwtDecode(token);
    const isExpired =
      Math.floor(new Date().getTime() / 1000) >= (decodedToken.exp || 0);

    if (isExpired) {
      this.logout();
      return;
    }

    this._authStatus.next(true);
    this._authUser.next({ user, token });
  }

  private setAuthentication(user: User, token: string): boolean {
    this._authStatus.next(true);
    this._authUser.next({ user, token });
    localStorage.setItem('session', JSON.stringify({ user, token }));

    return true;
  }

  register(username: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.serverUrl}/auth/signup`, {
        username,
        email,
        password,
      })
      .pipe(map(({ user, token }) => this.setAuthentication(user, token)));
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${this.serverUrl}/auth/signin`, { email, password })
      .pipe(map(({ user, token }) => this.setAuthentication(user, token)));
  }

  logout() {
    this._authStatus.next(false);
    this._authUser.next(null);

    localStorage.removeItem('session');
  }

  get authStatus(): Observable<boolean> {
    return this._authStatus.asObservable();
  }

  get authUser(): Observable<AuthResponse | null> {
    return this._authUser.asObservable();
  }

  isAdmin(): boolean {
    const res = this._authUser.getValue();
    return res?.user?.role === UserRoleEnum.ADMIN;
  }
}
