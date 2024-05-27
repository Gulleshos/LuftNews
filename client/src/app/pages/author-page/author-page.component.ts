import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { News, NewsResponse } from '../../core/interfaces/news.interface';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';
import { PageEvent } from '@angular/material/paginator';
import { NewsListComponent } from '../../shared/components/news-list/news-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-author-page',
  standalone: true,
  imports: [NewsCardComponent, NewsListComponent],
  templateUrl: './author-page.component.html',
  styleUrl: './author-page.component.scss',
})
export class AuthorPageComponent implements OnInit, OnDestroy {
  authorId: string = '';
  newsList: News[] = [];
  isLoading: boolean = false;
  newsTotalLength!: number;
  currentPage: number = 1;
  newsLimit: number = 10;
  private newsSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private newsService: NewsService,
  ) {}

  ngOnInit() {
    const authorId = this.activatedRoute.snapshot.paramMap.get('authorId');
    if (authorId) {
      this.authorId = authorId;
      this.fetchNews();
    }
  }

  ngOnDestroy() {
    this.newsSubscription.unsubscribe();
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.fetchNews();
  }

  fetchNews() {
    this.isLoading = true;
    this.newsSubscription = this.newsService
      .getNewsByAuthor(this.authorId, this.currentPage, this.newsLimit)
      .subscribe((res: NewsResponse) => {
        this.newsList = res.data;
        this.newsTotalLength = res.totalNews;
        this.isLoading = false;
      });
  }
}
