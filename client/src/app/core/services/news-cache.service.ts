import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { News } from '../interfaces/news.interface';

@Injectable({ providedIn: 'root' })
export class NewsCacheService {
  private cachedNewsSubject = new BehaviorSubject<News[] | null>(null);
  cachedNews$ = this.cachedNewsSubject.asObservable();
  private cacheExpirationTime: number = 5 * 60 * 1000;
  private lastCacheUpdateTime: number = 0;

  updateCache(news: News[]) {
    const currentNews = this.cachedNewsSubject.getValue() || [];
    const updatedNews = currentNews.concat(news);
    this.cachedNewsSubject.next(updatedNews);
    this.lastCacheUpdateTime = Date.now();
  }

  getCachedNews(): News[] | null {
    const currentTime = Date.now();
    if (currentTime - this.lastCacheUpdateTime <= this.cacheExpirationTime) {
      return this.cachedNewsSubject.getValue();
    } else {
      this.clearCache();
      return null;
    }
  }

  private clearCache() {
    this.cachedNewsSubject.next(null);
    this.lastCacheUpdateTime = 0;
  }
}
