import { Component, OnDestroy } from '@angular/core';
import { AuthResponse, User } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth.service';
import { MatButton, MatFabButton } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    RouterOutlet,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    MatFabButton,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnDestroy {
  user: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(private readonly authService: AuthService) {
    this.authService.authUser.pipe(takeUntil(this.destroy$)).subscribe({
      next: (authStatus: AuthResponse | null) => {
        if (authStatus) {
          this.user = authStatus.user;
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
