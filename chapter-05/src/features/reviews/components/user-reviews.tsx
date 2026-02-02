import { ReviewsList } from '@/features/reviews/components/reviews-list';

import { useReviewsByUserQuery } from '../api/get-reviews-by-user';

export type UserReviewsProps = {
  username: string;
};

export function UserReviews({ username }: UserReviewsProps) {
  const reviewsQuery = useReviewsByUserQuery({ username });
  const reviews = reviewsQuery.data?.data;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Reviews by {username} ({reviews?.length || 0})
      </h2>

      <ReviewsList
        reviews={reviews}
        isLoading={reviewsQuery.isLoading}
        showIdeaTitle={true}
        emptyMessage={`${username} hasn't written any reviews yet.`}
        error={reviewsQuery.error}
      />
    </div>
  );
}
