import { test, expect } from 'testing/fixtures/integration.fixture';
import { generateIdea } from 'testing/test-data';

test.describe('Ideas page', () => {
  test.beforeEach(async ({ mocky, API_URL }) => {
    const tags = ['technology', 'design', 'business', 'health'];

    mocky.route(`${API_URL}/ideas/tags`, (route) => {
      return route.fulfill({
        body: JSON.stringify({ data: tags }),
        status: 200,
      });
    });
  });

  test.describe('Display', () => {
    test('displays ideas list', async ({ page, mocky, API_URL }) => {
      const ideas = [generateIdea(), generateIdea()];
      mocky.route(`${API_URL}/ideas**`, async (route) => {
        return route.fulfill({
          body: JSON.stringify({
            data: ideas,
            pagination: {
              page: 1,
              limit: 10,
              total: ideas.length,
              totalPages: 1,
              prevPage: null,
              nextPage: null,
            },
          }),
          status: 200,
        });
      });

      await page.goto('/ideas');

      await expect(page.getByTestId('idea-list-item').first()).toContainText(
        ideas[0].title,
      );
      await expect(page.getByTestId('idea-list-item').nth(1)).toContainText(
        ideas[1].title,
      );
    });
  });

  test.describe('Error handling', () => {
    test('shows error when ideas fail to load', async ({
      page,
      mocky,
      API_URL,
    }) => {
      mocky.route(`${API_URL}/ideas**`, (route) => {
        return route.fulfill({
          body: JSON.stringify({ message: 'Failed to fetch ideas' }),
          status: 500,
        });
      });

      await page.goto('/ideas');

      await expect(page.getByTestId('ideas-skeleton')).not.toBeVisible();

      await expect(page.getByText('Failed to fetch ideas')).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe('Search and filter', () => {
    test('searches ideas by title', async ({ page, mocky, API_URL }) => {
      const idea1 = generateIdea({ title: 'AI Rocket Builder' });
      const idea2 = generateIdea({ title: 'AI Assistant' });
      let ideas = [idea1, idea2];

      mocky.route(`${API_URL}/ideas**`, async (route) => {
        const url = new URL(route.request.url);
        const search = url.searchParams.get('search');

        if (search) {
          ideas = ideas.filter((idea) =>
            idea.title.toLowerCase().includes(search.toLowerCase()),
          );
        }

        return route.fulfill({
          body: JSON.stringify({
            data: ideas,
            pagination: {
              page: 1,
              limit: 10,
              total: ideas.length,
              totalPages: 1,
              prevPage: null,
              nextPage: null,
            },
          }),
          status: 200,
        });
      });

      await page.goto('/ideas');

      const searchInput = page.getByRole('textbox', { name: 'Search ideas' });
      await searchInput.fill('rocket');

      await expect(page.getByText(idea1.title)).toBeVisible();
      await expect(page.getByText(`@${idea1.author.username}`)).toBeVisible();
      await expect(page.getByText(idea2.title)).not.toBeVisible();
      await expect(
        page.getByText(`@${idea2.author.username}`),
      ).not.toBeVisible();
    });

    test('filters ideas by tags', async ({ page, mocky, API_URL }) => {
      const techIdea = generateIdea({
        title: 'Tech Idea for Filter Test',
        tags: ['technology'],
      });

      const healthIdea = generateIdea({
        title: 'Health Idea for Filter Test',
        tags: ['health'],
      });

      mocky.route(`${API_URL}/ideas**`, async (route) => {
        const url = new URL(route.request.url);
        const tagsParam = url.searchParams.get('tags') || '';
        let ideas = [techIdea, healthIdea];

        if (tagsParam) {
          ideas = ideas.filter((idea) => idea.tags.includes(tagsParam));
        }

        return route.fulfill({
          body: JSON.stringify({
            data: ideas,
            pagination: {
              page: 1,
              limit: 10,
              total: ideas.length,
              totalPages: 1,
              prevPage: null,
              nextPage: null,
            },
          }),
          status: 200,
        });
      });

      await page.goto('/ideas');

      await page.getByRole('button', { name: 'technology' }).click();

      await expect(page.getByText('Tech Idea for Filter Test')).toBeVisible();
      await expect(
        page.getByText(`@${techIdea.author.username}`),
      ).toBeVisible();

      await expect(
        page.getByText('Health Idea for Filter Test'),
      ).not.toBeVisible();
    });

    test('sorts ideas by newest or oldest', async ({
      page,
      mocky,
      API_URL,
    }) => {
      const newestIdea = generateIdea({ title: 'Newest Idea For Sort Test' });
      const oldIdea = generateIdea({ title: 'Oldest Idea For Sort Test' });

      mocky.route(`${API_URL}/ideas**`, async (route) => {
        const url = new URL(route.request.url);
        const sortBy = url.searchParams.get('sortBy');
        let ideas = [newestIdea, oldIdea];
        if (sortBy === 'oldest') {
          ideas = [oldIdea, newestIdea];
        }

        return route.fulfill({
          body: JSON.stringify({
            data: ideas,
            pagination: {
              page: 1,
              limit: 10,
              total: ideas.length,
              totalPages: 1,
              prevPage: null,
              nextPage: null,
            },
          }),
          status: 200,
        });
      });

      await page.goto('/ideas');

      const itemsBeforeSort = page.getByTestId('idea-list-item');

      await expect(itemsBeforeSort.nth(0)).toContainText(newestIdea.title);
      await expect(itemsBeforeSort.nth(1)).toContainText(oldIdea.title);

      await page.getByRole('combobox', { name: 'Sort by' }).click();
      await page.getByRole('option', { name: 'Oldest' }).click();

      const itemsAfterSort = page.getByTestId('idea-list-item');

      await expect(itemsAfterSort.nth(0)).toContainText(oldIdea.title);
      await expect(itemsAfterSort.nth(1)).toContainText(newestIdea.title);
    });
  });

  test.describe('Pagination', () => {
    test('loads more ideas when clicking load more button', async ({
      page,
      mocky,
      API_URL,
    }) => {
      const firstPageIdeas = [
        generateIdea({ title: 'Page One Idea 1' }),
        generateIdea({ title: 'Page One Idea 2' }),
      ];

      const secondPageIdeas = [
        generateIdea({ title: 'Page Two Idea 1' }),
        generateIdea({ title: 'Page Two Idea 2' }),
      ];

      mocky.route(`${API_URL}/ideas**`, async (route) => {
        const url = new URL(route.request.url);
        const pageParam = url.searchParams.get('page');
        let ideas = firstPageIdeas;
        if (pageParam === '2') {
          ideas = secondPageIdeas;
        }

        return route.fulfill({
          body: JSON.stringify({
            data: ideas,
            pagination: {
              page: pageParam === '2' ? 2 : 1,
              limit: 10,
              total: ideas.length,
              totalPages: 2,
              prevPage: pageParam === '2' ? 1 : null,
              nextPage: pageParam === '2' ? null : 2,
            },
          }),
          status: 200,
        });
      });

      await page.goto('/ideas');

      await expect(page.getByText('Page One Idea 1')).toBeVisible();
      await expect(page.getByText('Page One Idea 2')).toBeVisible();

      const loadMoreButton = page.getByRole('button', {
        name: 'Load more ideas',
      });
      await expect(loadMoreButton).toBeVisible();
      await loadMoreButton.click();

      await expect(page.getByText('Page Two Idea 1')).toBeVisible();
      await expect(page.getByText('Page Two Idea 2')).toBeVisible();
    });
  });
});
