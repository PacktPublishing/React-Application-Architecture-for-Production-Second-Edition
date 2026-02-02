import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

// Import users table for foreign key reference
import { users } from "./user";

export const refreshTokens = sqliteTable("refresh_tokens", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  tokenHash: text("token_hash").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

// Relations will be defined in the main schema file to avoid circular imports

export const loginSchema = toZodV4SchemaTyped(z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(255),
}));
