import { useTranslation } from 'react-i18next';

import { Seo } from '@/components/seo';
import { useCurrentUserReviewsQuery } from '@/features/reviews/api/get-current-user-reviews';
import { ReviewsList } from '@/features/reviews/components/reviews-list';

export default function MyReviewsPage() {
  const { t } = useTranslation(['reviews']);
  const reviewsQuery = useCurrentUserReviewsQuery();
  const reviews = reviewsQuery.data?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={t('reviews:meta.myReviews.title')}
        description={t('reviews:meta.myReviews.description')}
      />
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('reviews:myReviewsTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('reviews:myReviewsDescription')}
          </p>
        </div>

        <ReviewsList
          reviews={reviews}
          isLoading={reviewsQuery.isLoading}
          showIdeaTitle={true}
          emptyMessage={t('reviews:noReviewsYetDescription')}
          error={reviewsQuery.error}
        />
      </div>
    </div>
  );
}
