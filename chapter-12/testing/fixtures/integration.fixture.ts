import base from '@mocky-balboa/playwright/test';
import { expect } from '@playwright/test';

import type { User } from '@/types/generated/types.gen';

import { generateUser } from '../test-data';

const test = base.extend<{
  API_URL: string;
  createAuthenticatedUser: (overrides?: Partial<User>) => Promise<User>;
}>({
  API_URL: process.env.VITE_API_URL,
  page: async ({ page }, runTestWith) => {
    const originalGoto = page.goto.bind(page);
    page.goto = async (url, options) => {
      const result = await originalGoto(url, options);
      await page.waitForLoadState('networkidle');

      return result;
    };
    await runTestWith(page);
  },
  createAuthenticatedUser: async ({ context, mocky, API_URL }, runTestWith) => {
    await runTestWith(async (overrides = {}) => {
      const user = generateUser(overrides);

      await context.addCookies([
        {
          name: 'accessToken',
          value: 'mock-access-token',
          domain: 'localhost',
          path: '/',
        },
      ]);

      mocky.route(`${API_URL}/auth/me`, (route) =>
        route.fulfill({ body: JSON.stringify(user), status: 200 }),
      );

      return user;
    });
  },
});

export { test, expect };
