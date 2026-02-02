import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/empty-state';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent } from '@/components/ui/card';
import type { Review } from '@/types/generated/types.gen';

import { ReviewListItem } from './review-list-item';
import { ReviewsSkeleton } from './reviews-skeleton';

export type ReviewsListProps = {
  reviews: Review[] | undefined;
  isLoading?: boolean;
  showIdeaTitle?: boolean;
  emptyMessage?: string;
  error?: Error | null;
};

export function ReviewsList({
  reviews,
  isLoading,
  showIdeaTitle = false,
  emptyMessage,
  error,
}: ReviewsListProps) {
  const { t } = useTranslation(['reviews', 'common']);

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (error) {
    return <ErrorMessage error={error} title={t('common:error')} />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare />}
        title={emptyMessage || t('reviews:noReviewsYet')}
        description={t('reviews:noReviewsEmptyDescription')}
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <div key={review.id} className="px-6">
              <ReviewListItem review={review} showIdeaTitle={showIdeaTitle} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
