// Import relations from drizzle-orm
import { relations } from "drizzle-orm";

// Import all models
import { loginSchema, refreshTokens } from "./models/auth";
import { ideas, insertIdeasSchema, selectIdeasSchema, updateIdeasSchema } from "./models/idea";
import { insertReviewsSchema, reviews, selectReviewsSchema, updateReviewsSchema } from "./models/review";
import { insertUsersSchema, selectUsersSchema, updateProfileSchema, users } from "./models/user";

// Define relations here to avoid circular imports
export const usersRelations = relations(users, ({ many }) => ({
  ideas: many(ideas),
  reviews: many(reviews),
  refreshTokens: many(refreshTokens),
}));

export const ideasRelations = relations(ideas, ({ one, many }) => ({
  author: one(users, {
    fields: [ideas.authorId],
    references: [users.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  author: one(users, {
    fields: [reviews.authorId],
    references: [users.id],
  }),
  idea: one(ideas, {
    fields: [reviews.ideaId],
    references: [ideas.id],
  }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

// Re-export everything for backward compatibility
export {
  // Tables
  ideas,
  // Schemas
  insertIdeasSchema,
  insertReviewsSchema,
  insertUsersSchema,

  loginSchema,
  refreshTokens,
  reviews,
  selectIdeasSchema,
  selectReviewsSchema,
  selectUsersSchema,
  updateIdeasSchema,
  updateProfileSchema,
  updateReviewsSchema,
  users,
};
