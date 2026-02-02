import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { ideas, reviews, users } from "@/db/schema";

import type {
  CreateIdeaRoute,
  DeleteIdeaRoute,
  GetAllIdeasRoute,
  GetAllTagsRoute,
  GetCurrentUserIdeasRoute,
  GetIdeaByIdRoute,
  GetIdeasByUserRoute,
  UpdateIdeaRoute,
} from "./ideas.routes";

function formatIdeaResponse(idea: any) {
  return {
    id: idea.id,
    title: idea.title,
    shortDescription: idea.shortDescription,
    description: idea.description,
    tags: JSON.parse(idea.tags || "[]"),
    authorId: idea.authorId,
    author: {
      id: idea.author.id,
      username: idea.author.username,
      email: idea.author.email,
      bio: idea.author.bio,
    },
    reviewsCount: idea.reviewsCount ?? 0,
    avgRating: idea.avgRating != null ? Number.parseFloat(Number(idea.avgRating).toFixed(2)) : null,
    createdAt: idea.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: idea.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

export const getAllIdeas: AppRouteHandler<GetAllIdeasRoute> = async (c) => {
  const { page: pageStr, limit: limitStr, search, tags: tagsStr, sortBy } = c.req.valid("query");

  const page = Number.parseInt(pageStr, 10);
  const limit = Math.min(Number.parseInt(limitStr, 10), 100); // Cap at 100
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(ideas.title, `%${search}%`),
        like(ideas.description, `%${search}%`),
      ),
    );
  }

  if (tagsStr) {
    const requestedTags = tagsStr.split(",").map(tag => tag.trim());
    for (const tag of requestedTags) {
      conditions.push(like(ideas.tags, `%"${tag}"%`));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Build the query
  const query = db.select({
    id: ideas.id,
    title: ideas.title,
    shortDescription: ideas.shortDescription,
    description: ideas.description,
    tags: ideas.tags,
    authorId: ideas.authorId,
    createdAt: ideas.createdAt,
    updatedAt: ideas.updatedAt,
    reviewsCount: sql<number>`cast(count(${reviews.id}) as integer)`.as("reviewsCount"),
    avgRating: sql<number | null>`avg(${reviews.rating})`.as("avgRating"),
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .leftJoin(reviews, eq(ideas.id, reviews.ideaId))
    .where(whereClause)
    .groupBy(ideas.id, users.id)
    .limit(limit)
    .offset(offset);

  // Apply sorting based on sortBy parameter
  switch (sortBy) {
    case "oldest":
      query.orderBy(asc(ideas.createdAt));
      break;
    case "rating":
      // Sort by avgRating DESC (highest first), then by createdAt DESC as tiebreaker
      query.orderBy(desc(sql`avg(${reviews.rating})`), desc(ideas.createdAt));
      break;
    case "reviews":
      // Sort by reviewsCount DESC (most reviews first), then by createdAt DESC as tiebreaker
      query.orderBy(desc(sql`count(${reviews.id})`), desc(ideas.createdAt));
      break;
    case "newest":
    default:
      query.orderBy(desc(ideas.createdAt));
      break;
  }

  const [ideasResult, countResult] = await Promise.all([
    query,

    db.select({ count: sql<number>`count(*)` })
      .from(ideas)
      .innerJoin(users, eq(ideas.authorId, users.id))
      .where(whereClause),
  ]);

  const total = countResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return c.json({
    data: ideasResult.map(formatIdeaResponse),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      prevPage,
      nextPage,
    },
  }, 200);
};

export const createIdea: AppRouteHandler<CreateIdeaRoute> = async (c) => {
  const user = c.get("user");

  const { title, shortDescription, description, tags } = c.req.valid("json");

  const [newIdea] = await db.insert(ideas)
    .values({
      title,
      shortDescription,
      description,
      tags: JSON.stringify(tags || []),
      authorId: user!.id,
    })
    .returning();

  // Fetch the created idea with author info
  const [ideaWithAuthor] = await db.select({
    id: ideas.id,
    title: ideas.title,
    shortDescription: ideas.shortDescription,
    description: ideas.description,
    tags: ideas.tags,
    authorId: ideas.authorId,
    createdAt: ideas.createdAt,
    updatedAt: ideas.updatedAt,
    reviewsCount: sql<number>`cast(count(${reviews.id}) as integer)`.as("reviewsCount"),
    avgRating: sql<number | null>`avg(${reviews.rating})`.as("avgRating"),
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .leftJoin(reviews, eq(ideas.id, reviews.ideaId))
    .where(eq(ideas.id, newIdea.id))
    .groupBy(ideas.id, users.id);

  return c.json(formatIdeaResponse(ideaWithAuthor), 201);
};

export const getIdeaById: AppRouteHandler<GetIdeaByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const ideaId = id;

  const [idea] = await db.select({
    id: ideas.id,
    title: ideas.title,
    shortDescription: ideas.shortDescription,
    description: ideas.description,
    tags: ideas.tags,
    authorId: ideas.authorId,
    createdAt: ideas.createdAt,
    updatedAt: ideas.updatedAt,
    reviewsCount: sql<number>`cast(count(${reviews.id}) as integer)`.as("reviewsCount"),
    avgRating: sql<number | null>`avg(${reviews.rating})`.as("avgRating"),
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .leftJoin(reviews, eq(ideas.id, reviews.ideaId))
    .where(eq(ideas.id, ideaId))
    .groupBy(ideas.id, users.id)
    .limit(1);

  if (!idea) {
    throw new HTTPException(404, { message: "Idea not found" });
  }

  return c.json(formatIdeaResponse(idea), 200);
};

export const updateIdea: AppRouteHandler<UpdateIdeaRoute> = async (c) => {
  const user = c.get("user");

  const { id } = c.req.valid("param");
  const ideaId = id;
  const updateData = c.req.valid("json");

  // Check if idea exists and user is the owner
  const [existingIdea] = await db.select()
    .from(ideas)
    .where(eq(ideas.id, ideaId))
    .limit(1);

  if (!existingIdea) {
    throw new HTTPException(404, { message: "Idea not found" });
  }

  if (existingIdea.authorId !== user!.id) {
    throw new HTTPException(403, { message: "Forbidden - you can only update your own ideas" });
  }

  // Prepare update object
  const updateFields: any = {};
  if (updateData.title !== undefined)
    updateFields.title = updateData.title;
  if (updateData.shortDescription !== undefined)
    updateFields.shortDescription = updateData.shortDescription;
  if (updateData.description !== undefined)
    updateFields.description = updateData.description;
  if (updateData.tags !== undefined)
    updateFields.tags = JSON.stringify(updateData.tags);

  await db.update(ideas)
    .set(updateFields)
    .where(eq(ideas.id, ideaId));

  // Fetch updated idea with author info
  const [updatedIdea] = await db.select({
    id: ideas.id,
    title: ideas.title,
    shortDescription: ideas.shortDescription,
    description: ideas.description,
    tags: ideas.tags,
    authorId: ideas.authorId,
    createdAt: ideas.createdAt,
    updatedAt: ideas.updatedAt,
    reviewsCount: sql<number>`cast(count(${reviews.id}) as integer)`.as("reviewsCount"),
    avgRating: sql<number | null>`avg(${reviews.rating})`.as("avgRating"),
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .leftJoin(reviews, eq(ideas.id, reviews.ideaId))
    .where(eq(ideas.id, ideaId))
    .groupBy(ideas.id, users.id);

  return c.json(formatIdeaResponse(updatedIdea), 200);
};

export const deleteIdea: AppRouteHandler<DeleteIdeaRoute> = async (c) => {
  const user = c.get("user");

  const { id } = c.req.valid("param");
  const ideaId = id;

  // Check if idea exists and user is the owner
  const [existingIdea] = await db.select()
    .from(ideas)
    .where(eq(ideas.id, ideaId))
    .limit(1);

  if (!existingIdea) {
    throw new HTTPException(404, { message: "Idea not found" });
  }

  if (existingIdea.authorId !== user!.id) {
    throw new HTTPException(403, { message: "Forbidden - you can only delete your own ideas" });
  }

  await db.delete(ideas)
    .where(eq(ideas.id, ideaId));

  return c.json({ message: "Idea deleted successfully" }, 200);
};

export const getIdeasByUser: AppRouteHandler<GetIdeasByUserRoute> = async (c) => {
  const { username } = c.req.valid("param");

  // Check if user exists
  const [user] = await db.select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  const ideasResult = await db.select({
    id: ideas.id,
    title: ideas.title,
    shortDescription: ideas.shortDescription,
    description: ideas.description,
    tags: ideas.tags,
    authorId: ideas.authorId,
    createdAt: ideas.createdAt,
    updatedAt: ideas.updatedAt,
    reviewsCount: sql<number>`cast(count(${reviews.id}) as integer)`.as("reviewsCount"),
    avgRating: sql<number | null>`avg(${reviews.rating})`.as("avgRating"),
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .leftJoin(reviews, eq(ideas.id, reviews.ideaId))
    .where(eq(ideas.authorId, user.id))
    .groupBy(ideas.id, users.id)
    .orderBy(sql`${ideas.createdAt} DESC`);

  return c.json({
    data: ideasResult.map(formatIdeaResponse),
  }, 200);
};

export const getCurrentUserIdeas: AppRouteHandler<GetCurrentUserIdeasRoute> = async (c) => {
  const user = c.get("user");

  const ideasResult = await db.select({
    id: ideas.id,
    title: ideas.title,
    shortDescription: ideas.shortDescription,
    description: ideas.description,
    tags: ideas.tags,
    authorId: ideas.authorId,
    createdAt: ideas.createdAt,
    updatedAt: ideas.updatedAt,
    reviewsCount: sql<number>`cast(count(${reviews.id}) as integer)`.as("reviewsCount"),
    avgRating: sql<number | null>`avg(${reviews.rating})`.as("avgRating"),
    author: {
      id: users.id,
      username: users.username,
      email: users.email,
      bio: users.bio,
    },
  })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .leftJoin(reviews, eq(ideas.id, reviews.ideaId))
    .where(eq(ideas.authorId, user!.id))
    .groupBy(ideas.id, users.id)
    .orderBy(sql`${ideas.createdAt} DESC`);

  return c.json({
    data: ideasResult.map(formatIdeaResponse),
  }, 200);
};

export const getAllTags: AppRouteHandler<GetAllTagsRoute> = async (c) => {
  const PREDEFINED_TAGS = [
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Healthcare",
    "Education",
    "Finance",
    "E-commerce",
    "Productivity",
    "Entertainment",
    "Social Media",
    "Security",
    "IoT",
    "Automation",
    "Analytics",
    "Mobile App",
    "Web App",
    "API",
    "Chatbot",
    "Recommendation System",
    "Data Processing",
    "Real-time",
    "Cloud Computing",
    "Blockchain",
    "AR/VR",
    "Gaming",
  ];

  return c.json({
    data: (PREDEFINED_TAGS).sort(),
  }, 200);
};
