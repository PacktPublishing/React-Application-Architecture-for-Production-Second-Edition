import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";

import env from "@/env";
import { createTestApp } from "@/lib/create-app";

import authRouter from "../auth/auth.index";
import router from "./profile.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));
const authClient = testClient(createTestApp(authRouter));

describe("profile routes", () => {
  beforeAll(async () => {
    execSync("npx drizzle-kit push");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  const testUser = {
    email: "test@example.com",
    username: "testuser",
    password: "password123",
  };

  describe("pATCH /profile", () => {
    let authCookie: string;
    let userId: string;

    beforeAll(async () => {
      const testUserForUpdate = {
        email: "update@example.com",
        username: "updateuser",
        password: "password123",
      };

      await authClient.auth.register.$post({
        json: testUserForUpdate,
      });

      const loginResponse = await authClient.auth.login.$post({
        json: testUserForUpdate,
      });

      if (loginResponse.status === 200) {
        const setCookie = loginResponse.headers.get("set-cookie");
        if (setCookie) {
          authCookie = setCookie.split(";")[0];
        }
      }

      const profileResponse = await authClient.auth.me.$get(
        {},
        {
          headers: {
            Cookie: authCookie,
          },
        },
      );

      if (profileResponse.status === 200) {
        const json = await profileResponse.json();
        if (json) {
          userId = json.id;
        }
      }
    });

    it("requires authentication", async () => {
      const response = await client.profile.$patch({
        json: { bio: "New bio" },
      });
      expect(response.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const response = await client.profile.$patch(
        {
          json: { bio: "New bio" },
        },
        {
          headers: {
            Cookie: "authToken=invalid-token",
          },
        },
      );
      expect(response.status).toBe(401);
    });

    it("updates user bio successfully", async () => {
      const response = await client.profile.$patch(
        {
          json: { bio: "Updated bio" },
        },
        {
          headers: {
            Cookie: authCookie,
          },
        },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.bio).toBe("Updated bio");
        expect(json.id).toBe(userId);
      }
    });



    it("updates multiple fields successfully", async () => {
      const updateData = {
        bio: "Multi-field update bio",
      };
      const response = await client.profile.$patch(
        {
          json: updateData,
        },
        {
          headers: {
            Cookie: authCookie,
          },
        },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.bio).toBe(updateData.bio);
        expect(json.email).toBe("update@example.com");
        expect(json.id).toBe(userId);
      }
    });



    it("rejects empty update request", async () => {
      const response = await client.profile.$patch(
        {
          json: {},
        },
        {
          headers: {
            Cookie: authCookie,
          },
        },
      );
      expect(response.status).toBe(422);
    });




    it("rejects bio that is too long", async () => {
      const response = await client.profile.$patch(
        {
          json: { bio: "a".repeat(501) },
        },
        {
          headers: {
            Cookie: authCookie,
          },
        },
      );
      expect(response.status).toBe(422);
    });
  });

  describe("gET /profile/{username}", () => {
    beforeAll(async () => {
      // Register test user
      await authClient.auth.register.$post({
        json: testUser,
      });
    });

    it("returns user profile by username", async () => {
      const response = await client.profile[":username"].$get({
        param: { username: testUser.username },
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.email).toBe(testUser.email);
        expect(json.username).toBe(testUser.username);
        expect(json.id).toBeTypeOf("string");
        expect(json.createdAt).toBeTypeOf("string");
        expectTypeOf(json.id).toBeString();
      }
    });

    it("returns 404 for non-existent username", async () => {
      const response = await client.profile[":username"].$get({
        param: { username: "nonexistentuser" },
      });
      expect(response.status).toBe(404);
      if (response.status === 404) {
        const json = await response.json();
        expect(json.message).toBe("User not found");
      }
    });

    it("returns 422 for invalid username (too short)", async () => {
      const response = await client.profile[":username"].$get({
        param: { username: "ab" },
      });
      expect(response.status).toBe(422);
    });

    it("returns 422 for invalid username (too long)", async () => {
      const response = await client.profile[":username"].$get({
        param: { username: "a".repeat(51) },
      });
      expect(response.status).toBe(422);
    });
  });
});
