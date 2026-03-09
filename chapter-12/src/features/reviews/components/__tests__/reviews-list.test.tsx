import { vi } from 'vitest';

import type { Review } from '@/types/generated/types.gen';
import { render, screen } from 'testing/test-utils';

import { ReviewsList, type ReviewsListProps } from '../reviews-list';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'reviews:noReviewsYet': 'No reviews yet',
        'reviews:noReviewsEmptyDescription': 'Be the first to leave a review!',
        'reviews:reviewFor': 'Review for',
        'common:error': 'Error',
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
    canEditReview: () => false,
    canDeleteReview: () => false,
  }),
}));

const createMockReview = (overrides: Partial<Review> = {}): Review => ({
  id: 'review-1',
  content: 'This is a great idea!',
  rating: 4,
  authorId: 'user-1',
  author: {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
  },
  ideaId: 'idea-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

const renderReviewsList = (props: Partial<ReviewsListProps> = {}) => {
  const defaultProps: ReviewsListProps = {
    reviews: undefined,
    ...props,
  };

  return render(<ReviewsList {...defaultProps} />);
};

describe('ReviewsList', () => {
  describe('loading state', () => {
    it('should render loading skeleton when isLoading is true', () => {
      renderReviewsList({ isLoading: true });

      const skeleton = screen.getByTestId('reviews-skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should render error message when error is provided', () => {
      const error = new Error('Failed to load reviews');
      renderReviewsList({ error });

      expect(screen.getByText('Failed to load reviews')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should render empty state when reviews is undefined', () => {
      renderReviewsList({ reviews: undefined });

      expect(screen.getByText('No reviews yet')).toBeInTheDocument();
      expect(
        screen.getByText('Be the first to leave a review!'),
      ).toBeInTheDocument();
    });

    it('should render empty state when reviews array is empty', () => {
      renderReviewsList({ reviews: [] });

      expect(screen.getByText('No reviews yet')).toBeInTheDocument();
    });

    it('should render custom empty message when provided', () => {
      renderReviewsList({
        reviews: [],
        emptyMessage: 'No reviews for this idea',
      });

      expect(screen.getByText('No reviews for this idea')).toBeInTheDocument();
    });
  });

  describe('reviews list', () => {
    it('should render list of reviews', () => {
      const reviews = [
        createMockReview({ id: 'review-1', content: 'First review' }),
        createMockReview({ id: 'review-2', content: 'Second review' }),
        createMockReview({ id: 'review-3', content: 'Third review' }),
      ];

      renderReviewsList({ reviews });

      expect(screen.getByText('First review')).toBeInTheDocument();
      expect(screen.getByText('Second review')).toBeInTheDocument();
      expect(screen.getByText('Third review')).toBeInTheDocument();
    });

    it('should render review details', () => {
      const review = createMockReview({
        content: 'Excellent concept!',
        rating: 5,
        author: {
          id: 'user-1',
          username: 'johndoe',
          email: 'john@example.com',
        },
      });

      renderReviewsList({ reviews: [review] });

      expect(screen.getByText('Excellent concept!')).toBeInTheDocument();
      expect(screen.getByText('@johndoe')).toBeInTheDocument();
    });

    it('should link to author profile', () => {
      const review = createMockReview({
        author: {
          id: 'user-1',
          username: 'janedoe',
          email: 'jane@example.com',
        },
      });

      renderReviewsList({ reviews: [review] });

      const link = screen.getByRole('link', { name: '@janedoe' });
      expect(link).toHaveAttribute('href', '/profile/janedoe');
    });

    it('should render star rating', () => {
      const review = createMockReview({ rating: 4 });

      renderReviewsList({ reviews: [review] });

      const stars = document.querySelectorAll('svg');
      expect(stars.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('idea title', () => {
    it('should not show idea title by default', () => {
      const review = createMockReview({
        idea: { id: 'idea-1', title: 'My Idea' },
      });

      renderReviewsList({ reviews: [review] });

      expect(screen.queryByText('My Idea')).not.toBeInTheDocument();
    });

    it('should show idea title when showIdeaTitle is true', () => {
      const review = createMockReview({
        idea: { id: 'idea-1', title: 'My Idea' },
      });

      renderReviewsList({ reviews: [review], showIdeaTitle: true });

      expect(screen.getByText('My Idea')).toBeInTheDocument();
    });

    it('should link to idea page when showIdeaTitle is true', () => {
      const review = createMockReview({
        idea: { id: 'idea-123', title: 'Linked Idea' },
      });

      renderReviewsList({ reviews: [review], showIdeaTitle: true });

      const link = screen.getByRole('link', { name: 'Linked Idea' });
      expect(link).toHaveAttribute('href', '/ideas/idea-123');
    });
  });
});
