import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  News,
  Comment,
  Category,
  NewsRequest,
  NewsResponse,
} from '../interfaces/news.interface';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private serverUrl: string = environment.serverUrl;

  constructor(private readonly http: HttpClient) {}

  getNews(page: number, limit: number): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(
      `${this.serverUrl}/news?page=${page}&limit=${limit}`,
    );
  }

  createNews(news: NewsRequest): Observable<News> {
    return this.http.post<News>(`${this.serverUrl}/news`, news);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.serverUrl}/category`, category);
  }

  getNewsById(newsId: string): Observable<News> {
    return this.http.get<News>(`${this.serverUrl}/news/${newsId}`);
  }

  getNewsByAuthor(
    authorId: string,
    page: number,
    limit: number,
  ): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(
      `${this.serverUrl}/news/author/${authorId}?page=${page}&limit=${limit}`,
    );
  }

  getNewsByCategory(
    category: string,
    page: number,
    limit: number,
  ): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(
      `${this.serverUrl}/news/category/${category}?page=${page}&limit=${limit}`,
    );
  }

  getNewsCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.serverUrl}/category`);
  }

  getNewsByQuery(
    query: string,
    page: number,
    limit: number,
    category: string | null,
  ): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(
      `${this.serverUrl}/news/search/${query}?page=${page}&limit=${limit}${category ? '&category=' + category : ''}`,
    );
  }

  getCommentsByNews(newsId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.serverUrl}/news/${newsId}/comments`,
    );
  }
}
