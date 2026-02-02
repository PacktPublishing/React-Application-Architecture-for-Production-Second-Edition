import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { insertUsersSchema, loginSchema } from "@/db/schema";
import { AuthResponseSchema, CurrentUserSchema, ErrorSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares/auth";

const tags = ["Auth"];

export const getCurrentUser = createRoute({
  operationId: "getCurrentUser",
  path: "/auth/me",
  method: "get",
  tags,
  summary: "Get current user profile",
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  responses: {
    200: jsonContent(
      CurrentUserSchema,
      "Current user profile",
    ),
    401: jsonContent(ErrorSchema, "Unauthorized"),
  },
});

export const register = createRoute({
  operationId: "registerUser",
  path: "/auth/register",
  method: "post",
  tags,
  summary: "Register a new user",
  request: {
    body: jsonContentRequired(insertUsersSchema, "User registration data"),
  },
  responses: {
    201: jsonContent(AuthResponseSchema, "User registered successfully"),
    409: jsonContent(ErrorSchema, "User already exists"),
  },
});

export const login = createRoute({
  operationId: "loginUser",
  path: "/auth/login",
  method: "post",
  tags,
  summary: "Login with email and password",
  request: {
    body: jsonContentRequired(loginSchema, "User login credentials"),
  },
  responses: {
    200: jsonContent(AuthResponseSchema, "User logged in successfully"),
    401: jsonContent(ErrorSchema, "Invalid credentials"),
  },
});

export const logout = createRoute({
  operationId: "logoutUser",
  path: "/auth/logout",
  method: "post",
  tags,
  summary: "Logout current user",
  responses: {
    200: jsonContent(createMessageObjectSchema("Logged out successfully"), "User logged out successfully"),
  },
});

export const refresh = createRoute({
  operationId: "refreshToken",
  path: "/auth/refresh",
  method: "post",
  tags,
  summary: "Refresh access token using refresh token",
  responses: {
    200: jsonContent(z.object({ accessToken: z.string() }), "Access token refreshed successfully"),
    401: jsonContent(ErrorSchema, "Invalid or expired refresh token"),
  },
});

export type GetCurrentUserRoute = typeof getCurrentUser;
export type RegisterRoute = typeof register;
export type LoginRoute = typeof login;
export type LogoutRoute = typeof logout;
export type RefreshRoute = typeof refresh;
