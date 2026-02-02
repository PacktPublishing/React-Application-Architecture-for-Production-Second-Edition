import { and, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { ideas, reviews, users } from "@/db/schema";

import type {
  CreateReviewRoute,
  DeleteReviewRoute,
  GetCurrentUserReviewsRoute,
  GetReviewsByIdeaRoute,
  GetReviewsByUserRoute,
  UpdateReviewRoute,
} from "./reviews.routes";

interface ReviewWithAuthor {
  id: string;
  content: string;
  rating: number;
  authorId: string;
  ideaId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  author: {
    id: string;
    username: string;
    email: string;
    bio: string;
  };
}

type ReviewWithAuthorAndIdea = ReviewWithAuthor & {
  idea: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    tags: string;
  };
};

interface FormattedReviewBase {
  id: string;
  content: string;
  rating: number;
  authorId: string;
  author: {
    id: string;
    username: string;
    email: string;
    bio: string;
  };
  ideaId: string;
  createdAt: string;
  updatedAt: string;
}

type FormattedReviewWithIdea = FormattedReviewBase & {
  idea: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    tags: string[];
  };
};

function formatReviewResponse(review: ReviewWithAuthorAndIdea, includeIdea: true): FormattedReviewWithIdea;
function formatReviewResponse(review: ReviewWithAuthor, includeIdea?: false): FormattedReviewBase;
function formatReviewResponse(
  review: ReviewWithAuthor | ReviewWithAuthorAndIdea,
  includeIdea = false,
): FormattedReviewBase | FormattedReviewWithIdea {
  const baseFormatted: FormattedReviewBase = {
    id: review.id,
    content: review.content,
    rating: review.rating,
    authorId: review.authorId,
    author: {
      id: review.author.id,
      username: review.author.username,
      email: review.author.email,
      bio: review.author.bio,
    },
    ideaId: review.ideaId,
    createdAt: review.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: review.updatedAt?.toISOString() || new Date().toISOString(),
  };

  if (includeIdea && "idea" in review && review.idea) {
    return {
      ...baseFormatted,
      idea: {
        id: review.idea.id,
        title: review.idea.title,
        shortDescription: review.idea.shortDescription,
        description: review.idea.description,
        tags: JSON.parse(review.idea.tags || "[]"),
      },
    };
  }

  return baseFormatted;
}

export const createReview: AppRouteHandler<CreateReviewRoute> = async (c) => {
  const user = c.get("user");
  const { content, rating, ideaId } = c.req.valid("json");

  // Check if idea exists
  const [existingIdea] = await db.select()
    .from(ideas)
    .where(eq(ideas.id, ideaId))
    .limit(1);

  if (!existingIdea) {
    throw new HTTPException(404, { message: "Idea not found" });
  }

  // Check if user already reviewed this idea
  const [existingReview] = await db.select()
    .from(reviews)
    .where(and(eq(reviews.authorId, user!.id), eq(reviews.ideaId, ideaId)))
    .limit(1);

  if (existingReview) {
    throw new HTTPException(409, { message: "You have already reviewed this idea" });
  }

  const [newReview] = await db.insert(reviews)
    .values({
      content,
      rating,
      ideaId,
      authorId: user!.id,
    })
    .returning();

  // Fetch the created review with author info
  const [reviewWithAuthor] = await db.select({
    id: reviews.id,
    content: reviews.content,
    rating: reviews.rating,
    authorId: reviews.authorId,
    ideaId: reviews.ideaId,
    createdAt: reviews.createdAt,
    updatedAt: reviews.updatedAt,
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(reviews)
    .innerJoin(users, eq(reviews.authorId, users.id))
    .where(eq(reviews.id, newReview.id));

  return c.json(formatReviewResponse(reviewWithAuthor), 201);
};

export const updateReview: AppRouteHandler<UpdateReviewRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const reviewId = id;
  const updateData = c.req.valid("json");

  // Check if review exists and user is the owner
  const [existingReview] = await db.select()
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1);

  if (!existingReview) {
    throw new HTTPException(404, { message: "Review not found" });
  }

  if (existingReview.authorId !== user!.id) {
    throw new HTTPException(403, { message: "Forbidden - you can only update your own reviews" });
  }

  // Prepare update object
  const updateFields: any = {};
  if (updateData.content !== undefined)
    updateFields.content = updateData.content;
  if (updateData.rating !== undefined)
    updateFields.rating = updateData.rating;

  await db.update(reviews)
    .set(updateFields)
    .where(eq(reviews.id, reviewId));

  // Fetch updated review with author info
  const [updatedReview] = await db.select({
    id: reviews.id,
    content: reviews.content,
    rating: reviews.rating,
    authorId: reviews.authorId,
    ideaId: reviews.ideaId,
    createdAt: reviews.createdAt,
    updatedAt: reviews.updatedAt,
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(reviews)
    .innerJoin(users, eq(reviews.authorId, users.id))
    .where(eq(reviews.id, reviewId));

  return c.json(formatReviewResponse(updatedReview), 200);
};

export const deleteReview: AppRouteHandler<DeleteReviewRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const reviewId = id;

  // Check if review exists and user is the owner
  const [existingReview] = await db.select()
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1);

  if (!existingReview) {
    throw new HTTPException(404, { message: "Review not found" });
  }

  if (existingReview.authorId !== user!.id) {
    throw new HTTPException(403, { message: "Forbidden - you can only delete your own reviews" });
  }

  await db.delete(reviews)
    .where(eq(reviews.id, reviewId));

  return c.json({ message: "Review deleted successfully" }, 200);
};

