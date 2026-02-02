import { Star, User, Calendar } from 'lucide-react';
import { Link } from 'react-router';

import { useAuthorization } from '@/features/auth/hooks/use-authorization';
import { formatDate } from '@/lib/date';
import type { Review } from '@/types/generated/types.gen';

import { ReviewActions } from './review-actions';

export type ReviewListItemProps = {
  review: Review;
  showIdeaTitle?: boolean;
};

export function ReviewListItem({
  review,
  showIdeaTitle = false,
}: ReviewListItemProps) {
  const { canEditReview, canDeleteReview } = useAuthorization();

  const canEditAndDeleteReview =
    canEditReview(review) && canDeleteReview(review);

  return (
    <>
      <div className="py-4 hover:bg-muted/30 transition-colors -mx-6 px-6 rounded-lg">
        <div className="flex flex-col space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <Link
                    to={`/profile/${review.author.username}`}
                    className="hover:text-primary"
                  >
                    @{review.author.username}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(review.createdAt, 'en')}</span>
                </div>
                {canEditAndDeleteReview && <ReviewActions review={review} />}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>

          <div className="text-sm">
            <p>{review.content}</p>
          </div>

          {showIdeaTitle && review.idea && (
            <div className="text-xs text-muted-foreground">
              Review for:{' '}
              <Link
                to={`/ideas/${review.idea.id}`}
                className="font-medium hover:text-primary"
              >
                {review.idea.title}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
