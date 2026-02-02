import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { updateProfileSchema } from "@/db/schema";
import { ErrorSchema, UserSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares/auth";

const tags = ["Profile"];

export const getUserByUsername = createRoute({
  operationId: "getUserByUsername",
  path: "/profile/{username}",
  method: "get",
  tags,
  summary: "Get user by username",
  request: {
    params: z.object({
      username: z.string().min(3).max(50),
    }),
  },
  responses: {
    200: jsonContent(
      UserSchema,
      "User profile",
    ),
    404: jsonContent(
      ErrorSchema,
      "User not found",
    ),
  },
});

export const updateProfile = createRoute({
  operationId: "updateProfile",
  path: "/profile",
  method: "patch",
  tags,
  summary: "Update current user profile",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentRequired(updateProfileSchema, "Profile update data"),
  },
  responses: {
    200: jsonContent(
      UserSchema,
      "Updated user profile",
    ),
    400: jsonContent(
      ErrorSchema,
      "Validation error",
    ),
    401: jsonContent(
      ErrorSchema,
      "Unauthorized",
    ),
    409: jsonContent(
      ErrorSchema,
      "Email or username already exists",
    ),
  },
});

export type GetUserByUsernameRoute = typeof getUserByUsername;
export type UpdateProfileRoute = typeof updateProfile;
