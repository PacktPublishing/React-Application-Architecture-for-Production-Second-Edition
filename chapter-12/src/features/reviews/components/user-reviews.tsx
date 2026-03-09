import { useTranslation } from 'react-i18next';

import { ReviewsList } from '@/features/reviews/components/reviews-list';

import { useReviewsByUserQuery } from '../api/get-reviews-by-user';

export type UserReviewsProps = {
  username: string;
};

export function UserReviews({ username }: UserReviewsProps) {
  const { t } = useTranslation(['reviews']);
  const reviewsQuery = useReviewsByUserQuery({ username });
  const reviews = reviewsQuery.data?.data;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        {t('reviews:reviewsBy', { username, count: reviews?.length || 0 })}
      </h2>

      <ReviewsList
        reviews={reviews}
        isLoading={reviewsQuery.isLoading}
        showIdeaTitle={true}
        emptyMessage={t('reviews:noReviewsWritten', { username })}
        error={reviewsQuery.error}
      />
    </div>
  );
}
