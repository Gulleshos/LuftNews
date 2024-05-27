import { Component, Input } from '@angular/core';
import { Category } from '../../../../core/interfaces/news.interface';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-homepage-categories',
  standalone: true,
  imports: [MatButton, RouterLink, MatProgressSpinner, MatDivider],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  @Input() categories: Category[] = [];
}
