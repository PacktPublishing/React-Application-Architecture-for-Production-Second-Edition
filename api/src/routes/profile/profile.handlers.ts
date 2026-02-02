import { eq, or } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { users } from "@/db/schema";

import type { GetUserByUsernameRoute, UpdateProfileRoute } from "./profile.routes";

export const getUserByUsername: AppRouteHandler<GetUserByUsernameRoute> = async (c) => {
  const { username } = c.req.valid("param");

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      bio: users.bio,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    return c.json({ message: "User not found" }, 404);
  }

  return c.json(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    },
    200,
  );
};

export const updateProfile: AppRouteHandler<UpdateProfileRoute> = async (c) => {
  const user = c.get("user");
  const updateData = c.req.valid("json");

  const [updatedUser] = await db
    .update(users)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user!.id))
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      bio: users.bio,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return c.json(
    {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: updatedUser.updatedAt?.toISOString() || new Date().toISOString(),
    },
    200,
  );
};
