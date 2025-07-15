export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  favoritesCount: number;
  commentsCount: number;
  author: {
    name: string;
  };
  category: {
    name: string;
  };
}