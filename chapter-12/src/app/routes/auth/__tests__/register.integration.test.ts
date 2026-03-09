import { test, expect } from 'testing/fixtures/integration.fixture';
import { generateUser } from 'testing/test-data';

test.describe('Register page', () => {
  test('successful registration redirects to dashboard', async ({
    page,
    mocky,
    context,
    API_URL,
  }) => {
    const currentUser = generateUser();

    mocky.route(`${API_URL}/auth/register`, async (route) => {
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
        status: 201,
      });
    });

    mocky.route(`${API_URL}/auth/me`, (route) => {
      return route.fulfill({
        body: JSON.stringify(currentUser),
        status: 200,
      });
    });

    await page.goto('/auth/register');

    await page
      .getByRole('textbox', { name: 'Username' })
      .fill(currentUser.username);
    await page.getByRole('textbox', { name: 'Email' }).fill(currentUser.email);
    await page.getByLabel('Password').fill('password123');

    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('shows error on registration failure', async ({
    page,
    mocky,
    API_URL,
  }) => {
    mocky.route(`${API_URL}/auth/register`, (route) => {
      return route.fulfill({
        body: JSON.stringify({ message: 'Email already exists' }),
        status: 400,
      });
    });

    await page.goto('/auth/register');

    await page.getByRole('textbox', { name: 'Username' }).fill('testuser');
    await page.getByRole('textbox', { name: 'Email' }).fill('test@mail.com');
    await page.getByLabel('Password').fill('password123');

    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Email already exists')).toBeVisible();
  });
});
