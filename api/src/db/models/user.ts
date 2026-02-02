import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

export const users = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  email: text().notNull().unique(),
  username: text().notNull().unique(),
  bio: text().notNull().default(""),
  password: text().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Relations will be defined in the main schema file to avoid circular imports

export const selectUsersSchema = toZodV4SchemaTyped(createSelectSchema(users));

export const insertUsersSchema = toZodV4SchemaTyped(createInsertSchema(
  users,
  {
    email: field => field.email().max(255),
    username: field => field.min(3).max(50),
    bio: field => field.max(500).default(""),
    password: field => field.min(8).max(255),
  },
).required({
  email: true,
  username: true,
  password: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}));

export const updateProfileSchema = toZodV4SchemaTyped(z.object({
  bio: z.string().max(500),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
}));
