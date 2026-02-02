import { Seo } from '@/components/seo';
import { useCurrentUserReviewsQuery } from '@/features/reviews/api/get-current-user-reviews';
import { ReviewsList } from '@/features/reviews/components/reviews-list';

export default function MyReviewsPage() {
  const reviewsQuery = useCurrentUserReviewsQuery();
  const reviews = reviewsQuery.data?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title="My Reviews | AIdeas"
        description="View and manage all reviews you've written for AI application ideas"
      />
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
          <p className="text-muted-foreground">
            View and manage all reviews you&apos;ve written
          </p>
        </div>

        <ReviewsList
          reviews={reviews}
          isLoading={reviewsQuery.isLoading}
          showIdeaTitle={true}
          emptyMessage="You haven't written any reviews yet. Explore ideas and share your feedback!"
          error={reviewsQuery.error}
        />
      </div>
    </div>
  );
}
