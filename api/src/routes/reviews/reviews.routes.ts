import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { insertReviewsSchema, updateReviewsSchema } from "@/db/schema";
import { ErrorSchema, ReviewSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares/auth";

const tags = ["Reviews"];

const reviewListResponseSchema = z.object({
  data: z.array(ReviewSchema),
}).openapi("ReviewListResponse");

export const createReview = createRoute({
  operationId: "createReview",
  path: "/reviews",
  method: "post",
  tags,
  summary: "Create a new review",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentRequired(insertReviewsSchema, "Review data"),
  },
  responses: {
    201: jsonContent(ReviewSchema, "Review created successfully"),
    401: jsonContent(ErrorSchema, "Unauthorized"),
    404: jsonContent(ErrorSchema, "Idea not found"),
    409: jsonContent(ErrorSchema, "You have already reviewed this idea"),
  },
});

export const updateReview = createRoute({
  operationId: "updateReview",
  path: "/reviews/{id}",
  method: "patch",
  tags,
  summary: "Update a review (owner only)",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(updateReviewsSchema, "Updated review data"),
  },
  responses: {
    200: jsonContent(ReviewSchema, "Review updated successfully"),
    401: jsonContent(ErrorSchema, "Unauthorized"),
    403: jsonContent(ErrorSchema, "Forbidden - not the owner"),
    404: jsonContent(ErrorSchema, "Review not found"),
  },
});

export const deleteReview = createRoute({
  operationId: "deleteReview",
  path: "/reviews/{id}",
  method: "delete",
  tags,
  summary: "Delete a review (owner only)",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: jsonContent(z.object({ message: z.string() }), "Review deleted successfully"),
    401: jsonContent(ErrorSchema, "Unauthorized"),
    403: jsonContent(ErrorSchema, "Forbidden - not the owner"),
    404: jsonContent(ErrorSchema, "Review not found"),
  },
});

export const getReviewsByUser = createRoute({
  operationId: "getReviewsByUser",
  path: "/reviews/user/{username}",
  method: "get",
  tags,
  summary: "Get reviews by username",
  request: {
    params: z.object({
      username: z.string(),
    }),
  },
  responses: {
    200: jsonContent(reviewListResponseSchema, "Reviews retrieved successfully"),
    404: jsonContent(ErrorSchema, "User not found"),
  },
});

export const getCurrentUserReviews = createRoute({
  operationId: "getCurrentUserReviews",
  path: "/reviews/current",
  method: "get",
  tags,
  summary: "Get reviews by current authenticated user",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
  },
  responses: {
    200: jsonContent(reviewListResponseSchema, "Reviews retrieved successfully"),
    401: jsonContent(ErrorSchema, "Unauthorized"),
  },
});

export const getReviewsByIdea = createRoute({
  operationId: "getReviewsByIdea",
  path: "/reviews/idea/{id}",
  method: "get",
  tags,
  summary: "Get reviews by idea ID",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: jsonContent(reviewListResponseSchema, "Reviews retrieved successfully"),
    404: jsonContent(ErrorSchema, "Idea not found"),
  },
});

export type CreateReviewRoute = typeof createReview;
export type UpdateReviewRoute = typeof updateReview;
export type DeleteReviewRoute = typeof deleteReview;
export type GetReviewsByUserRoute = typeof getReviewsByUser;
export type GetCurrentUserReviewsRoute = typeof getCurrentUserReviews;
export type GetReviewsByIdeaRoute = typeof getReviewsByIdea;
