import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type RatingDisplayProps = {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
};

export function RatingDisplay({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
}: RatingDisplayProps) {
  const { t } = useTranslation(['common', 'reviews']);
  const starSize =
    size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const textSize =
    size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  if (rating === 0) {
    return (
      <div
        className={`flex items-center space-x-1 text-muted-foreground ${textSize}`}
        aria-label={t('common:noRatings')}
      >
        <div className="flex space-x-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`${starSize} text-gray-300`} aria-hidden />
          ))}
        </div>
        {showCount && <span aria-hidden>{t('common:noRatings')}</span>}
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const ratingLabel =
    showCount && reviewCount !== undefined
      ? t('reviews:ratingDisplayWithCount', {
          rating: rating.toFixed(1),
          reviewCount,
        })
      : t('reviews:ratingDisplay', { rating: rating.toFixed(1) });

  return (
    <div
      className={`flex items-center space-x-1 ${textSize}`}
      aria-label={ratingLabel}
    >
      <div className="flex space-x-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) {
            return (
              <Star
                key={i}
                className={`${starSize} fill-yellow-400 text-yellow-400`}
                aria-hidden
              />
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <div key={i} className="relative">
                <Star className={`${starSize} text-gray-300`} aria-hidden />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={`${starSize} fill-yellow-400 text-yellow-400`}
                    aria-hidden
                  />
                </div>
              </div>
            );
          } else {
            return (
              <Star
                key={i}
                className={`${starSize} text-gray-300`}
                aria-hidden
              />
            );
          }
        })}
      </div>
      <span className="font-medium" aria-hidden>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-muted-foreground" aria-hidden>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
