import { expect, test as base } from '@playwright/test';

const test = base.extend({
  page: async ({ page }, runTestWith) => {
    const originalGoto = page.goto.bind(page);
    page.goto = async (url, options) => {
      const result = await originalGoto(url, options);
      await page.waitForLoadState('networkidle');
      return result;
    };
    await runTestWith(page);
  },
});

export { test, expect };
