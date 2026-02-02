import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";

import env from "@/env";
import { createTestApp } from "@/lib/create-app";

import router from "./auth.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));

describe("auth routes", () => {
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

  describe("pOST /auth/register", () => {
    it("validates required fields", async () => {
      const response = await client.auth.register.$post({
        json: {},
      });
      expect(response.status).toBe(422);
      const json = await response.json() as any;
      expect(json.error.issues).toHaveLength(3);
      expect(json.error.issues.some((issue: any) => issue.path[0] === "email")).toBe(true);
      expect(json.error.issues.some((issue: any) => issue.path[0] === "username")).toBe(true);
      expect(json.error.issues.some((issue: any) => issue.path[0] === "password")).toBe(true);
    });

    it("validates email format", async () => {
      const response = await client.auth.register.$post({
        json: {
          email: "invalid-email",
          username: "testuser",
          password: "password123",
        },
      });
      expect(response.status).toBe(422);
      const json = await response.json() as any;
      expect(json.error.issues[0].path[0]).toBe("email");
      expect(json.error.issues[0].message).toContain("Invalid email");
    });

    it("validates password minimum length", async () => {
      const response = await client.auth.register.$post({
        json: {
          email: "test@example.com",
          username: "testuser",
          password: "123",
        },
      });
      expect(response.status).toBe(422);
      const json = await response.json() as any;
      expect(json.error.issues[0].path[0]).toBe("password");
      expect(json.error.issues[0].message).toContain("Too small");
    });

    it("creates a new user successfully", async () => {
      const response = await client.auth.register.$post({
        json: testUser,
      });
      expect(response.status).toBe(201);
      if (response.status === 201) {
        const json = await response.json();
        expect(json.user).toBeDefined();
        expect(json.user.email).toBe(testUser.email);
        expect(json.user.id).toBeTypeOf("string");
        expect(json.user.createdAt).toBeTypeOf("string");
        expect(json.accessToken).toBeTypeOf("string");
        expectTypeOf(json.user.id).toBeString();
        expectTypeOf(json.accessToken).toBeString();
      }
    });

    it("prevents duplicate user registration", async () => {
      const response = await client.auth.register.$post({
        json: testUser,
      });
      expect(response.status).toBe(409);
      if (response.status === 409) {
        const json = await response.json();
        expect(json.message).toBe("User already exists");
      }
    });
  });

  describe("pOST /auth/login", () => {
    it("validates required fields", async () => {
      const response = await client.auth.login.$post({
        json: {},
      });
      expect(response.status).toBe(422);
      const json = await response.json() as any;
      expect(json.error.issues).toHaveLength(2);
      expect(json.error.issues.some((issue: any) => issue.path[0] === "email")).toBe(true);
      expect(json.error.issues.some((issue: any) => issue.path[0] === "password")).toBe(true);
    });

    it("validates email format", async () => {
      const response = await client.auth.login.$post({
        json: {
          email: "invalid-email",
          password: "password123",
        },
      });
      expect(response.status).toBe(422);
      const json = await response.json() as any;
      expect(json.error.issues[0].path[0]).toBe("email");
      expect(json.error.issues[0].message).toContain("Invalid email");
    });

    it("rejects invalid credentials - non-existent user", async () => {
      const response = await client.auth.login.$post({
        json: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      });
      expect(response.status).toBe(401);
      if (response.status === 401) {
        const json = await response.json();
        expect(json.message).toBe("Invalid credentials");
      }
    });

    it("rejects invalid credentials - wrong password", async () => {
      const response = await client.auth.login.$post({
        json: {
          email: testUser.email,
          password: "wrongpassword",
        },
      });
      expect(response.status).toBe(401);
      if (response.status === 401) {
        const json = await response.json();
        expect(json.message).toBe("Invalid credentials");
      }
    });

    it("successfully logs in with valid credentials", async () => {
      const response = await client.auth.login.$post({
        json: testUser,
      });
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.user).toBeDefined();
        expect(json.user.email).toBe(testUser.email);
        expect(json.user.id).toBeTypeOf("string");
        expect(json.user.createdAt).toBeTypeOf("string");
        expect(json.accessToken).toBeTypeOf("string");
        expectTypeOf(json.user.id).toBeString();
        expectTypeOf(json.accessToken).toBeString();
      }
    });
  });

  describe("pOST /auth/logout", () => {
    it("successfully logs out with valid refresh token", async () => {
      // First login to get tokens
      const loginResponse = await client.auth.login.$post({
        json: testUser,
      });
      expect(loginResponse.status).toBe(200);

      // Extract cookies from login response
      const cookies = loginResponse.headers.get("set-cookie");
      expect(cookies).toBeTruthy();

      // Logout with the refresh token cookie
      const logoutResponse = await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: cookies || "",
          },
        },
      );
      expect(logoutResponse.status).toBe(200);
      if (logoutResponse.status === 200) {
        const json = await logoutResponse.json();
        expect(json.message).toBe("Logged out successfully");
      }

      // Verify cookies are cleared
      const setCookieHeaders = logoutResponse.headers.get("set-cookie");
      expect(setCookieHeaders).toBeTruthy();
    });

    it("successfully logs out without refresh token", async () => {
      // Logout without any cookies
      const logoutResponse = await client.auth.logout.$post({});
      expect(logoutResponse.status).toBe(200);
      if (logoutResponse.status === 200) {
        const json = await logoutResponse.json();
        expect(json.message).toBe("Logged out successfully");
      }
    });
  });

  describe("gET /auth/me", () => {
    let authCookie: string;
    let accessToken: string;

    beforeAll(async () => {
      // Register user
      await client.auth.register.$post({
        json: testUser,
      });

      // Login to get cookie
      const loginResponse = await client.auth.login.$post({
        json: testUser,
      });

      if (loginResponse.status === 200) {
        const setCookie = loginResponse.headers.get("set-cookie");
        if (setCookie) {
          authCookie = setCookie.split(";")[0];
          // Extract just the access token value
          const accessTokenMatch = setCookie.match(/accessToken=([^;]+)/);
          if (accessTokenMatch) {
            accessToken = accessTokenMatch[1];
          }
        }
      }
    });

    it("returns 401 when not authenticated", async () => {
      const response = await client.auth.me.$get();
      expect(response.status).toBe(401);
      if (response.status === 401) {
        const json = await response.json();
        expect(json.message).toBe("Unauthorized");
      }
    });

    it("returns 401 with invalid token", async () => {
      const response = await client.auth.me.$get(
        {},
        {
          headers: {
            Cookie: "accessToken=invalid-token",
          },
        },
      );
      expect(response.status).toBe(401);
      if (response.status === 401) {
        const json = await response.json();
        expect(json.message).toBe("Unauthorized");
      }
    });

    it("returns user profile with valid cookie token", async () => {
      const response = await client.auth.me.$get(
        {},
        {
          headers: {
            Cookie: authCookie,
          },
        },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        if (json) {
          expect(json.email).toBe(testUser.email);
          expect(json.id).toBeTypeOf("string");
          expect(json.createdAt).toBeTypeOf("string");
          expectTypeOf(json.id).toBeString();
        }
      }
    });

    it("returns user profile with valid Bearer token", async () => {
      const response = await client.auth.me.$get(
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        if (json) {
          expect(json.email).toBe(testUser.email);
          expect(json.id).toBeTypeOf("string");
          expect(json.createdAt).toBeTypeOf("string");
          expectTypeOf(json.id).toBeString();
        }
      }
    });

    it("returns 401 with invalid Bearer token", async () => {
      const response = await client.auth.me.$get(
        {},
        {
          headers: {
            Authorization: "Bearer invalid-token",
          },
        },
      );
      expect(response.status).toBe(401);
      if (response.status === 401) {
        const json = await response.json();
        expect(json.message).toBe("Unauthorized");
      }
    });

    it("prioritizes Bearer token over cookie when both are present", async () => {
      // Use Bearer token with cookie present
      const response = await client.auth.me.$get(
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Cookie: authCookie,
          },
        },
      );
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        if (json) {
          expect(json.email).toBe(testUser.email);
        }
      }
    });
  });

  describe("pOST /auth/refresh", () => {
    it("successfully refreshes tokens with valid refresh token", async () => {
      // First login to get tokens
      const loginResponse = await client.auth.login.$post({
        json: testUser,
      });
      expect(loginResponse.status).toBe(200);

      // Extract cookies from login response - get all set-cookie headers
      const setCookieHeader = loginResponse.headers.getSetCookie();
      expect(setCookieHeader).toBeTruthy();

      // Parse the cookies to extract just the cookie pairs for the Cookie header
      const cookieStrings = setCookieHeader.map((cookie) => {
        const match = cookie.match(/^([^=]+=[^;]+)/);
        return match ? match[1] : "";
      }).filter(Boolean);

      const cookieHeader = cookieStrings.join("; ");

      // Refresh tokens
      const refreshResponse = await client.auth.refresh.$post(
        {},
        {
          headers: {
            Cookie: cookieHeader,
          },
        },
      );
      expect(refreshResponse.status).toBe(200);
      if (refreshResponse.status === 200) {
        const json = await refreshResponse.json();
        expect(json.accessToken).toBeDefined();
        expect(typeof json.accessToken).toBe("string");

        // Verify new cookies are set
        const newCookies = refreshResponse.headers.getSetCookie();
        expect(newCookies).toBeTruthy();
        expect(newCookies.some(c => c.includes("accessToken"))).toBe(true);
        expect(newCookies.some(c => c.includes("refreshToken"))).toBe(true);
      }
    });

    it("rejects refresh without refresh token", async () => {
      const refreshResponse = await client.auth.refresh.$post({});
      expect(refreshResponse.status).toBe(401);
      if (refreshResponse.status === 401) {
        const json = await refreshResponse.json();
        expect(json.message).toBe("Refresh token not found");
      }
    });

    it("rejects refresh with invalid refresh token", async () => {
      const refreshResponse = await client.auth.refresh.$post(
        {},
        {
          headers: {
            Cookie: "refreshToken=invalid_token",
          },
        },
      );
      expect(refreshResponse.status).toBe(401);
      if (refreshResponse.status === 401) {
        const json = await refreshResponse.json();
        expect(json.message).toBe("Invalid refresh token");
      }
    });

    it("rejects refresh with expired token after logout", async () => {
      // First login to get tokens
      const loginResponse = await client.auth.login.$post({
        json: testUser,
      });
      expect(loginResponse.status).toBe(200);

      // Extract cookies from login response
      const cookies = loginResponse.headers.get("set-cookie");
      expect(cookies).toBeTruthy();

      // Logout to invalidate the refresh token
      const logoutResponse = await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: cookies || "",
          },
        },
      );
      expect(logoutResponse.status).toBe(200);

      // Try to refresh with the invalidated token
      const refreshResponse = await client.auth.refresh.$post(
        {},
        {
          headers: {
            Cookie: cookies || "",
          },
        },
      );
      expect(refreshResponse.status).toBe(401);
      if (refreshResponse.status === 401) {
        const json = await refreshResponse.json();
        expect(json.message).toBe("Refresh token not found");
      }
    });
  });
});
