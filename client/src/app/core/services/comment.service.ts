import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/news.interface';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private serverUrl: string = environment.serverUrl;
  constructor(private http: HttpClient) {}

  createComment(newsId: string, comment: Comment): Observable<Comment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Comment>(
      `${this.serverUrl}/news/${newsId}/comments`,
      comment,
      { headers },
    );
  }

  getCommentsByNews(newsId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.serverUrl}/news/${newsId}/comments`,
    );
  }
}