export const getReviewsByUser: AppRouteHandler<GetReviewsByUserRoute> = async (c) => {
  const { username } = c.req.valid("param");

  // Check if user exists
  const [user] = await db.select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  const reviewsResult = await db.select({
    id: reviews.id,
    content: reviews.content,
    rating: reviews.rating,
    authorId: reviews.authorId,
    ideaId: reviews.ideaId,
    createdAt: reviews.createdAt,
    updatedAt: reviews.updatedAt,
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
    idea: {
      id: ideas.id,
      title: ideas.title,
      shortDescription: ideas.shortDescription,
      description: ideas.description,
      tags: ideas.tags,
    },
  })
    .from(reviews)
    .innerJoin(users, eq(reviews.authorId, users.id))
    .innerJoin(ideas, eq(reviews.ideaId, ideas.id))
    .where(eq(reviews.authorId, user.id))
    .orderBy(sql`${reviews.createdAt} DESC`);

  return c.json({
    data: reviewsResult.map(review => formatReviewResponse(review, true)),
  }, 200);
};

export const getCurrentUserReviews: AppRouteHandler<GetCurrentUserReviewsRoute> = async (c) => {
  const user = c.get("user");

  const reviewsResult = await db.select({
    id: reviews.id,
    content: reviews.content,
    rating: reviews.rating,
    authorId: reviews.authorId,
    ideaId: reviews.ideaId,
    createdAt: reviews.createdAt,
    updatedAt: reviews.updatedAt,
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
    idea: {
      id: ideas.id,
      title: ideas.title,
      shortDescription: ideas.shortDescription,
      description: ideas.description,
      tags: ideas.tags,
    },
  })
    .from(reviews)
    .innerJoin(users, eq(reviews.authorId, users.id))
    .innerJoin(ideas, eq(reviews.ideaId, ideas.id))
    .where(eq(reviews.authorId, user!.id))
    .orderBy(sql`${reviews.createdAt} DESC`);

  return c.json({
    data: reviewsResult.map(review => formatReviewResponse(review, true)),
  }, 200);
};

export const getReviewsByIdea: AppRouteHandler<GetReviewsByIdeaRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const ideaId = id;

  // Check if idea exists
  const [existingIdea] = await db.select()
    .from(ideas)
    .where(eq(ideas.id, ideaId))
    .limit(1);

  if (!existingIdea) {
    throw new HTTPException(404, { message: "Idea not found" });
  }

  const reviewsResult = await db.select({
    id: reviews.id,
    content: reviews.content,
    rating: reviews.rating,
    authorId: reviews.authorId,
    ideaId: reviews.ideaId,
    createdAt: reviews.createdAt,
    updatedAt: reviews.updatedAt,
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(reviews)
    .innerJoin(users, eq(reviews.authorId, users.id))
    .where(eq(reviews.ideaId, ideaId))
    .orderBy(sql`${reviews.createdAt} DESC`);

  return c.json({
    data: reviewsResult.map(review => formatReviewResponse(review)),
  }, 200);
};
