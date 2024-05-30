import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { News, NewsResponse } from '../../core/interfaces/news.interface';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';
import { PageEvent } from '@angular/material/paginator';
import { NewsListComponent } from '../../shared/components/news-list/news-list.component';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { NewsAuthor } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-author-page',
  standalone: true,
  imports: [NewsCardComponent, NewsListComponent],
  templateUrl: './author-page.component.html',
  styleUrl: './author-page.component.scss',
})
export class AuthorPageComponent implements OnInit, OnDestroy {
  author: null | NewsAuthor = null;
  newsList: News[] = [];
  isLoading: boolean = false;
  newsTotalLength!: number;
  currentPage: number = 1;
  newsLimit: number = 10;
  private newsSubscription!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly newsService: NewsService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    const authorId = this.activatedRoute.snapshot.paramMap.get('authorId');
    if (authorId) {
      this.userService
        .getAuthor(authorId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (author) => {
            if (author) {
              this.author = {
                id: authorId,
                username: author.username,
                email: author.email,
              };
              this.fetchNews();
            }
          },
        });
    }
  }

  ngOnDestroy(): void {
    if (this.newsSubscription) {
      this.newsSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.currentPage = pageEvent.pageIndex + 1;
    this.fetchNews();
  }

  fetchNews(): void {
    this.isLoading = true;
    this.newsSubscription = this.newsService
      .getNewsByAuthor(this.author!.id, this.currentPage, this.newsLimit)
      .subscribe((res: NewsResponse) => {
        this.newsList = res.data;
        this.newsTotalLength = res.totalNews;
        this.isLoading = false;
      });
  }
}
