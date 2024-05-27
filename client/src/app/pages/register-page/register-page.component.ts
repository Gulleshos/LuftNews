import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDivider } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    MatButton,
    FormsModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    RouterLink,
    MatCardHeader,
    MatDivider,
    MatError,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private destroy$ = new Subject<void>();
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  registerForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  register() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.authService
        .register(username, email, password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/');
            this._snackBar.open('Welcome!', 'Close', {
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
