import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewsService } from '../../core/services/news.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatChipGrid,
  MatChipInput,
  MatChipRemove,
  MatChipRow,
} from '@angular/material/chips';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-category-page',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatChipGrid,
    MatChipInput,
    MatChipRemove,
    MatChipRow,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    NgForOf,
    ReactiveFormsModule,
  ],
  templateUrl: './create-category-page.component.html',
  styleUrl: './create-category-page.component.scss',
})
export class CreateCategoryPageComponent {
  private destroy$ = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.createCategoryForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  createCategoryForm: FormGroup;

  onSubmit() {
    if (this.createCategoryForm.valid) {
      const category = this.createCategoryForm.value;

      this.newsService
        .createCategory({
          title: category.title.toLowerCase(),
          description: category.description,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/admin');
            this._snackBar.open('The category has been added!', 'Close', {
              duration: 5000,
            });
          },
          error: (error) => {
            this._snackBar.open(error.error.message, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    }
  }
}
