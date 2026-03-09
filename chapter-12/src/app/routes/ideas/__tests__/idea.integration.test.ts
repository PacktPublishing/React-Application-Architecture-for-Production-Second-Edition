import type { Review } from '@/types/generated/types.gen';
import { test, expect } from 'testing/fixtures/integration.fixture';
import { generateIdea, generateReview, generateUser } from 'testing/test-data';

test.describe('Idea page', () => {
  test.describe('Display', () => {
    test('displays idea details and reviews as anonymous user', async ({
      page,
      mocky,
      API_URL,
    }) => {
      const author = generateUser();
      const idea = generateIdea({
        author,
        reviewsCount: 2,
        avgRating: 4,
      });
      const reviews = [
        generateReview({ ideaId: idea.id, author: generateUser() }),
        generateReview({ ideaId: idea.id, author: generateUser() }),
      ];

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: reviews }),
          status: 200,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      await expect(page.getByText(idea.title)).toBeVisible();
      await expect(
        page.getByText(idea.shortDescription, { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(idea.description, { exact: true }),
      ).toBeVisible();
      await expect(page.getByText(`@${author.username}`)).toBeVisible();

      await expect(page.getByText(`${reviews.length} Reviews`)).toBeVisible();
      await expect(page.getByText(reviews[0].content)).toBeVisible();
      await expect(page.getByText(reviews[1].content)).toBeVisible();
    });

    test('shows error when idea is not found', async ({
      page,
      mocky,
      API_URL,
    }) => {
      mocky.route(`${API_URL}/ideas/nonexistent`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ message: 'Idea not found' }),
          status: 404,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/nonexistent`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [] }),
          status: 200,
        });
      });

      await page.goto('/ideas/nonexistent');

      await expect(page.getByText('Error loading idea').first()).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Back to Ideas' }),
      ).toBeVisible();
    });
  });

  test.describe('Permissions', () => {
    test('idea owner sees actions menu but not write review button', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const idea = generateIdea({ author: currentUser });
      const reviews = [
        generateReview({ ideaId: idea.id, author: generateUser() }),
      ];

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: reviews }),
          status: 200,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      await expect(
        page.getByRole('button', { name: 'Idea actions menu' }),
      ).toBeVisible();

      await expect(
        page.getByRole('button', { name: 'Write a Review' }),
      ).not.toBeVisible();
    });

    test('non-owner does not see idea or review actions', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const ideaAuthor = generateUser();
      const reviewAuthor = generateUser();
      const idea = generateIdea({ author: ideaAuthor });
      const review = generateReview({
        ideaId: idea.id,
        author: reviewAuthor,
      });

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [review] }),
          status: 200,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      await expect(page.getByText(review.content)).toBeVisible();

      await expect(
        page.getByRole('button', { name: 'Idea actions menu' }),
      ).not.toBeVisible();

      await expect(
        page.getByRole('button', { name: 'Review actions menu' }),
      ).not.toBeVisible();

      await expect(
        page.getByRole('button', { name: 'Write a Review' }),
      ).toBeVisible();
    });
  });

  test.describe('Reviews', () => {
    test('logged in user can create a review', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const ideaAuthor = generateUser();
      const idea = generateIdea({ author: ideaAuthor });
      const reviews: Review[] = [];

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: reviews }),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews`, async (route) => {
        if (route.request.method !== 'POST') {
          return route.fulfill({ status: 405 });
        }
        const body = await route.request.json();
        const newReview = generateReview({
          ideaId: idea.id,
          author: currentUser,
          content: body.content,
          rating: body.rating,
        });
        return route.fulfill({
          body: JSON.stringify(newReview),
          status: 201,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      // Click write review button
      await page.getByRole('button', { name: 'Write a Review' }).click();

      const writeReviewDialog = page.getByRole('dialog', {
        name: 'Write a Review',
      });
      await expect(writeReviewDialog).toBeVisible();

      // Select a rating
      await writeReviewDialog.getByRole('radio', { name: '4 stars' }).click();

      // Fill review content
      await writeReviewDialog
        .getByRole('textbox', { name: 'Review' })
        .fill('This is a great idea!');

      // Submit review
      await writeReviewDialog
        .getByRole('button', { name: 'Submit Review' })
        .click();

      // Should see success notification
      await expect(
        page.getByText('Review created successfully!'),
      ).toBeVisible();
    });

    test('logged in user who already reviewed cannot write another review', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const ideaAuthor = generateUser();
      const idea = generateIdea({ author: ideaAuthor });
      const existingReview = generateReview({
        ideaId: idea.id,
        author: currentUser,
      });

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [existingReview] }),
          status: 200,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      // Should not see write review button since user already reviewed
      await expect(
        page.getByRole('button', { name: 'Write a Review' }),
      ).not.toBeVisible();

      // But should see their existing review
      await expect(page.getByText(existingReview.content)).toBeVisible();
    });

    test('review author can edit their review', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const ideaAuthor = generateUser();
      const idea = generateIdea({ author: ideaAuthor });
      const review = generateReview({
        ideaId: idea.id,
        author: currentUser,
      });

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [review] }),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/${review.id}`, async (route) => {
        if (route.request.method !== 'PATCH') {
          return route.fulfill({ status: 405 });
        }
        const body = await route.request.json();
        return route.fulfill({
          body: JSON.stringify({
            ...review,
            content: body.content,
            updatedAt: new Date().toISOString(),
          }),
          status: 200,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      // Open review actions menu
      await page.getByRole('button', { name: 'Review actions menu' }).click();

      // Wait for menu to open and click edit
      await page.getByRole('menuitem', { name: 'Edit' }).click();

      const editReviewDialog = page.getByRole('dialog', {
        name: 'Edit Review',
      });

      // Update review content
      const updatedContent = 'Updated review content';
      await editReviewDialog
        .getByRole('textbox', { name: 'Review' })
        .fill(updatedContent);

      // Submit
      await editReviewDialog
        .getByRole('button', { name: 'Submit Review' })
        .click();

      // Should see success notification
      await expect(
        page.getByText('Review updated successfully!'),
      ).toBeVisible();
    });

    test('review author can delete their review', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const ideaAuthor = generateUser();
      const idea = generateIdea({ author: ideaAuthor });
      const review = generateReview({
        ideaId: idea.id,
        author: currentUser,
      });

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [review] }),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/${review.id}`, (route) => {
        if (route.request.method === 'DELETE') {
          return route.fulfill({
            body: JSON.stringify({ message: 'Review deleted' }),
            status: 200,
          });
        }
        return route.fulfill({
          body: JSON.stringify(review),
          status: 200,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      // Open review actions menu
      await page.getByRole('button', { name: 'Review actions menu' }).click();

      // Wait for menu to open and click delete
      await page.getByRole('menuitem', { name: 'Delete' }).click();

      // Confirm deletion in dialog
      const dialog = page.getByRole('alertdialog');
      await expect(
        dialog.getByText('Are you sure you want to delete this review?'),
      ).toBeVisible();
      await dialog.getByRole('button', { name: 'Delete' }).click();

      // Should see success notification
      await expect(
        page.getByText('Review deleted successfully!'),
      ).toBeVisible();
    });

    test('shows error when creating review fails', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const ideaAuthor = generateUser();
      const idea = generateIdea({ author: ideaAuthor });

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [] }),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ message: 'Internal server error' }),
          status: 500,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      await page.getByRole('button', { name: 'Write a Review' }).click();
      const writeReviewDialog = page.getByRole('dialog', {
        name: 'Write a Review',
      });
      await writeReviewDialog.getByRole('radio', { name: '4 stars' }).click();
      await writeReviewDialog
        .getByRole('textbox', { name: 'Review' })
        .fill('This is a great idea!');
      await writeReviewDialog
        .getByRole('button', { name: 'Submit Review' })
        .click();

      await expect(
        page.getByText('Failed to create review. Please try again.'),
      ).toBeVisible();
    });

    test('shows error when deleting review fails', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const ideaAuthor = generateUser();
      const idea = generateIdea({ author: ideaAuthor });
      const review = generateReview({
        ideaId: idea.id,
        author: currentUser,
      });

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [review] }),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/${review.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ message: 'Internal server error' }),
          status: 500,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      await page.getByRole('button', { name: 'Review actions menu' }).click();

      // Wait for menu to open and click delete
      await page.getByRole('menuitem', { name: 'Delete' }).click();

      const dialog = page.getByRole('alertdialog');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'Delete' }).click();

      await expect(
        page.getByText('Failed to delete review. Please try again.'),
      ).toBeVisible();
    });
  });

  test.describe('Idea actions', () => {
    test('idea owner can delete their idea', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const idea = generateIdea({ author: currentUser });

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        if (route.request.method === 'DELETE') {
          return route.fulfill({
            body: JSON.stringify({ message: 'Idea deleted' }),
            status: 200,
          });
        }
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [] }),
          status: 200,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      // Open idea actions menu
      await page.getByRole('button', { name: 'Idea actions menu' }).click();

      // Wait for menu to open and click delete
      await page.getByRole('menuitem', { name: 'Delete' }).click();

      // Confirm deletion in dialog
      const dialog = page.getByRole('alertdialog');
      await expect(
        dialog.getByText(`Are you sure you want to delete "${idea.title}"?`),
      ).toBeVisible();
      await dialog.getByRole('button', { name: 'Delete' }).click();

      // Should see success notification
      await expect(page.getByText('Idea deleted successfully!')).toBeVisible();
    });

    test('shows error when deleting idea fails', async ({
      page,
      mocky,
      context,
      API_URL,
    }) => {
      const currentUser = generateUser();
      const idea = generateIdea({ author: currentUser });

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

      mocky.route(`${API_URL}/ideas/${idea.id}`, (route) => {
        if (route.request.method === 'DELETE') {
          return route.fulfill({
            body: JSON.stringify({ message: 'Internal server error' }),
            status: 500,
          });
        }
        return route.fulfill({
          body: JSON.stringify(idea),
          status: 200,
        });
      });

      mocky.route(`${API_URL}/reviews/idea/${idea.id}`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ data: [] }),
          status: 200,
        });
      });

      await page.goto(`/ideas/${idea.id}`);

      await page.getByRole('button', { name: 'Idea actions menu' }).click();

      // Wait for menu to open and click delete
      await page.getByRole('menuitem', { name: 'Delete' }).click();
      const dialog = page.getByRole('alertdialog');
      await dialog.getByRole('button', { name: 'Delete' }).click();

      await expect(
        page.getByText('Failed to delete idea. Please try again.'),
      ).toBeVisible();
    });
  });
});
