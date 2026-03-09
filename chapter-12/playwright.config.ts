import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

const project = process.argv
  .slice(2)
  .find((arg) => arg.startsWith('--project='))
  ?.replace('--project=', '');

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'integration',
      use: { ...devices['Desktop Chrome'] },
      testDir: './src',
      testMatch: '**/*.integration.test.ts',
    },
    {
      name: 'e2e',
      use: { ...devices['Desktop Chrome'] },
      testDir: './testing/e2e',
    },
  ],

  webServer:
    project === 'e2e'
      ? [
          {
            command:
              'cp .env.example .env && npm install && npm run build && npm run start',
            url: 'http://localhost:9999',
            cwd: '../api',
            reuseExistingServer: !process.env.CI,
          },
          {
            command: `npm run build && npm run preview`,
            url: 'http://localhost:5173',
            reuseExistingServer: !process.env.CI,
          },
        ]
      : {
          command: `ENABLE_MOCKS=true npm run build && mocky-balboa-react-router -p 5173`,
          url: 'http://localhost:5173',
          reuseExistingServer: !process.env.CI,
          stderr: 'ignore',
        },
});
