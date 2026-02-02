import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { insertIdeasSchema, updateIdeasSchema } from "@/db/schema";
import { ErrorSchema, IdeaSchema, PaginationSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares/auth";

const tags = ["Ideas"];

const ideaListResponseWithPaginationSchema = z.object({
  data: z.array(IdeaSchema),
  pagination: PaginationSchema,
}).openapi("IdeaListWithPaginationResponse");

const ideaListResponseSchema = z.object({
  data: z.array(IdeaSchema),
}).openapi("IdeaListResponse");

const tagsResponseSchema = z.object({
  data: z.array(z.string()),
}).openapi("TagsResponse");

const queryParamsSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10000"),
  search: z.string().optional(),
  tags: z.string().optional(),
  sortBy: z.enum(["newest", "oldest", "rating", "reviews"]).optional().default("newest"),
});

export const getAllIdeas = createRoute({
  operationId: "getAllIdeas",
  path: "/ideas",
  method: "get",
  tags,
  summary: "Get all ideas with optional filtering, pagination, and sorting",
  description: "Supports sorting by: newest (default), oldest, rating (highest first), reviews (most reviews first)",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    200: jsonContent(ideaListResponseWithPaginationSchema, "Ideas retrieved successfully"),
  },
});

export const createIdea = createRoute({
  operationId: "createIdea",
  path: "/ideas",
  method: "post",
  tags,
  summary: "Create a new idea",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentRequired(insertIdeasSchema, "Idea data"),
  },
  responses: {
    201: jsonContent(IdeaSchema, "Idea created successfully"),
    401: jsonContent(ErrorSchema, "Unauthorized"),
  },
});

export const getIdeaById = createRoute({
  operationId: "getIdeaById",
  path: "/ideas/{id}",
  method: "get",
  tags,
  summary: "Get an idea by ID",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: jsonContent(IdeaSchema, "Idea retrieved successfully"),
    404: jsonContent(ErrorSchema, "Idea not found"),
  },
});

export const updateIdea = createRoute({
  operationId: "updateIdea",
  path: "/ideas/{id}",
  method: "patch",
  tags,
  summary: "Update an idea (owner only)",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(updateIdeasSchema, "Updated idea data"),
  },
  responses: {
    200: jsonContent(IdeaSchema, "Idea updated successfully"),
    401: jsonContent(ErrorSchema, "Unauthorized"),
    403: jsonContent(ErrorSchema, "Forbidden - not the owner"),
    404: jsonContent(ErrorSchema, "Idea not found"),
  },
});

export const deleteIdea = createRoute({
  operationId: "deleteIdea",
  path: "/ideas/{id}",
  method: "delete",
  tags,
  summary: "Delete an idea (owner only)",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: jsonContent(z.object({ message: z.string() }), "Idea deleted successfully"),
    401: jsonContent(ErrorSchema, "Unauthorized"),
    403: jsonContent(ErrorSchema, "Forbidden - not the owner"),
    404: jsonContent(ErrorSchema, "Idea not found"),
  },
});

export const getIdeasByUser = createRoute({
  operationId: "getIdeasByUser",
  path: "/ideas/user/{username}",
  method: "get",
  tags,
  summary: "Get ideas by username",
  request: {
    params: z.object({
      username: z.string(),
    }),
  },
  responses: {
    200: jsonContent(ideaListResponseSchema, "Ideas retrieved successfully"),
    404: jsonContent(ErrorSchema, "User not found"),
  },
});

export const getCurrentUserIdeas = createRoute({
  operationId: "getCurrentUserIdeas",
  path: "/ideas/current",
  method: "get",
  tags,
  summary: "Get ideas by current authenticated user",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
  },
  responses: {
    200: jsonContent(ideaListResponseSchema, "Ideas retrieved successfully"),
    401: jsonContent(ErrorSchema, "Unauthorized"),
  },
});

export const getAllTags = createRoute({
  operationId: "getAllTags",
  path: "/ideas/tags",
  method: "get",
  tags,
  summary: "Get all unique tags from ideas",
  responses: {
    200: jsonContent(tagsResponseSchema, "Tags retrieved successfully"),
  },
});

export type GetAllIdeasRoute = typeof getAllIdeas;
export type CreateIdeaRoute = typeof createIdea;
export type GetIdeaByIdRoute = typeof getIdeaById;
export type UpdateIdeaRoute = typeof updateIdea;
export type DeleteIdeaRoute = typeof deleteIdea;
export type GetIdeasByUserRoute = typeof getIdeasByUser;
export type GetCurrentUserIdeasRoute = typeof getCurrentUserIdeas;
export type GetAllTagsRoute = typeof getAllTags;
