import type { Context, Next } from "hono";

import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";

import db from "@/db";
import { users } from "@/db/schema";
import env from "@/env";
import { verifyToken } from "@/lib/auth";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extracts the token from either cookies or Authorization header
 * Checks Bearer token in Authorization header first, then falls back to cookie
 */
function getToken(c: Context): string | undefined {
  // Check Authorization header for Bearer token first
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Fall back to cookie
  return getCookie(c, "accessToken");
}

export async function authMiddleware(c: Context, next: Next) {
  // If BYPASS_AUTH is set, authenticate as test1@mail.com
  if (env.BYPASS_AUTH) {
    const user = await db.select()
      .from(users)
      .where(eq(users.email, "test1@mail.com"))
      .limit(1);

    if (user.length > 0) {
      c.set("user", {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        bio: user[0].bio,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt,
      } as AuthUser);
      return next();
    }
  }

  const token = getToken(c);

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const user = await db.select()
    .from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1);

  if (user.length === 0) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user", {
    id: user[0].id,
    email: user[0].email,
    username: user[0].username,
    bio: user[0].bio,
    createdAt: user[0].createdAt,
    updatedAt: user[0].updatedAt,
  } as AuthUser);

  return next();
}

export async function optionalAuthMiddleware(c: Context, next: Next) {
  // If BYPASS_AUTH is set, authenticate as test1@mail.com
  if (env.BYPASS_AUTH) {
    const user = await db.select()
      .from(users)
      .where(eq(users.email, "test1@mail.com"))
      .limit(1);

    if (user.length > 0) {
      c.set("user", {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        bio: user[0].bio,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt,
      } as AuthUser);
      return next();
    }
  }

  const token = getToken(c);

  if (!token) {
    return next();
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return next();
  }

  const user = await db.select()
    .from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1);

  if (user.length > 0) {
    c.set("user", {
      id: user[0].id,
      email: user[0].email,
      username: user[0].username,
      bio: user[0].bio,
      createdAt: user[0].createdAt,
      updatedAt: user[0].updatedAt,
    } as AuthUser);
  }

  return next();
}
