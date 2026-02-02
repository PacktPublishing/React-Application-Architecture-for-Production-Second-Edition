import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";

import env from "@/env";
import { createTestApp } from "@/lib/create-app";

import authRouter from "../auth/auth.index";
import ideasRouter from "../ideas/ideas.index";
import router from "./reviews.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));
const authClient = testClient(createTestApp(authRouter));
const ideasClient = testClient(createTestApp(ideasRouter));

describe("reviews routes", () => {
  beforeAll(async () => {
    execSync("npx drizzle-kit push");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  const testUser1 = {
    email: "reviewer1@example.com",
    username: "reviewer1",
    password: "password123",
  };

  const testUser2 = {
    email: "reviewer2@example.com",
    username: "reviewer2",
    password: "password123",
  };

  const sampleIdea = {
    title: "Test Idea for Reviews",
    shortDescription: "An idea to test reviews",
    description: "A longer description of the test idea for reviews",
    tags: ["test", "reviews"],
  };

  const sampleReview = {
    content: "This is a great idea! I really like the concept and implementation.",
    rating: 5,
    ideaId: "", // Will be set after creating idea
  };

  let user1Cookie: string;
  let user2Cookie: string;
  let user1Id: string;
  let user2Id: string;
  let ideaId: string;
  let reviewId: string;

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

    // Create a test idea to review
    const ideaResponse = await ideasClient.ideas.$post(
      { json: sampleIdea },
      { headers: { Cookie: user1Cookie } },
    );
    if (ideaResponse.status === 201) {
      const json = await ideaResponse.json();
      ideaId = json.id;
      sampleReview.ideaId = ideaId;
    }
  });

  describe("pOST /reviews", () => {
    it("requires authentication", async () => {
      const response = await client.reviews.$post({ json: sampleReview });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.reviews.$post(
        { json: sampleReview },
        { headers: { Cookie: "authToken=invalid-token" } },
      );
      expect(response.status).toBe(401);
    });

    it("validates required fields", async () => {
      const response = await client.reviews.$post(
        { json: {} },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates content length", async () => {
      const response = await client.reviews.$post(
        {
          json: {
            ...sampleReview,
            content: "",
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates content max length", async () => {
      const response = await client.reviews.$post(
        {
          json: {
            ...sampleReview,
            content: "a".repeat(2001),
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates rating minimum", async () => {
      const response = await client.reviews.$post(
        {
          json: {
            ...sampleReview,
            rating: 0,
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates rating maximum", async () => {
      const response = await client.reviews.$post(
        {
          json: {
            ...sampleReview,
            rating: 6,
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("returns 404 for non-existent idea", async () => {
      const response = await client.reviews.$post(
        {
          json: {
            ...sampleReview,
            ideaId: "non-existent-idea-id",
          },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(404);
    });

    it("creates review successfully with valid data", async () => {
      // Use user2 to review user1's idea
      const response = await client.reviews.$post(
        { json: sampleReview },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(201);
      if (response.status === 201) {
        const json = await response.json();
        expect(json.content).toBe(sampleReview.content);
        expect(json.rating).toBe(sampleReview.rating);
        expect(json.ideaId).toBe(ideaId);
        expect(json.authorId).toBe(user2Id);
        expect(json.author.username).toBe(testUser2.username);
        expect(json.id).toBeTypeOf("string");
        expect(json.createdAt).toBeTypeOf("string");
        expect(json.updatedAt).toBeTypeOf("string");
        expectTypeOf(json.id).toBeString();
        reviewId = json.id;
      }
    });

    it("prevents duplicate reviews from same user", async () => {
      const response = await client.reviews.$post(
        { json: sampleReview },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(409);
      if (response.status === 409) {
        const json = await response.json() as { message: string };
        expect(json.message).toBe("You have already reviewed this idea");
      }
    });

    it("allows different users to review same idea", async () => {
      // Create another user
      const testUser3 = {
        email: "reviewer3@example.com",
        username: "reviewer3",
        password: "password123",
      };

      await authClient.auth.register.$post({ json: testUser3 });
      const login3 = await authClient.auth.login.$post({ json: testUser3 });

      let user3Cookie = "";
      if (login3.status === 200) {
        const setCookie = login3.headers.get("set-cookie");
        if (setCookie) {
          user3Cookie = setCookie.split(";")[0];
        }
      }

      const response = await client.reviews.$post(
        {
          json: {
            content: "Another perspective on this idea",
            rating: 4,
            ideaId,
          },
        },
        { headers: { Cookie: user3Cookie } },
      );
      expect(response.status).toBe(201);
    });
  });

  describe("pATCH /reviews/{id}", () => {
    it("requires authentication", async () => {
      const response = await client.reviews[":id"].$patch({
        param: { id: reviewId.toString() },
        json: { content: "Updated content" },
      });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: { content: "Updated content" },
        },
        { headers: { Cookie: "authToken=invalid-token" } },
      );
      expect(response.status).toBe(401);
    });

    it("returns 404 for non-existent review", async () => {
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: "99999" },
          json: { content: "Updated content" },
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(404);
    });

    it("returns 403 when trying to update another user's review", async () => {
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: { content: "Hacked content" },
        },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(403);
    });

    it("validates content length when updating", async () => {
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: { content: "" },
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates content max length when updating", async () => {
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: { content: "a".repeat(2001) },
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("validates rating when updating", async () => {
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: { rating: 0 },
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(422);
    });

    it("updates review content successfully", async () => {
      const updatedContent = "Updated review content with more details";
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: { content: updatedContent },
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.content).toBe(updatedContent);
        expect(json.id).toBe(reviewId);
        expect(json.authorId).toBe(user2Id);
      }
    });

    it("updates review rating successfully", async () => {
      const updatedRating = 3;
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: { rating: updatedRating },
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.rating).toBe(updatedRating);
      }
    });

    it("updates multiple fields successfully", async () => {
      const updateData = {
        content: "Multi-field updated review content",
        rating: 2,
      };
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: updateData,
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.content).toBe(updateData.content);
        expect(json.rating).toBe(updateData.rating);
      }
    });

    it("rejects empty update request", async () => {
      const response = await client.reviews[":id"].$patch(
        {
          param: { id: reviewId.toString() },
          json: {},
        },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(422);
    });
  });

  describe("dELETE /reviews/{id}", () => {
    let reviewToDelete: string;

    beforeAll(async () => {
      // Create a review to delete
      const createResponse = await client.reviews.$post(
        {
          json: {
            content: "Review to be deleted",
            rating: 3,
            ideaId,
          },
        },
        { headers: { Cookie: user2Cookie } },
      );
      // Note: This will fail due to duplicate review constraint
      // So let's create another idea first
      const anotherIdea = {
        title: "Another Idea for Delete Test",
        shortDescription: "For delete testing",
        description: "This idea is for testing deletion",
        tags: ["delete", "test"],
      };

      const ideaResponse = await ideasClient.ideas.$post(
        { json: anotherIdea },
        { headers: { Cookie: user1Cookie } },
      );

      if (ideaResponse.status === 201) {
        const ideaJson = await ideaResponse.json();
        const deleteReviewResponse = await client.reviews.$post(
          {
            json: {
              content: "Review to be deleted",
              rating: 3,
              ideaId: ideaJson.id,
            },
          },
          { headers: { Cookie: user2Cookie } },
        );
        if (deleteReviewResponse.status === 201) {
          const json = await deleteReviewResponse.json();
          reviewToDelete = json.id;
        }
      }
    });

    it("requires authentication", async () => {
      const response = await client.reviews[":id"].$delete({
        param: { id: reviewToDelete.toString() },
      });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.reviews[":id"].$delete(
        { param: { id: reviewToDelete.toString() } },
        { headers: { Cookie: "authToken=invalid-token" } },
      );
      expect(response.status).toBe(401);
    });

    it("returns 404 for non-existent review", async () => {
      const response = await client.reviews[":id"].$delete(
        { param: { id: "99999" } },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(404);
    });

    it("returns 403 when trying to delete another user's review", async () => {
      const response = await client.reviews[":id"].$delete(
        { param: { id: reviewToDelete.toString() } },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(403);
    });

    it("deletes review successfully", async () => {
      const response = await client.reviews[":id"].$delete(
        { param: { id: reviewToDelete.toString() } },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.message).toBe("Review deleted successfully");
      }
    });
  });

  describe("gET /reviews/user/{username}", () => {
    beforeAll(async () => {
      // Create more test data for listing tests
      // Create additional ideas and reviews
      const idea2Response = await ideasClient.ideas.$post(
        {
          json: {
            title: "Second Idea for Reviews",
            shortDescription: "Another idea",
            description: "Description for second idea",
            tags: ["second"],
          },
        },
        { headers: { Cookie: user1Cookie } },
      );

      if (idea2Response.status === 201) {
        const idea2Json = await idea2Response.json();
        // User2 reviews the second idea
        await client.reviews.$post(
          {
            json: {
              content: "Review for second idea",
              rating: 4,
              ideaId: idea2Json.id,
            },
          },
          { headers: { Cookie: user2Cookie } },
        );
      }
    });

    it("returns reviews by username", async () => {
      const response = await client.reviews.user[":username"].$get({
        param: { username: testUser2.username },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data.length).toBeGreaterThanOrEqual(1);
        json.data.forEach((review: any) => {
          expect(review.author.username).toBe(testUser2.username);
          expect(review.idea).toBeDefined();
          expect(review.idea.title).toBeDefined();
        });
      }
    });

    it("returns 404 for non-existent username", async () => {
      const response = await client.reviews.user[":username"].$get({
        param: { username: "nonexistentuser" },
      });
      expect(response.status).toBe(404);
    });

    it("returns all reviews for user without pagination", async () => {
      const response = await client.reviews.user[":username"].$get({
        param: { username: testUser2.username },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
      }
    });

    it("returns empty list for user with no reviews", async () => {
      // testUser1 hasn't written any reviews
      const response = await client.reviews.user[":username"].$get({
        param: { username: testUser1.username },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(0);
      }
    });
  });

  describe("gET /reviews/current", () => {
    it("requires authentication", async () => {
      const response = await client.reviews.current.$get({ query: {} });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.reviews.current.$get(
        { query: {} },
        { headers: { Cookie: "authToken=invalid-token" } },
      );
      expect(response.status).toBe(401);
    });

    it("returns current user's reviews", async () => {
      const response = await client.reviews.current.$get(
        { query: {} },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data.length).toBeGreaterThan(0);
        json.data.forEach((review: any) => {
          expect(review.authorId).toBe(user2Id);
          expect(review.idea).toBeDefined();
        });
      }
    });

    it("returns all current user reviews without pagination", async () => {
      const response = await client.reviews.current.$get(
        { query: {} },
        { headers: { Cookie: user2Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
      }
    });

    it("returns empty list for user with no reviews", async () => {
      const response = await client.reviews.current.$get(
        { query: {} },
        { headers: { Cookie: user1Cookie } },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data).toHaveLength(0);
      }
    });
  });

  describe("gET /reviews/idea/{id}", () => {
    it("returns reviews by idea id", async () => {
      const response = await client.reviews.idea[":id"].$get({
        param: { id: ideaId.toString() },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.data.length).toBeGreaterThanOrEqual(1);
        json.data.forEach((review: any) => {
          expect(review.ideaId).toBe(ideaId);
          expect(review.author).toBeDefined();
          expect(review.author.username).toBeDefined();
        });
      }
    });

    it("returns 404 for non-existent idea", async () => {
      const response = await client.reviews.idea[":id"].$get({
        param: { id: "99999" },
      });
      expect(response.status).toBe(404);
    });

    it("returns all reviews for idea without pagination", async () => {
      const response = await client.reviews.idea[":id"].$get({
        param: { id: ideaId.toString() },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
      }
    });

    it("returns empty list for idea with no reviews", async () => {
      // Create an idea with no reviews
      const noReviewsIdea = {
        title: "Idea With No Reviews",
        shortDescription: "No one has reviewed this",
        description: "This idea has zero reviews",
        tags: ["lonely"],
      };

      const ideaResponse = await ideasClient.ideas.$post(
        { json: noReviewsIdea },
        { headers: { Cookie: user1Cookie } },
      );

      if (ideaResponse.status === 201) {
        const ideaJson = await ideaResponse.json();
        const response = await client.reviews.idea[":id"].$get({
          param: { id: ideaJson.id.toString() },
        });
        expect(response.status).toBe(200);
        if (response.status === 200) {
          const json = await response.json();
          expect(json.data).toHaveLength(0);
        }
      }
    });
  });
});
