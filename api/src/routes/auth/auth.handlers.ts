import { eq } from "drizzle-orm";
import { deleteCookie, getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { refreshTokens, users } from "@/db/schema";
import { comparePassword, compareRefreshToken, generateAndSetTokens, hashPassword, refreshTokensIfValid, verifyToken } from "@/lib/auth";

import type { GetCurrentUserRoute, LoginRoute, LogoutRoute, RefreshRoute, RegisterRoute } from "./auth.routes";

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const { email, username, bio, password } = c.req.valid("json");

  const existingUsers = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUsers.length > 0) {
    throw new HTTPException(409, { message: "User already exists" });
  }

  const existingUsername = await db.select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existingUsername.length > 0) {
    throw new HTTPException(409, { message: "Username already taken" });
  }

  const hashedPassword = await hashPassword(password);

  const [newUser] = await db.insert(users)
    .values({
      email,
      username,
      bio,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      bio: users.bio,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  const { accessToken } = await generateAndSetTokens(c, newUser.id);

  return c.json({
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      bio: newUser.bio,
      createdAt: newUser.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: newUser.updatedAt?.toISOString() || new Date().toISOString(),
    },
    accessToken,
  }, 201);
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Always run password comparison to prevent timing attacks
  // Use a dummy hash if user doesn't exist to maintain consistent timing
  const dummyHash = "$2a$12$dummy.hash.to.prevent.timing.attacks";
  const passwordToCheck = user.length > 0 ? user[0].password : dummyHash;

  const isValidPassword = await comparePassword(password, passwordToCheck);

  if (!isValidPassword || user.length === 0) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const { accessToken } = await generateAndSetTokens(c, user[0].id);

  return c.json({
    user: {
      id: user[0].id,
      email: user[0].email,
      username: user[0].username,
      bio: user[0].bio,
      createdAt: user[0].createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user[0].updatedAt?.toISOString() || new Date().toISOString(),
    },
    accessToken,
  }, 200);
};

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
  const refreshToken = getCookie(c, "refreshToken");

  if (refreshToken) {
    // Verify the refresh token JWT to get userId for efficient lookup
    const decoded = verifyToken(refreshToken);

    if (decoded) {
      // Get all refresh tokens for this user only (much more efficient)
      const userRefreshTokens = await db.select()
        .from(refreshTokens)
        .where(eq(refreshTokens.userId, decoded.userId));

      // Find and delete the specific refresh token
      for (const storedToken of userRefreshTokens) {
        const isMatch = await compareRefreshToken(refreshToken, storedToken.tokenHash);
        if (isMatch) {
          await db.delete(refreshTokens)
            .where(eq(refreshTokens.id, storedToken.id));
          break;
        }
      }
    }
  }

  deleteCookie(c, "accessToken", {
    path: "/",
  });

  deleteCookie(c, "refreshToken", {
    path: "/",
  });

  return c.json({ message: "Logged out successfully" }, 200);
};

export const refreshHandler: AppRouteHandler<RefreshRoute> = async (c) => {
  const refreshToken = getCookie(c, "refreshToken");

  if (!refreshToken) {
    throw new HTTPException(401, { message: "Refresh token not found" });
  }

  const result = await refreshTokensIfValid(c, refreshToken);

  if (!result.success || !result.accessToken) {
    throw new HTTPException(401, { message: result.error || "Token refresh failed" });
  }

  return c.json({ accessToken: result.accessToken }, 200);
};

export const getCurrentUser: AppRouteHandler<GetCurrentUserRoute> = async (c) => {
  const user = c.get("user");

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return c.json({
    id: user.id,
    email: user.email,
    username: user.username,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }, 200);
};
