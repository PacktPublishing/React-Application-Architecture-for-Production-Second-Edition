export type UserSummary = {
  id: string;
  email: string;
  username: string;
};

export type User = {
  id: string;
  email: string;
  username: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
};

export type Idea = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  tags: string[];
  authorId: string;
  author: UserSummary;
  createdAt: string;
  updatedAt: string;
  reviewsCount: number;
  avgRating: number;
};

export type Review = {
  id: string;
  content: string;
  rating: number;
  authorId: string;
  author: UserSummary;
  ideaId: string;
  idea?: {
    id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
};
