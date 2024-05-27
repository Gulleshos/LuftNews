import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Report } from '../../core/interfaces/user.interface';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatCardContent,
  ],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss',
})
export class ReportsPageComponent implements OnInit {
  reports: Report[] = [];
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService
      .getReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reports: Report[]) => {
          this.reports = reports;
        },
      });
  }
}
