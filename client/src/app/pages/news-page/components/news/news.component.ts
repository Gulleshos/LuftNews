import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { News } from '../../../../core/interfaces/news.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-news-page-news',
  standalone: true,
  imports: [DatePipe, MatButton, MatDivider, RouterLink, MatProgressSpinner],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  @Input() news!: News;
  @Input() loadingNews!: boolean;
}
