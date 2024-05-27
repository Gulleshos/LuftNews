import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatToolbar } from '@angular/material/toolbar';
import { DrawerComponent } from './components/drawer/drawer.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { AuthResponse, User } from '../../../core/interfaces/user.interface';
import { MatIcon } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    DrawerComponent,
    MatButton,
    RouterLink,
    SearchComponent,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  user: User | null = null;
  showSearchBar: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.authStatus.pipe(takeUntil(this.destroy$)).subscribe({
      next: (authStatus: boolean) => {
        this.isAuthenticated = authStatus;
      },
    });
    this.authService.authUser.pipe(takeUntil(this.destroy$)).subscribe({
      next: (AuthResponse: AuthResponse | null) => {
        if (AuthResponse) {
          this.user = AuthResponse.user;
        }
      },
    });
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showSearchBar = !this.router.url.includes('/search');
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  logout = () => {
    this.authService.logout();
    this.router.navigateByUrl('/');
  };
}
