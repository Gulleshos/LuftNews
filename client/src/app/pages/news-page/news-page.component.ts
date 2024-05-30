import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { User, AuthResponse } from '../../core/interfaces/user.interface';
import { News, Comment } from '../../core/interfaces/news.interface';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatList, MatListItem } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { CommentService } from '../../core/services/comment.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewsComponent } from './components/news/news.component';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [
    DatePipe,
    MatFormField,
    MatInput,
    MatButton,
    MatList,
    MatListItem,
    MatDivider,
    MatLabel,
    MatProgressSpinner,
    ReactiveFormsModule,
    RouterLink,
    NewsComponent,
    NgOptimizedImage,
  ],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.scss',
})
export class NewsPageComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  news: News | null = null;
  user: User | null = null;
  comments: Comment[] = [];
  loadingComments: boolean = false;
  loadingNews: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly newsService: NewsService,
    private readonly authService: AuthService,
    private readonly commentService: CommentService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.authService.authStatus.pipe(takeUntil(this.destroy$)).subscribe({
      next: (authStatus: boolean) => {
        this.isAuthenticated = authStatus;
      },
    });
    this.authService.authUser.pipe(takeUntil(this.destroy$)).subscribe({
      next: (AuthResponse: AuthResponse | null) => {
        if (AuthResponse) {
          this.user = AuthResponse.user;
        }
      },
    });
  }
  commentForm: FormGroup = this.formBuilder.group({
    comment: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    const newsId = this.activatedRoute.snapshot.paramMap.get('id');

    if (newsId) {
      this.loadingNews = true;
      this.newsService
        .getNewsById(newsId)
        .pipe(takeUntil(this.destroy$))
        .pipe(
          catchError(() => {
            this.loadingNews = false;
            return EMPTY;
          }),
        )
        .subscribe((data: News) => {
          this.news = data;
          this.loadingNews = false;
        });

      this.loadingComments = true;
      this.newsService
        .getCommentsByNews(newsId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: Comment[]) => {
            this.comments = data;
            this.loadingComments = false;
          },
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createComment() {
    const { comment } = this.commentForm.value;
    const newComment = {
      author: {
        username: this.user!.username,
        id: this.user!._id,
      },
      news: this.news!._id,
      text: comment,
      date: new Date().toISOString(),
    };
    this.commentService
      .createComment(this.news!._id, newComment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment: Comment) => {
          this.commentForm.reset();
          this.comments.push(comment);
        },
      });
  }
}
