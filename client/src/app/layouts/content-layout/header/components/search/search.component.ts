import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../../../core/services/search.service';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-header-search',
  standalone: true,
  imports: [MatIcon, FormsModule, MatButton, MatInput, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  constructor(
    private router: Router,
    private searchService: SearchService,
  ) {}

  searchTerm: string = '';

  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
    this.router.navigate(['/search']);
  }
}
