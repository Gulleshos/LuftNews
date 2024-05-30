import { Component, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthResponse, User } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
  ],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.scss',
})
export class ReportPageComponent implements OnDestroy {
  user: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar,
  ) {
    this.authService.authUser.pipe(takeUntil(this.destroy$)).subscribe({
      next: (authStatus: AuthResponse | null) => {
        if (authStatus) {
          this.user = authStatus.user;
        }
      },
    });
  }

  reportForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    text: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendReport() {
    if (this.reportForm.valid) {
      const { title, text } = this.reportForm.value;
      this.userService
        .sendReport({
          title,
          text,
          author: {
            id: this.user!._id,
            username: this.user!.username,
          },
        })
        ?.subscribe({
          next: () => {
            this.router.navigateByUrl('/');
            this._snackBar.open('The report has been sent!!', 'Close', {
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
