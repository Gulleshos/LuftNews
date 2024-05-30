import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from '../../core/services/news.service';
import {
  Category,
  News,
  NewsResponse,
} from '../../core/interfaces/news.interface';
import { PageEvent } from '@angular/material/paginator';
import { CategoriesComponent } from './components/categories/categories.component';
import { NewsListComponent } from '../../shared/components/news-list/news-list.component';
import { NewsCacheService } from '../../core/services/news-cache.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CategoriesComponent, NewsListComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  newsList: News[] = [];
  newsLoading: boolean = false;
  newsLimit: number = 10;
  newsTotalLength!: number;
  currentPage: number = 1;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly newsService: NewsService,
    private readonly newsCacheService: NewsCacheService,
  ) {}

  ngOnInit() {
    this.newsService
      .getNewsCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      });
    this.fetchNews();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.fetchNews();
  }

  fetchNews() {
    this.newsLoading = true;

    //const cachedNews = this.newsCacheService.getCachedNews();
    if (false) {
      // if (cachedNews.length < this.newsTotalLength) {
      //   this.newsService
      //     .getNews(this.currentPage, this.newsLimit)
      //     .pipe(takeUntil(this.destroy$))
      //     .subscribe((res: NewsResponse) => {
      //       this.newsList = res.data;
      //       this.newsTotalLength = res.totalNews;
      //       this.newsCacheService.updateCache(res.data);
      //     });
      // }
      // const startIndex  = (this.currentPage - 1) * this.newsLimit;
      // this.newsList = cachedNews.slice(startIndex, startIndex + this.newsLimit);
      // this.newsLoading = false;
    } else {
      this.newsService
        .getNews(this.currentPage, this.newsLimit)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: NewsResponse) => {
          this.newsList = res.data;
          this.newsTotalLength = res.totalNews;
          this.newsLoading = false;
        });
    }
  }
}
