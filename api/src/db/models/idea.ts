import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

// Import users table for foreign key reference
import { users } from "./user";

export const ideas = sqliteTable("ideas", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: text().notNull(),
  shortDescription: text("short_description").notNull(),
  description: text().notNull(),
  tags: text().notNull().default("[]"),
  authorId: text("author_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Relations will be defined in the main schema file to avoid circular imports

export const selectIdeasSchema = toZodV4SchemaTyped(createSelectSchema(ideas, {
  tags: z.string().transform((str) => {
    try {
      return JSON.parse(str);
    }
    catch {
      return [];
    }
  }),
}));

export const insertIdeasSchema = toZodV4SchemaTyped(createInsertSchema(
  ideas,
  {
    title: field => field.min(1).max(255),
    shortDescription: field => field.min(1).max(500),
    description: field => field.min(1),
    tags: () => z.array(z.string()).default([]),
  },
).required({
  title: true,
  shortDescription: true,
  description: true,
}).omit({
  id: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
}));

export const updateIdeasSchema = toZodV4SchemaTyped(z.object({
  title: z.string().min(1).max(255).optional(),
  shortDescription: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
}));
