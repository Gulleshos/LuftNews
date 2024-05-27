import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { News } from '../../../core/interfaces/news.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NewsComponent } from '../../../pages/news-page/components/news/news.component';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsCardComponent } from '../news-card/news-card.component';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [
    MatProgressSpinner,
    NewsComponent,
    NgOptimizedImage,
    RouterLink,
    NewsCardComponent,
    MatPaginator,
  ],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent {
  @Input() newsList: News[] = [];
  @Input() isLoading: boolean = false;
  @Input() totalLength!: number;
  @Input() limit: number = 10;
  @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter();

  onPageChange(pageEvent: PageEvent) {
    this.pageChange.emit(pageEvent);
  }
}
