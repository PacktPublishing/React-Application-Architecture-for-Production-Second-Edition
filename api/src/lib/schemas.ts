import { z } from "@hono/zod-openapi";

// Shared response schemas that will appear in components
export const ErrorSchema = z.object({
  message: z.string(),
}).openapi("Error");

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  bio: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).openapi("User");

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
}).openapi("AuthResponse");

export const CurrentUserSchema = UserSchema.nullable().openapi("CurrentUser");

export const UserSummarySchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
}).openapi("UserSummary");

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  prevPage: z.number().nullable(),
  nextPage: z.number().nullable(),
}).openapi("Pagination");

// Create a separate IdeaSummary component for nested references in reviews
export const IdeaSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
}).openapi("IdeaSummary");

export const IdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  authorId: z.string(),
  author: UserSummarySchema,
  reviewsCount: z.number(),
  avgRating: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).openapi("Idea");

export const ReviewSchema = z.object({
  id: z.string(),
  content: z.string(),
  rating: z.number(),
  authorId: z.string(),
  author: UserSummarySchema,
  ideaId: z.string(),
  idea: IdeaSummarySchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).openapi("Review");
