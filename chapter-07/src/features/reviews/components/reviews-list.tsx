import { MessageSquare } from 'lucide-react';

import { EmptyState } from '@/components/empty-state';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Review } from '@/types/generated/types.gen';

import { ReviewListItem } from './review-list-item';

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
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Error" />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare />}
        title={
          emptyMessage || 'No reviews yet. Be the first to review this idea!'
        }
        description="Share your thoughts and help others discover great ideas."
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
