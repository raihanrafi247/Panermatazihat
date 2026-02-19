export type UserRole = 'admin' | 'sub-admin' | 'user' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  joinedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  views: number;
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
  isBreaking?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories?: Category[];
}

export interface SiteSettings {
  areaTitle: string;
  areaDescription: string;
  sliderImages: string[];
}

export type PageView = 'home' | 'news-detail' | 'login' | 'register' | 'user-dashboard' | 'admin-dashboard' | 'category';

export interface AppState {
  currentPage: PageView;
  selectedNewsId: string | null;
  selectedCategory: string | null;
  user: User | null;
}