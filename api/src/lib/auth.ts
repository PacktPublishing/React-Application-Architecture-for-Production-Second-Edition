import type { Context } from "hono";

import bcrypt from "bcryptjs";
import { eq, lt } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

import db from "@/db";
import { refreshTokens } from "@/db/schema";
import env from "@/env";

const JWT_SECRET = env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  }
  catch {
    return null;
  }
}

export async function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, 12);
}

export async function compareRefreshToken(token: string, hashedToken: string): Promise<boolean> {
  return bcrypt.compare(token, hashedToken);
}

export interface RefreshResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  error?: string;
}

export async function generateAndSetTokens(c: Context, userId: string): Promise<{ accessToken: string; refreshToken: string }> {
  // Generate new tokens
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  const refreshTokenHash = await hashRefreshToken(refreshToken);

  // Store refresh token in database
  await db.insert(refreshTokens).values({
    tokenHash: refreshTokenHash,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Set cookies
  const authCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "Lax" as const,
    path: "/",
  };

  setCookie(c, "accessToken", accessToken, {
    ...authCookieOptions,
    maxAge: 60 * 60, // 1 hour
  });

  setCookie(c, "refreshToken", refreshToken, {
    ...authCookieOptions,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { accessToken, refreshToken };
}

export async function refreshAndSetTokens(c: Context, userId: string, oldTokenId: string): Promise<{ accessToken: string; refreshToken: string }> {
  // Delete old refresh token first
  await db.delete(refreshTokens)
    .where(eq(refreshTokens.id, oldTokenId));

  // Generate and set new tokens (this will insert the new refresh token)
  const { accessToken, refreshToken } = await generateAndSetTokens(c, userId);
  return { accessToken, refreshToken };
}

export async function cleanupExpiredTokens(): Promise<void> {
  try {
    await db.delete(refreshTokens)
      .where(lt(refreshTokens.expiresAt, new Date()));
  }
  catch (error) {
    console.error("Failed to cleanup expired tokens:", error);
  }
}

export async function refreshTokensIfValid(c: Context, refreshToken: string): Promise<RefreshResult> {
  try {
    // Verify the refresh token JWT
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return { success: false, error: "Invalid refresh token" };
    }

    // Find matching refresh token in database
    const allRefreshTokens = await db.select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, decoded.userId));

    let matchedToken = null;
    for (const storedToken of allRefreshTokens) {
      const isMatch = await compareRefreshToken(refreshToken, storedToken.tokenHash);
      if (isMatch) {
        // Check if token is expired
        if (storedToken.expiresAt < new Date()) {
          await db.delete(refreshTokens)
            .where(eq(refreshTokens.id, storedToken.id));
          return { success: false, error: "Refresh token expired" };
        }
        matchedToken = storedToken;
        break;
      }
    }

    if (!matchedToken) {
      return { success: false, error: "Refresh token not found" };
    }

    // Generate new tokens and set cookies
    const tokens = await refreshAndSetTokens(c, decoded.userId, matchedToken.id);

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, success: true, userId: decoded.userId };
  }
  catch (error) {
    console.error("Token refresh failed:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      refreshToken: `${refreshToken.substring(0, 10)}...`, // Log partial token for debugging
    });
    return { success: false, error: "Token refresh failed" };
  }
}
