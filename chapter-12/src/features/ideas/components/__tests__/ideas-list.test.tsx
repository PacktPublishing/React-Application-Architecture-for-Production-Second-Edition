import { vi } from 'vitest';

import type { Idea } from '@/types/generated/types.gen';
import { render, screen } from 'testing/test-utils';

import { IdeasList, type IdeasListProps } from '../ideas-list';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'ideas:noIdeasAvailable': 'No ideas available',
        'ideas:noIdeasEmptyDescription': 'Be the first to share an idea!',
        'common:error': 'Error',
        'reviews:reviews': `${params?.count} reviews`,
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' },
  }),
}));

vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/features/auth/hooks/use-authorization', () => ({
  useAuthorization: () => ({
    canEditIdea: () => false,
    canDeleteIdea: () => false,
  }),
}));

const createMockIdea = (overrides: Partial<Idea> = {}): Idea => ({
  id: 'idea-1',
  title: 'Test Idea',
  shortDescription: 'A short description',
  description: 'A detailed description',
  tags: ['tech', 'design'],
  authorId: 'user-1',
  author: {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
  },
  reviewsCount: 5,
  avgRating: 4.5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

const renderIdeasList = (props: Partial<IdeasListProps> = {}) => {
  const defaultProps: IdeasListProps = {
    ideas: undefined,
    ...props,
  };

  return render(<IdeasList {...defaultProps} />);
};

describe('IdeasList', () => {
  describe('loading state', () => {
    it('should render loading skeletons when isLoading is true', () => {
      renderIdeasList({ isLoading: true });

      const skeleton = screen.getByTestId('ideas-skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should render error message when error is provided', () => {
      const error = new Error('Failed to load ideas');
      renderIdeasList({ error });

      expect(screen.getByText('Failed to load ideas')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should render empty state when ideas is undefined', () => {
      renderIdeasList({ ideas: undefined });

      expect(screen.getByText('No ideas available')).toBeInTheDocument();
      expect(
        screen.getByText('Be the first to share an idea!'),
      ).toBeInTheDocument();
    });

    it('should render empty state when ideas array is empty', () => {
      renderIdeasList({ ideas: [] });

      expect(screen.getByText('No ideas available')).toBeInTheDocument();
    });

    it('should render custom empty message when provided', () => {
      renderIdeasList({ ideas: [], emptyMessage: 'No matching ideas found' });

      expect(screen.getByText('No matching ideas found')).toBeInTheDocument();
    });
  });

  describe('ideas list', () => {
    it('should render list of ideas', () => {
      const ideas = [
        createMockIdea({ id: 'idea-1', title: 'First Idea' }),
        createMockIdea({ id: 'idea-2', title: 'Second Idea' }),
        createMockIdea({ id: 'idea-3', title: 'Third Idea' }),
      ];

      renderIdeasList({ ideas });

      expect(screen.getByText('First Idea')).toBeInTheDocument();
      expect(screen.getByText('Second Idea')).toBeInTheDocument();
      expect(screen.getByText('Third Idea')).toBeInTheDocument();
    });

    it('should render idea details', () => {
      const idea = createMockIdea({
        title: 'My Great Idea',
        shortDescription: 'This is a brief summary',
        tags: ['innovation', 'startup'],
        author: {
          id: 'user-1',
          username: 'johndoe',
          email: 'john@example.com',
        },
      });

      renderIdeasList({ ideas: [idea] });

      expect(screen.getByText('My Great Idea')).toBeInTheDocument();
      expect(screen.getByText('This is a brief summary')).toBeInTheDocument();
      expect(screen.getByText('@johndoe')).toBeInTheDocument();
      expect(screen.getByText('innovation')).toBeInTheDocument();
      expect(screen.getByText('startup')).toBeInTheDocument();
    });

    it('should link to idea detail page', () => {
      const idea = createMockIdea({ id: 'idea-123', title: 'Linked Idea' });

      renderIdeasList({ ideas: [idea] });

      const link = screen.getByRole('link', { name: 'Linked Idea' });
      expect(link).toHaveAttribute('href', '/ideas/idea-123');
    });

    it('should link to author profile', () => {
      const idea = createMockIdea({
        author: {
          id: 'user-1',
          username: 'janedoe',
          email: 'jane@example.com',
        },
      });

      renderIdeasList({ ideas: [idea] });

      const link = screen.getByRole('link', { name: '@janedoe' });
      expect(link).toHaveAttribute('href', '/profile/janedoe');
    });

    it('should display review count', () => {
      const idea = createMockIdea({ reviewsCount: 10 });

      renderIdeasList({ ideas: [idea] });

      expect(screen.getByText('10 reviews')).toBeInTheDocument();
    });
  });
});
