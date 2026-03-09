import { test, expect } from '../fixtures/e2e.fixture';
import { generateIdea, generateReview, generateUser } from '../test-data';

test.describe('Smoke Test', () => {
  const testUser = {
    ...generateUser(),
    password: 'password123',
  };

  const testIdea = generateIdea();
  const testReview = generateReview();
  const updatedReviewContent = 'Updated review content';

  test('Complete User Journey', async ({ page }) => {
    await test.step('register a new user', async () => {
      await page.goto('/auth/register');

      await page
        .getByRole('textbox', { name: 'Username' })
        .fill(testUser.username);
      await page.getByRole('textbox', { name: 'Email' }).fill(testUser.email);
      await page.getByLabel('Password').fill(testUser.password);

      await page.getByRole('button', { name: 'Register' }).click();

      await expect(page).toHaveURL('/dashboard');
    });

    await test.step('log out the user', async () => {
      await page.getByRole('button', { name: 'Logout' }).click();
      await expect(page).toHaveURL('/');
    });

    await test.step('login with the same user', async () => {
      await page.getByRole('link', { name: 'Login' }).click();
      await expect(page).toHaveURL('/auth/login');

      await page.getByRole('textbox', { name: 'Email' }).fill(testUser.email);
      await page.getByLabel('Password').fill(testUser.password);

      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page).toHaveURL('/dashboard');
    });

    await test.step('create a new idea', async () => {
      await page.getByRole('link', { name: 'Create New Idea' }).click();
      await expect(page).toHaveURL('/dashboard/ideas/new');

      await page.getByRole('textbox', { name: 'Title' }).fill(testIdea.title);
      await page
        .getByRole('textbox', { name: 'Short Description' })
        .fill(testIdea.shortDescription);
      await page
        .getByRole('textbox', { name: 'Detailed Description' })
        .fill(testIdea.description);
      for (const tag of ['API', 'Automation']) {
        await page.getByRole('button', { name: tag }).click();
      }

      const responsePromise = page.waitForResponse(
        (resp) =>
          resp.url().includes('/ideas') && resp.request().method() === 'POST',
      );
      await page.getByRole('button', { name: 'Create Idea' }).click();
      const response = await responsePromise;
      const data = await response.json();
      testIdea.id = data.id;

      await expect(page).toHaveURL('/dashboard/ideas');
    });

    await test.step('edit the idea', async () => {
      await page.getByRole('link', { name: testIdea.title }).click();
      await expect(page).toHaveURL(/\/ideas\/[^/]+$/);

      await page.getByRole('button', { name: 'Idea actions menu' }).click();

      await page.getByRole('menuitem', { name: 'Edit' }).click();
      await expect(page).toHaveURL(`/dashboard/ideas/${testIdea.id}/edit`);

      await page
        .getByRole('textbox', { name: 'Title' })
        .fill(`${testIdea.title} - Updated`);
      await page
        .getByRole('textbox', { name: 'Short Description' })
        .fill(`${testIdea.shortDescription} - Updated`);
      await page.getByRole('button', { name: 'Update Idea' }).click();
      await expect(page).toHaveURL(`/ideas/${testIdea.id}`);
    });

    await test.step('delete the idea', async () => {
      await page.getByRole('button', { name: 'Idea actions menu' }).click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();

      const confirmDeleteDialog = page.getByRole('alertdialog', {
        name: 'Delete Idea',
      });
      await confirmDeleteDialog.getByRole('button', { name: 'Delete' }).click();
      await expect(page).toHaveURL('/dashboard/ideas');
      await expect(
        page.getByRole('link', { name: testIdea.title }),
      ).not.toBeVisible();
    });

    await test.step('discover ideas', async () => {
      await page.getByRole('link', { name: 'Discover Ideas' }).click();
      await expect(page).toHaveURL('/ideas');

      const discoveredIdeaLink = page
        .getByTestId('idea-list-item')
        .first()
        .getByRole('link')
        .first();

      const discoveredIdeaUrl =
        (await discoveredIdeaLink.getAttribute('href')) ?? '';

      await discoveredIdeaLink.click();

      await expect(page).toHaveURL(discoveredIdeaUrl);
    });

    await test.step('write a review for an idea of someone else', async () => {
      await page.getByRole('button', { name: 'Write a Review' }).click();

      const createReviewDialog = page.getByRole('dialog', {
        name: 'Write a Review',
      });
      await createReviewDialog.getByRole('radio', { name: '4 stars' }).click();

      await page
        .getByRole('textbox', { name: 'Review' })
        .fill(testReview.content);
      await page.getByRole('button', { name: 'Submit Review' }).click();

      await expect(createReviewDialog).not.toBeVisible();
      await expect(
        page.getByText('Review created successfully!'),
      ).toBeVisible();
      await expect(page.getByText(testReview.content)).toBeVisible();
    });

    await test.step('edit the review', async () => {
      await page.getByRole('button', { name: 'Review actions menu' }).click();

      await page.getByRole('menuitem', { name: 'Edit' }).click();

      const updateReviewDialog = page.getByRole('dialog');

      await updateReviewDialog
        .getByRole('textbox', { name: 'Review' })
        .fill(updatedReviewContent);

      await updateReviewDialog
        .getByRole('button', { name: 'Submit Review' })
        .click();

      await expect(updateReviewDialog).not.toBeVisible();

      await expect(
        page.getByText('Review updated successfully!'),
      ).toBeVisible();
      await expect(page.getByText(updatedReviewContent)).toBeVisible();
    });

    await test.step('delete the review', async () => {
      await page.getByRole('button', { name: 'Review actions menu' }).click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();

      const confirmDeleteReviewDialog = page.getByRole('alertdialog', {
        name: 'Delete Review',
      });
      await confirmDeleteReviewDialog
        .getByRole('button', { name: 'Delete' })
        .click();

      await expect(confirmDeleteReviewDialog).not.toBeVisible();

      await expect(
        page.getByText('Review deleted successfully!'),
      ).toBeVisible();
      await expect(page.getByText(updatedReviewContent)).not.toBeVisible();
    });

    await test.step('update the user profile', async () => {
      await page.getByRole('link', { name: testUser.username }).click();
      await expect(page).toHaveURL(`/profile/${testUser.username}`);

      await page.getByRole('button', { name: 'Edit Profile' }).click();
      const editProfileDialog = page.getByRole('dialog', {
        name: 'Edit Profile',
      });
      await editProfileDialog
        .getByRole('textbox', { name: 'Bio' })
        .fill('Updated bio');
      await editProfileDialog
        .getByRole('button', { name: 'Save Changes' })
        .click();
      await expect(editProfileDialog).not.toBeVisible();

      await expect(
        page.getByText('Profile updated successfully!'),
      ).toBeVisible();
      await expect(page.getByText('Updated bio')).toBeVisible();
    });
  });
});
