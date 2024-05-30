import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AuthResponse, User } from '../../core/interfaces/user.interface';
import { Category } from '../../core/interfaces/news.interface';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewsService } from '../../core/services/news.service';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  MatChip,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRemove,
  MatChipRow,
} from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-create-news-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatChip,
    MatIcon,
    MatLabel,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    MatAutocomplete,
    MatChipInput,
    MatAutocompleteTrigger,
    AsyncPipe,
    NgForOf,
  ],
  templateUrl: './create-news-page.component.html',
  styleUrl: './create-news-page.component.scss',
})
export class CreateNewsPageComponent implements OnInit, OnDestroy {
  user: User | null = null;
  categories: Category[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl('');
  filteredCategories: Observable<string[]>;
  selectedCategories: string[] = [];
  allCategories: string[] = [];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly newsService: NewsService,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar,
  ) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) =>
        category ? this._filter(category) : this.allCategories.slice(),
      ),
    );

    this.createNewsForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      text: ['', [Validators.required, Validators.minLength(6)]],
      categories: [[], [Validators.required]],
    });

    this.authService.authUser.pipe(takeUntil(this.destroy$)).subscribe({
      next: (authStatus: AuthResponse | null) => {
        if (authStatus) {
          this.user = authStatus.user;
        }
      },
    });
  }
  createNewsForm: FormGroup;

  ngOnInit(): void {
    this.newsService
      .getNewsCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        this.allCategories = categories.map((category) => category.title);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.selectedCategories.includes(value)) {
      this.selectedCategories.push(value);
      this.createNewsForm.get('categories')?.setValue(this.selectedCategories);
    }

    event.chipInput!.clear();
    this.categoryCtrl.setValue(null);
  }

  remove(category: string): void {
    const index = this.selectedCategories.indexOf(category);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
      this.createNewsForm.get('categories')?.setValue(this.selectedCategories);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedCategories.includes(event.option.viewValue)) {
      this.selectedCategories.push(event.option.viewValue);
      this.createNewsForm.get('categories')?.setValue(this.selectedCategories);
    }
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCategories.filter((category) =>
      category.toLowerCase().includes(filterValue),
    );
  }

  onSubmit() {
    if (this.createNewsForm.valid) {
      const newsData = this.createNewsForm.value;
      const news = {
        ...newsData,
        author: {
          username: this.user!.username,
          id: this.user!._id,
        },
        date: new Date().toISOString(),
      };

      console.log(news);
      this.newsService
        .createNews(news)

        .subscribe({
          next: () => {
            this.router.navigateByUrl('/admin');
            this._snackBar.open('The news has been added!', 'Close', {
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
