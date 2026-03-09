import { vi } from 'vitest';

import { render, screen, userEvent, waitFor } from 'testing/test-utils';

import { ReviewForm, type ReviewFormProps } from '../review-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'reviews:rating': 'Rating',
        'reviews:review': 'Review',
        'reviews:reviewPlaceholder': 'Write your review...',
        'reviews:submitReview': 'Submit Review',
        'reviews:starsCount': `${params?.count} stars`,
        'common:cancel': 'Cancel',
        'common:submitting': 'Submitting...',
      };
      return translations[key] || key;
    },
  }),
}));

const renderReviewForm = (props: Partial<ReviewFormProps> = {}) => {
  const defaultProps: ReviewFormProps = {
    onSubmit: vi.fn(),
    onModalClose: vi.fn(),
    isSubmitting: false,
    ideaId: 'idea-123',
    ...props,
  };

  return {
    ...render(<ReviewForm {...defaultProps} />),
    props: defaultProps,
  };
};

describe('ReviewForm', () => {
  describe('rendering', () => {
    it('should render rating and content fields', () => {
      renderReviewForm();

      expect(
        screen.getByRole('radiogroup', { name: 'Rating' }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Review')).toBeInTheDocument();
    });

    it('should render 5 star rating buttons', () => {
      renderReviewForm();

      const stars = screen.getAllByRole('radio');
      expect(stars).toHaveLength(5);
    });

    it('should render submit button with submit text', () => {
      renderReviewForm();

      expect(
        screen.getByRole('button', { name: 'Submit Review' }),
      ).toBeInTheDocument();
    });

    it('should render submit button with submitting text when isSubmitting', () => {
      renderReviewForm({ isSubmitting: true });

      expect(
        screen.getByRole('button', { name: 'Submitting...' }),
      ).toBeInTheDocument();
    });

    it('should disable submit button when isSubmitting', () => {
      renderReviewForm({ isSubmitting: true });

      expect(
        screen.getByRole('button', { name: 'Submitting...' }),
      ).toBeDisabled();
    });

    it('should render cancel button', () => {
      renderReviewForm();

      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();
    });

    it('should disable cancel button when isSubmitting', () => {
      renderReviewForm({ isSubmitting: true });

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    });
  });

  describe('star rating', () => {
    it('should have default rating of 5 stars', () => {
      renderReviewForm();

      const stars = screen.getAllByRole('radio');
      stars.forEach((star) => {
        expect(star).toHaveAttribute('aria-checked', 'true');
      });
    });

    it('should update rating when star clicked', async () => {
      const user = userEvent.setup();
      renderReviewForm();

      const stars = screen.getAllByRole('radio');
      await user.click(stars[2]); // Click 3rd star

      expect(stars[0]).toHaveAttribute('aria-checked', 'true');
      expect(stars[1]).toHaveAttribute('aria-checked', 'true');
      expect(stars[2]).toHaveAttribute('aria-checked', 'true');
      expect(stars[3]).toHaveAttribute('aria-checked', 'false');
      expect(stars[4]).toHaveAttribute('aria-checked', 'false');
    });

    it('should have accessible labels for each star', () => {
      renderReviewForm();

      expect(
        screen.getByRole('radio', { name: '1 stars' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: '5 stars' }),
      ).toBeInTheDocument();
    });
  });

  describe('initial data', () => {
    it('should populate form with initial review data', () => {
      renderReviewForm({
        initialReview: {
          id: 'review-1',
          content: 'Great idea!',
          rating: 4,
          author: {
            id: 'user-1',
            username: 'testuser',
            email: 'test@example.com',
          },
          ideaId: 'idea-123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: 'user-1',
        },
      });

      expect(screen.getByLabelText('Review')).toHaveValue('Great idea!');

      const stars = screen.getAllByRole('radio');
      expect(stars[0]).toHaveAttribute('aria-checked', 'true');
      expect(stars[1]).toHaveAttribute('aria-checked', 'true');
      expect(stars[2]).toHaveAttribute('aria-checked', 'true');
      expect(stars[3]).toHaveAttribute('aria-checked', 'true');
      expect(stars[4]).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with form data when submitted with valid data', async () => {
      const user = userEvent.setup();
      const { props } = renderReviewForm();

      await user.type(
        screen.getByRole('textbox', { name: 'Review' }),
        'This is a great idea!',
      );

      const stars = screen.getAllByRole('radio');
      await user.click(stars[3]); // 4 stars

      await user.click(screen.getByRole('button', { name: 'Submit Review' }));

      await waitFor(() => {
        expect(props.onSubmit).toHaveBeenCalledWith(
          {
            content: 'This is a great idea!',
            rating: 4,
            ideaId: 'idea-123',
          },
          expect.anything(),
        );
      });
    });

    it('should not call onSubmit when content is empty', async () => {
      const user = userEvent.setup();
      const { props } = renderReviewForm();

      await user.click(screen.getByRole('button', { name: 'Submit Review' }));

      await waitFor(() => {
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('cancel button', () => {
    it('should call onModalClose when cancel button clicked', async () => {
      const user = userEvent.setup();
      const { props } = renderReviewForm();

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(props.onModalClose).toHaveBeenCalled();
    });

    it('should reset form when cancel button clicked', async () => {
      const user = userEvent.setup();
      renderReviewForm();

      await user.type(
        screen.getByRole('textbox', { name: 'Review' }),
        'Some content',
      );
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByRole('textbox', { name: 'Review' })).toHaveValue('');
    });
  });

  describe('error handling', () => {
    it('should display error message when error prop is provided', () => {
      const error = new Error('Failed to submit review');
      renderReviewForm({ error });

      expect(screen.getByText('Failed to submit review')).toBeInTheDocument();
    });

    it('should not display error message when error is null', () => {
      renderReviewForm({ error: null });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
