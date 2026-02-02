import { z } from "@hono/zod-openapi";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

// Import tables for foreign key references
import { ideas } from "./idea";
import { users } from "./user";

export const reviews = sqliteTable("reviews", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  content: text().notNull(),
  rating: integer().notNull(),
  authorId: text("author_id").notNull().references(() => users.id),
  ideaId: text("idea_id").notNull().references(() => ideas.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
}, table => ({
  ideaIdIdx: index("reviews_idea_id_idx").on(table.ideaId),
}));

// Relations will be defined in the main schema file to avoid circular imports

export const selectReviewsSchema = toZodV4SchemaTyped(createSelectSchema(reviews));

export const insertReviewsSchema = toZodV4SchemaTyped(createInsertSchema(
  reviews,
  {
    content: field => field.min(1).max(2000),
    rating: field => field.min(1).max(5),
  },
).required({
  content: true,
  rating: true,
  ideaId: true,
}).omit({
  id: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
}));

export const updateReviewsSchema = toZodV4SchemaTyped(z.object({
  content: z.string().min(1).max(2000).optional(),
  rating: z.number().min(1).max(5).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
}));
