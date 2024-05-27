import { News } from './schemas/news.schema';

export interface NewsResponse {
  data: News[];
  totalNews: number;
}
