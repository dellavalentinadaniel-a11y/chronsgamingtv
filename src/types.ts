export interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date?: string;
  content?: string;
  createdAt?: any;
  authorId?: string;
  score?: number;
  commentsCount: number;
  platform: string[];
  tags?: string[];
}

export interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  authorName?: string;
  authorPhotoUrl?: string;
  content: string;
  createdAt: any;
}

export interface TrendingGame {
  id: string;
  title: string;
  imageUrl: string;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}
