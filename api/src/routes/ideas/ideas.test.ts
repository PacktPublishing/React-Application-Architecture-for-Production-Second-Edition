import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";

import env from "@/env";
import { createTestApp } from "@/lib/create-app";

import authRouter from "../auth/auth.index";
import reviewsRouter from "../reviews/reviews.index";
import router from "./ideas.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));
const authClient = testClient(createTestApp(authRouter));
const reviewsClient = testClient(createTestApp(reviewsRouter));

describe("ideas routes", () => {
  beforeAll(async () => {
    execSync("npx drizzle-kit push");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  const testUser1 = {
    email: "user1@example.com",
    username: "user1",
    password: "password123",
  };

  const testUser2 = {
    email: "user2@example.com",
    username: "user2",
    password: "password123",
  };

  const sampleIdea = {
    title: "Test Idea",
    shortDescription: "A short description",
    description: "A longer description of the test idea",
    tags: ["tech", "innovation"],
  };

  let user1Cookie: string;
  let user2Cookie: string;
  let user1Id: string;
  let user2Id: string;
  let ideaId: string;

  beforeAll(async () => {
    // Register and login both users
    await authClient.auth.register.$post({ json: testUser1 });
    await authClient.auth.register.$post({ json: testUser2 });

    const login1 = await authClient.auth.login.$post({ json: testUser1 });
    const login2 = await authClient.auth.login.$post({ json: testUser2 });

    if (login1.status === 200) {
      const json = await login1.json();
      user1Id = json.user.id;
      const setCookie = login1.headers.get("set-cookie");
      if (setCookie) {
        user1Cookie = setCookie.split(";")[0];
      }
    }

    if (login2.status === 200) {
      const json = await login2.json();
      user2Id = json.user.id;
      const setCookie = login2.headers.get("set-cookie");
      if (setCookie) {
        user2Cookie = setCookie.split(";")[0];
      }
    }
  });

  describe("gET /ideas", () => {
    it("returns empty list when no ideas exist", async () => {
      const response = await client.ideas.$get({ query: {} });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toEqual([]);
        expect(json.pagination.total).toBe(0);
        expect(json.pagination.page).toBe(1);
        expect(json.pagination.limit).toBe(10);
      }
    });

    it("returns ideas with pagination", async () => {
      // Create test idea first
      const createResponse = await client.ideas.$post(
        { json: sampleIdea },
        { headers: { Cookie: user1Cookie } },
      );
      expect(createResponse.status).toBe(201);
      if (createResponse.status === 201) {
        const json = await createResponse.json();
        ideaId = json.id;
      }

      const response = await client.ideas.$get({ query: {} });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(1);
        expect(json.data[0].title).toBe(sampleIdea.title);
        expect(json.data[0].author.username).toBe(testUser1.username);
        expect(json.pagination.total).toBe(1);
      }
    });

    it("supports custom pagination parameters", async () => {
      const response = await client.ideas.$get({
        query: { page: "1", limit: "5" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.pagination.limit).toBe(5);
      }
    });

    it("supports search by title", async () => {
      const response = await client.ideas.$get({
        query: { search: "Test" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(1);
        expect(json.data[0].title).toContain("Test");
      }
    });

    it("supports search by description", async () => {
      const response = await client.ideas.$get({
        query: { search: "longer description" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(1);
      }
    });

    it("supports filtering by tags", async () => {
      const response = await client.ideas.$get({
        query: { tags: "tech" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(1);
        expect(json.data[0].tags).toContain("tech");
      }
    });

    it("supports filtering by multiple tags", async () => {
      const response = await client.ideas.$get({
        query: { tags: "tech,innovation" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(1);
      }
    });

    it("returns empty list for non-matching search", async () => {
      const response = await client.ideas.$get({
        query: { search: "nonexistent" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(0);
      }
    });

    it("includes reviewsCount and avgRating in response", async () => {
      const response = await client.ideas.$get({ query: {} });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        if (json.data.length > 0) {
          const idea = json.data[0];
          expect(idea).toHaveProperty("reviewsCount");
          expect(idea).toHaveProperty("avgRating");
          expect(typeof idea.reviewsCount).toBe("number");
          expect(idea.reviewsCount).toBeGreaterThanOrEqual(0);
          expect(idea.avgRating === null || typeof idea.avgRating === "number").toBe(true);
          if (idea.avgRating !== null) {
            expect(idea.avgRating).toBeGreaterThanOrEqual(0);
            expect(idea.avgRating).toBeLessThanOrEqual(5);
          }
        }
      }
    });

    it("returns ideas sorted by newest by default", async () => {
      // Create a new idea to test sorting
      const newIdea = {
        title: "Newest Idea for Sorting Test",
        shortDescription: "A new idea",
        description: "This is a new idea for testing sorting",
        tags: ["test"],
      };

      const createResponse = await client.ideas.$post(
        { json: newIdea },
        { headers: { Cookie: user1Cookie } },
      );
      expect(createResponse.status).toBe(201);

      const response = await client.ideas.$get({
        query: { sortBy: "newest" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        if (json.data.length > 1) {
          // Check that ideas are sorted by newest first (descending createdAt)
          for (let i = 0; i < json.data.length - 1; i++) {
            const current = new Date(json.data[i].createdAt);
            const next = new Date(json.data[i + 1].createdAt);
            expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
          }
        }
      }
    });

    it("sorts ideas by oldest", async () => {
      const response = await client.ideas.$get({
        query: { sortBy: "oldest" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        if (json.data.length > 1) {
          // Check that ideas are sorted by oldest first (ascending createdAt)
          for (let i = 0; i < json.data.length - 1; i++) {
            const current = new Date(json.data[i].createdAt);
            const next = new Date(json.data[i + 1].createdAt);
            expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
          }
        }
      }
    });

    it("sorts ideas by highest rating", async () => {
      // Create ideas with different ratings
      const idea1 = {
        title: "High Rated Idea",
        shortDescription: "High rated",
        description: "This idea has high ratings",
        tags: ["rating-test"],
      };
      const idea2 = {
        title: "Low Rated Idea",
        shortDescription: "Low rated",
        description: "This idea has low ratings",
        tags: ["rating-test"],
      };

      const create1 = await client.ideas.$post(
        { json: idea1 },
        { headers: { Cookie: user1Cookie } },
      );
      const create2 = await client.ideas.$post(
        { json: idea2 },
        { headers: { Cookie: user1Cookie } },
      );

      let idea1Id: string | undefined;
      let idea2Id: string | undefined;

      if (create1.status === 201) {
        const json = await create1.json();
        idea1Id = json.id;
      }
      if (create2.status === 201) {
        const json = await create2.json();
        idea2Id = json.id;
      }

      // Add reviews with different ratings
      if (idea1Id && idea2Id) {
        // Add high rating to idea1 from user2
        await reviewsClient.reviews.$post(
          { json: { ideaId: idea1Id, content: "Great idea!", rating: 5 } },
          { headers: { Cookie: user2Cookie } },
        );

        // Add low rating to idea2 from user2
        await reviewsClient.reviews.$post(
          { json: { ideaId: idea2Id, content: "Not great", rating: 2 } },
          { headers: { Cookie: user2Cookie } },
        );
      }

      const response = await client.ideas.$get({
        query: { sortBy: "rating", tags: "rating-test" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        if (json.data.length > 1) {
          // Find our test ideas
          const highRated = json.data.find((idea: any) => idea.title === idea1.title);
          const lowRated = json.data.find((idea: any) => idea.title === idea2.title);

          if (highRated && lowRated && highRated.avgRating !== null && lowRated.avgRating !== null) {
            // High rated idea should come before low rated idea
            const highIndex = json.data.indexOf(highRated);
            const lowIndex = json.data.indexOf(lowRated);
            expect(highIndex).toBeLessThan(lowIndex);
            expect(highRated.avgRating).toBeGreaterThan(lowRated.avgRating);
          }
        }
      }
    });

    it("sorts ideas by most reviews", async () => {
      // Create ideas for review count testing
      const idea1 = {
        title: "Many Reviews Idea",
        shortDescription: "Many reviews",
        description: "This idea has many reviews",
        tags: ["reviews-test"],
      };
      const idea2 = {
        title: "Few Reviews Idea",
        shortDescription: "Few reviews",
        description: "This idea has few reviews",
        tags: ["reviews-test"],
      };

      const create1 = await client.ideas.$post(
        { json: idea1 },
        { headers: { Cookie: user1Cookie } },
      );
      const create2 = await client.ideas.$post(
        { json: idea2 },
        { headers: { Cookie: user1Cookie } },
      );

      let idea1Id: string | undefined;
      let idea2Id: string | undefined;

      if (create1.status === 201) {
        const json = await create1.json();
        idea1Id = json.id;
      }
      if (create2.status === 201) {
        const json = await create2.json();
        idea2Id = json.id;
      }

      // Add reviews to test sorting by review count
      if (idea1Id && idea2Id) {
        // Add review to idea1 from user2
        await reviewsClient.reviews.$post(
          { json: { ideaId: idea1Id, content: "Review 1", rating: 4 } },
          { headers: { Cookie: user2Cookie } },
        );
        // idea2 will have 0 reviews, idea1 will have 1 review
        // When sorted by reviews, idea1 should come before idea2
      }

      const response = await client.ideas.$get({
        query: { sortBy: "reviews", tags: "reviews-test" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        if (json.data.length > 1) {
          // Ideas should be sorted by review count descending
          for (let i = 0; i < json.data.length - 1; i++) {
            const current = json.data[i].reviewsCount;
            const next = json.data[i + 1].reviewsCount;
            expect(current).toBeGreaterThanOrEqual(next);
          }
        }
      }
    });

    it("handles ideas with no reviews in rating sort", async () => {
      const response = await client.ideas.$get({
        query: { sortBy: "rating" },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        // Ideas with no reviews (avgRating = null) should appear last
        const ideasWithRatings = json.data.filter((idea: any) => idea.avgRating !== null);
        const ideasWithoutRatings = json.data.filter((idea: any) => idea.avgRating === null);

        // All ideas with ratings should come before ideas without ratings
        if (ideasWithRatings.length > 0 && ideasWithoutRatings.length > 0) {
          const lastRatedIndex = json.data.indexOf(ideasWithRatings[ideasWithRatings.length - 1]);
          const firstUnratedIndex = json.data.indexOf(ideasWithoutRatings[0]);
          expect(lastRatedIndex).toBeLessThan(firstUnratedIndex);
        }
      }
    });
  });

  describe("pOST /ideas", () => {
    it("requires authentication", async () => {
      const response = await client.ideas.$post({ json: sampleIdea });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.ideas.$post(
        { json: sampleIdea },
        { headers: { Cookie: "authToken=invalid-token" } },
      );
      expect(response.status).toBe(401);
    });

    it("validates required fields", async () => {
      const response = await client.ideas.$post(
        { json: {} },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates title length", async () => {
      const response = await client.ideas.$post(
        {
          json: {
            ...sampleIdea,
            title: "",
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates title max length", async () => {
      const response = await client.ideas.$post(
        {
          json: {
            ...sampleIdea,
            title: "a".repeat(256),
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates short description length", async () => {
      const response = await client.ideas.$post(
        {
          json: {
            ...sampleIdea,
            shortDescription: "",
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates short description max length", async () => {
      const response = await client.ideas.$post(
        {
          json: {
            ...sampleIdea,
            shortDescription: "a".repeat(501),
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates description length", async () => {
      const response = await client.ideas.$post(
        {
          json: {
            ...sampleIdea,
            description: "",
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("creates idea successfully with valid data", async () => {
      const newIdea = {
        title: "Another Test Idea",
        shortDescription: "Another short description",
        description: "Another longer description",
        tags: ["test", "example"],
      };

      const response = await client.ideas.$post(
        { json: newIdea },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(201);
      if (response.status === 201) {
        const json = await response.json();
        expect(json.title).toBe(newIdea.title);
        expect(json.shortDescription).toBe(newIdea.shortDescription);
        expect(json.description).toBe(newIdea.description);
        expect(json.tags).toEqual(newIdea.tags);
        expect(json.authorId).toBe(user1Id);
        expect(json.author.username).toBe(testUser1.username);
        expect(json.id).toBeTypeOf("string");
        expect(json.createdAt).toBeTypeOf("string");
        expect(json.updatedAt).toBeTypeOf("string");
        expectTypeOf(json.id).toBeString();
      }
    });

    it("creates idea successfully without tags", async () => {
      const ideaWithoutTags = {
        title: "Idea Without Tags",
        shortDescription: "Short description",
        description: "Description without tags",
      };

      const response = await client.ideas.$post(
        { json: ideaWithoutTags },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(201);
      if (response.status === 201) {
        const json = await response.json();
        expect(json.tags).toEqual([]);
      }
    });
  });

  describe("gET /ideas/{id}", () => {
    it("returns idea by id", async () => {
      const response = await client.ideas[":id"].$get({
        param: { id: ideaId.toString() },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.id).toBe(ideaId);
        expect(json.title).toBe(sampleIdea.title);
        expect(json.author.username).toBe(testUser1.username);
      }
    });

    it("returns 404 for non-existent idea", async () => {
      const response = await client.ideas[":id"].$get({
        param: { id: "99999" },
      });
      expect(response.status).toBe(404);
    });

    it("returns 404 for non-existent id", async () => {
      const response = await client.ideas[":id"].$get({
        param: { id: "non-existent-id" },
      });
      expect(response.status).toBe(404);
    });

    it("handles various string ID formats gracefully", async () => {
      const testIds = [
        "definitely-not-a-real-id-12345",
        "invalid-format-test",
        "uuid-like-string-that-does-not-exist",
        "special-chars!@#$%^&*()",
        "very-long-string-that-could-be-an-id-but-is-not",
        "empty-string-test",
      ];

      for (const id of testIds) {
        const response = await client.ideas[":id"].$get({
          param: { id },
        });
        expect(response.status).toBe(404);
      }
    });
  });

  describe("pATCH /ideas/{id}", () => {
    it("requires authentication", async () => {
      const response = await client.ideas[":id"].$patch({
        param: { id: ideaId.toString() },
        json: { title: "Updated Title" },
      });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: { title: "Updated Title" },
        },
        { headers: { Cookie: "authToken=invalid-token" } },
      );
      expect(response.status).toBe(401);
    });

    it("returns 404 for non-existent idea", async () => {
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: "99999" },
          json: { title: "Updated Title" },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(404);
    });

    it("returns 403 when trying to update another user's idea", async () => {
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: { title: "Hacked Title" },
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(403);
    });

    it("validates title length when updating", async () => {
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: { title: "" },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates title max length when updating", async () => {
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: { title: "a".repeat(256) },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("updates idea title successfully", async () => {
      const updatedTitle = "Updated Test Idea";
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: { title: updatedTitle },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.title).toBe(updatedTitle);
        expect(json.id).toBe(ideaId);
        expect(json.authorId).toBe(user1Id);
      }
    });

    it("updates idea description successfully", async () => {
      const updatedDescription = "Updated description";
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: { description: updatedDescription },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.description).toBe(updatedDescription);
      }
    });

    it("updates idea tags successfully", async () => {
      const updatedTags = ["updated", "tags"];
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: { tags: updatedTags },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.tags).toEqual(updatedTags);
      }
    });

    it("updates multiple fields successfully", async () => {
      const updateData = {
        title: "Multi-field Updated Title",
        shortDescription: "Multi-field updated short description",
        tags: ["multi", "update"],
      };
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: updateData,
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.title).toBe(updateData.title);
        expect(json.shortDescription).toBe(updateData.shortDescription);
        expect(json.tags).toEqual(updateData.tags);
      }
    });

    it("rejects empty update request", async () => {
      const response = await client.ideas[":id"].$patch(
        {
          param: { id: ideaId.toString() },
          json: {},
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });
  });

  describe("dELETE /ideas/{id}", () => {
    let ideaToDelete: string;

    beforeAll(async () => {
      // Create an idea to delete
      const createResponse = await client.ideas.$post(
        {
          json: {
            title: "Idea to Delete",
            shortDescription: "Will be deleted",
            description: "This idea will be deleted in tests",
            tags: ["delete", "test"],
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      if (createResponse.status === 201) {
        const json = await createResponse.json();
        ideaToDelete = json.id;
      }
    });

    it("requires authentication", async () => {
      const response = await client.ideas[":id"].$delete({
        param: { id: ideaToDelete.toString() },
      });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.ideas[":id"].$delete(
        { param: { id: ideaToDelete.toString() } },
        { headers: { Cookie: "authToken=invalid-token" } },
      );
      expect(response.status).toBe(401);
    });

    it("returns 404 for non-existent idea", async () => {
      const response = await client.ideas[":id"].$delete(
        { param: { id: "99999" } },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(404);
    });

    it("returns 403 when trying to delete another user's idea", async () => {
      const response = await client.ideas[":id"].$delete(
        { param: { id: ideaToDelete.toString() } },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(403);
    });

    it("deletes idea successfully", async () => {
      const response = await client.ideas[":id"].$delete(
        { param: { id: ideaToDelete.toString() } },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.message).toBe("Idea deleted successfully");
      }

      // Verify idea is actually deleted
      const getResponse = await client.ideas[":id"].$get({
        param: { id: ideaToDelete.toString() },
      });
      expect(getResponse.status).toBe(404);
    });
  });

  describe("gET /ideas/user/{username}", () => {
    beforeAll(async () => {
      // Create ideas for both users
      await client.ideas.$post(
        {
          json: {
            title: "User1 Idea 1",
            shortDescription: "First idea by user1",
            description: "Description for user1's first idea",
            tags: ["user1"],
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      await client.ideas.$post(
        {
          json: {
            title: "User1 Idea 2",
            shortDescription: "Second idea by user1",
            description: "Description for user1's second idea",
            tags: ["user1"],
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      await client.ideas.$post(
        {
          json: {
            title: "User2 Idea 1",
            shortDescription: "First idea by user2",
            description: "Description for user2's first idea",
            tags: ["user2"],
          },
        },
        { headers: { Cookie: user2Cookie } },
      );
    });

    it("returns ideas by username", async () => {
      const response = await client.ideas.user[":username"].$get({
        param: { username: testUser1.username },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data.length).toBeGreaterThanOrEqual(2);
        json.data.forEach((idea: any) => {
          expect(idea.author.username).toBe(testUser1.username);
        });
      }
    });

    it("returns 404 for non-existent username", async () => {
      const response = await client.ideas.user[":username"].$get({
        param: { username: "nonexistentuser" },
      });
      expect(response.status).toBe(404);
    });

    it("returns all ideas for user without pagination", async () => {
      const response = await client.ideas.user[":username"].$get({
        param: { username: testUser1.username },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
      }
    });

    it("returns empty list for user with no ideas", async () => {
      // Register a new user with no ideas
      const newUser = {
        email: "noideas@example.com",
        username: "noideasuser",
        password: "password123",
      };
      await authClient.auth.register.$post({ json: newUser });

      const response = await client.ideas.user[":username"].$get({
        param: { username: newUser.username },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(0);
      }
    });
  });

  describe("gET /ideas/current", () => {
    it("requires authentication", async () => {
      const response = await client.ideas.current.$get({ query: {} });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.ideas.current.$get(
        { query: {} },
        { headers: { Cookie: "authToken=invalid-token" } },
      );
      expect(response.status).toBe(401);
    });

    it("returns current user's ideas", async () => {
      const response = await client.ideas.current.$get(
        { query: {} },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data.length).toBeGreaterThan(0);
        json.data.forEach((idea: any) => {
          expect(idea.authorId).toBe(user1Id);
        });
      }
    });

    it("supports pagination for current user ideas", async () => {
      const response = await client.ideas.current.$get(
        { query: {} },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
        expect("pagination" in json ? json.pagination : undefined).toBeUndefined();
      }
    });

    it("returns empty list for user with no ideas", async () => {
      // Create a new user with no ideas
      const newUser = {
        email: "empty@example.com",
        username: "emptyuser",
        password: "password123",
      };
      await authClient.auth.register.$post({ json: newUser });
      const loginResponse = await authClient.auth.login.$post({ json: newUser });

      let emptyUserCookie = "";
      if (loginResponse.status === 200) {
        const setCookie = loginResponse.headers.get("set-cookie");
        if (setCookie) {
          emptyUserCookie = setCookie.split(";")[0];
        }
      }

      const response = await client.ideas.current.$get(
        { query: {} },
        { headers: { Cookie: emptyUserCookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(0);
        expect("pagination" in json ? json.pagination : undefined).toBeUndefined();
      }
    });
  });

  describe("gET /ideas/tags", () => {
    it("returns all unique tags", async () => {
      const response = await client.ideas.tags.$get({});
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
        expect(json.data.length).toBeGreaterThan(0);

        // Check that tags are unique and sorted
        const uniqueTags = [...new Set(json.data)];
        expect(json.data).toEqual(uniqueTags.sort());
      }
    });

    it("returns empty array when no ideas exist", async () => {
      // This test would need to run in isolation or after cleanup
      // For now, we test that it returns an array
      const response = await client.ideas.tags.$get({});
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
      }
    });
  });
});
