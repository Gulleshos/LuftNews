import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchTerm: string = '';

  setSearchTerm(term: string): void {
    this.searchTerm = term;
  }

  getSearchTerm(): string {
    return this.searchTerm;
  }
}
