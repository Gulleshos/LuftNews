import { Component, Input } from '@angular/core';
import { News } from '../../../core/interfaces/news.interface';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    RouterLink,
    MatCardContent,
    MatDivider,
    MatCardActions,
    MatButton,
    DatePipe,
  ],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss',
})
export class NewsCardComponent {
  @Input() news!: News;
}
