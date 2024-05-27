interface Author {
  id: string;
  username: string;
}

export interface News {
  _id: string;
  title: string;
  text: string;
  author: Author;
  categories: string[];
  date: Date;
}

export interface NewsResponse {
  data: News[];
  totalNews: number;
}

export interface NewsRequest {
  title: string;
  text: string;
  author: {
    id: string;
    username: string;
  };
  date: Date;
  categories: string[];
}

export interface Comment {
  text: string;
  author: Author;
  date: string;
  news: string;
}

export interface Category {
  title: string;
  description: string;
}
