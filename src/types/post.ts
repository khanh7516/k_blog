export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
  category: {
    name: string;
  };
}