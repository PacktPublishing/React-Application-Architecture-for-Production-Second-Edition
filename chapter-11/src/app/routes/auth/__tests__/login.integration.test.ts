import { test, expect } from 'testing/fixtures/integration.fixture';
import { generateUser } from 'testing/test-data';

test.describe('Login page', () => {
  test('successful login redirects to dashboard', async ({
    page,
    mocky,
    context,
    API_URL,
  }) => {
    const currentUser = generateUser();

    mocky.route(`${API_URL}/auth/login`, async (route) => {
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'mock-access-token',
          domain: 'localhost',
          path: '/',
        },
      ]);
      return route.fulfill({
        body: JSON.stringify({
          user: currentUser,
          accessToken: 'mock-access-token',
        }),
        status: 200,
      });
    });

    mocky.route(`${API_URL}/auth/me`, (route) => {
      return route.fulfill({
        body: JSON.stringify(currentUser),
        status: 200,
      });
    });

    await page.goto('/auth/login');

    await page.getByRole('textbox', { name: 'Email' }).fill(currentUser.email);
    await page.getByLabel('Password').fill('password123');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('shows error on invalid credentials', async ({
    page,
    mocky,
    API_URL,
  }) => {
    mocky.route(`${API_URL}/auth/login`, (route) => {
      return route.fulfill({
        body: JSON.stringify({ message: 'Invalid credentials' }),
        status: 400,
      });
    });

    await page.goto('/auth/login');

    await page.getByRole('textbox', { name: 'Email' }).fill('test@mail.com');
    await page.getByLabel('Password').fill('wrongpassword');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
