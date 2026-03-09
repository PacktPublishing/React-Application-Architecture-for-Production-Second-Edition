import { test, expect } from 'testing/fixtures/integration.fixture';
import { generateIdea, generateReview, generateUser } from 'testing/test-data';

test.describe('Profile page', () => {
  test.describe('View profile', () => {
    test('displays profile information', async ({ page, mocky, API_URL }) => {
      const currentUser = generateUser();
      const ideas = [generateIdea(), generateIdea()];
      const reviews = [generateReview(), generateReview()];

      mocky.route(`${API_URL}/profile/${currentUser.username}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(currentUser),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/ideas/user/${currentUser.username}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({
            data: ideas,
          }),
          status: 200,
        });
      });

      mocky.route(
        `${API_URL}/reviews/user/${currentUser.username}`,
        (route) => {
          return route.fulfill({
            body: JSON.stringify({
              data: reviews,
            }),
            status: 200,
          });
        },
      );

      await page.goto(`/profile/${currentUser.username}`);

      await expect(page.getByTestId('profile-details')).toContainText(
        `@${currentUser.username}`,
      );

      await expect(page.getByText(currentUser.bio)).toBeVisible();

      await expect(
        page.getByText(
          new RegExp(`${ideas.length} Ideas? by ${currentUser.username}`),
        ),
      ).toBeVisible();

      await expect(
        page.getByText(
          new RegExp(`${reviews.length} Reviews? by ${currentUser.username}`),
        ),
      ).toBeVisible();
    });

    test('shows error boundary when profile is not found', async ({
      page,
      mocky,
      API_URL,
    }) => {
      mocky.route(`${API_URL}/profile/nonexistent`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ message: 'User not found' }),
          status: 404,
        });
      });

      await page.goto('/profile/nonexistent');

      await expect(page.getByText('User not found').first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
    });
  });

  test.describe('Edit profile', () => {
    test('edits profile bio', async ({ page, mocky, context, API_URL }) => {
      const currentUser = generateUser();

      await context.addCookies([
        {
          name: 'accessToken',
          value: 'mock-access-token',
          domain: 'localhost',
          path: '/',
        },
      ]);

      mocky.route(`${API_URL}/auth/me`, (route) => {
        return route.fulfill({
          body: JSON.stringify(currentUser),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/profile/${currentUser.username}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(currentUser),
          status: 200,
        });
      });
      mocky.route(`${API_URL}/profile`, async (route) => {
        const body = await route.request.json();
        currentUser.bio = body.bio;
        return route.fulfill({
          body: JSON.stringify({
            ...currentUser,
            bio: body.bio,
            updatedAt: new Date().toISOString(),
          }),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/ideas/user/${currentUser.username}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({
            data: [],
          }),
          status: 200,
        });
      });

      mocky.route(
        `${API_URL}/reviews/user/${currentUser.username}`,
        (route) => {
          return route.fulfill({
            body: JSON.stringify({
              data: [],
            }),
            status: 200,
          });
        },
      );

      await page.goto(`/profile/${currentUser.username}`);

      await page.getByRole('button', { name: 'Edit Profile' }).click();

      const newBio = 'New bio';

      await page.getByRole('textbox', { name: 'Bio' }).fill(newBio);

      await page.getByRole('button', { name: 'Save changes' }).click();

      await expect(
        page.getByText('Update your profile information'),
      ).not.toBeVisible();

      await expect(
        page.getByText('Profile updated successfully!'),
      ).toBeVisible();
      await expect(page.getByText(newBio)).toBeVisible();
    });

    test('hides edit button for other users', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const profileUser = generateUser();

      await context.addCookies([
        {
          name: 'accessToken',
          value: 'mock-access-token',
          domain: 'localhost',
          path: '/',
        },
      ]);

      mocky.route(`${API_URL}/auth/me`, (route) => {
        return route.fulfill({
          body: JSON.stringify(currentUser),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/profile/${profileUser.username}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(profileUser),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/ideas/user/${profileUser.username}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [] }),
          status: 200,
        });
      });

      mocky.route(
        `${API_URL}/reviews/user/${profileUser.username}`,
        (route) => {
          return route.fulfill({
            body: JSON.stringify({ data: [] }),
            status: 200,
          });
        },
      );

      await page.goto(`/profile/${profileUser.username}`);

      await expect(page.getByTestId('profile-details')).toContainText(
        `@${profileUser.username}`,
      );

      await expect(
        page.getByRole('button', { name: 'Edit Profile' }),
      ).not.toBeVisible();
    });

    test('shows error when API fails to update profile', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'mock-access-token',
          domain: 'localhost',
          path: '/',
        },
      ]);

      mocky.route(`${API_URL}/auth/me`, (route) => {
        return route.fulfill({
          body: JSON.stringify(currentUser),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/profile/${currentUser.username}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(currentUser),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/profile`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ message: 'Failed to update profile' }),
          status: 400,
        });
      });

      mocky.route(`${API_URL}/ideas/user/${currentUser.username}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [] }),
          status: 200,
        });
      });

      mocky.route(
        `${API_URL}/reviews/user/${currentUser.username}`,
        (route) => {
          return route.fulfill({
            body: JSON.stringify({ data: [] }),
            status: 200,
          });
        },
      );

      await page.goto(`/profile/${currentUser.username}`);

      await page.getByRole('button', { name: 'Edit Profile' }).click();

      await page.getByRole('textbox', { name: 'Bio' }).fill('New bio');

      await page.getByRole('button', { name: 'Save changes' }).click();

      await expect(page.getByText('Failed to update profile')).toBeVisible();
    });
  });
});
