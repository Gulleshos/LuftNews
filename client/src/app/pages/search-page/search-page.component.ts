import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Category,
  News,
  NewsResponse,
} from '../../core/interfaces/news.interface';
import { SearchService } from '../../core/services/search.service';
import { NewsService } from '../../core/services/news.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';
import { MatCard } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewsListComponent } from '../../shared/components/news-list/news-list.component';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    MatPaginator,
    MatProgressSpinner,
    NewsCardComponent,
    MatCard,
    MatFormField,
    MatIcon,
    MatLabel,
    MatInput,
    MatIconButton,
    MatHint,
    MatError,
    FormsModule,
    NewsListComponent,
    MatSuffix,
    ReactiveFormsModule,
    MatButton,
    RouterLink,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit, OnDestroy {
  newsList: News[] = [];
  newsLimit: number = 10;
  newsTotalLength!: number;
  currentPage: number = 1;
  query: string = '';
  isLoading: boolean = false;
  searchForm: FormGroup;
  categories: Category[] = [];
  category: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly searchService: SearchService,
    private readonly newsService: NewsService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.searchForm = this.formBuilder.group({
      query: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.newsService
      .getNewsCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      });
    this.query = this.searchService.getSearchTerm();
    this.fetchNews();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    if (this.searchForm.valid) {
      const { query } = this.searchForm.value;
      this.query = query;
      this.fetchNews();
    }
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.fetchNews();
  }

  filter(category: string | null) {
    this.category = category;
    this.fetchNews();
  }

  fetchNews() {
    if (this.query.length) {
      this.isLoading = true;
      this.newsService
        .getNewsByQuery(
          this.query,
          this.currentPage,
          this.newsLimit,
          this.category,
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: NewsResponse) => {
          this.newsList = res.data;
          this.newsTotalLength = res.totalNews;
          this.isLoading = false;
        });
    }
  }
}
