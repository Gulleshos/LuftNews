import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { News, NewsResponse } from '../../core/interfaces/news.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { NewsListComponent } from '../../shared/components/news-list/news-list.component';
import { Subject, takeUntil } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, AuthResponse } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [NewsListComponent, MatButton, RouterLink],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  category: string = '';
  newsList: News[] = [];
  isLoading: boolean = false;
  newsTotalLength!: number;
  currentPage: number = 1;
  newsLimit: number = 10;
  user: User | null = null;
  isSubscribed: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly newsService: NewsService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const category = this.activatedRoute.snapshot.paramMap.get('category');
    if (category) {
      this.category = category;
      this.fetchNews();
    }

    this.authService.authUser.pipe(takeUntil(this.destroy$)).subscribe({
      next: (AuthResponse: AuthResponse | null) => {
        if (AuthResponse) {
          this.user = AuthResponse.user;
        }
      },
    });

    if (this.user) {
      this.userService
        .isSubscribed(this.user._id, this.category)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: { isSubscribed: boolean }) => {
          this.isSubscribed = res.isSubscribed;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.currentPage = pageEvent.pageIndex + 1;
    this.fetchNews();
  }

  fetchNews(): void {
    this.isLoading = true;
    this.newsService
      .getNewsByCategory(this.category, this.currentPage, this.newsLimit)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: NewsResponse) => {
        this.newsList = res.data;
        this.newsTotalLength = res.totalNews;
        this.isLoading = false;
      });
  }

  subscribe(): void {
    this.userService
      .subscribe(this.user!._id, this.category)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSubscribed = true;
        this._snackBar.open('Subscribed!', 'Close', {
          duration: 5000,
        });
      });
  }

  unsubscribe(): void {
    this.userService
      .unsubscribe(this.user!._id, this.category)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSubscribed = false;
        this._snackBar.open('Unsubscribed!', 'Close', {
          duration: 5000,
        });
      });
  }
}
