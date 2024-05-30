import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Report, User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly serverUrl = environment.serverUrl;
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) {}

  sendReport(report: {
    title: string;
    text: string;
    author: {
      id: string;
      username: string;
    };
  }): Observable<Report> | null {
    if (this.authService.authStatus) {
      return this.http.post<Report>(`${this.serverUrl}/user/report`, report);
    }
    return null;
  }

  getAuthor(id: string): Observable<{
    username: string;
    email: string;
  }> {
    return this.http.get<{
      username: string;
      email: string;
    }>(`${this.serverUrl}/user/author/${id}`);
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.serverUrl}/user/report`);
  }

  isSubscribed(
    userId: string,
    category: string,
  ): Observable<{ isSubscribed: boolean }> {
    return this.http.post<{ isSubscribed: boolean }>(
      `${this.serverUrl}/user/issubscribed`,
      { userId, category },
    );
  }

  subscribe(userId: string, category: string): Observable<User> {
    return this.http.post<User>(`${this.serverUrl}/user/subscribe`, {
      userId,
      category,
    });
  }

  unsubscribe(userId: string, category: string): Observable<User> {
    return this.http.post<User>(`${this.serverUrl}/user/unsubscribe`, {
      userId,
      category,
    });
  }
}
