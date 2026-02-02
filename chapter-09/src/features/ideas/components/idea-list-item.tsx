import { MessageSquare, User, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { RatingDisplay } from '@/components/rating-display';
import { Badge } from '@/components/ui/badge';
import { useAuthorization } from '@/features/auth/hooks/use-authorization';
import { formatDate } from '@/lib/date';
import type { Idea } from '@/types/generated/types.gen';

import { IdeaActions } from './idea-actions';

export type IdeaListItemProps = {
  idea: Idea;
};

export function IdeaListItem({ idea }: IdeaListItemProps) {
  const { i18n, t } = useTranslation(['reviews']);
  const { canEditIdea, canDeleteIdea } = useAuthorization();

  const canEditAndDeleteIdea = canEditIdea(idea) && canDeleteIdea(idea);

  return (
    <>
      <div className="py-6 hover:bg-muted/30 transition-colors -mx-6 px-6 rounded-lg">
        <div className="flex flex-col space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                <Link to={`/ideas/${idea.id}`} className="hover:text-primary">
                  {idea.title}
                </Link>
              </h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <Link
                    to={`/profile/${idea.author.username}`}
                    className="hover:text-primary"
                  >
                    @{idea.author.username}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(idea.createdAt, i18n.language)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>
                    {t('reviews:reviews', { count: idea.reviewsCount })}
                  </span>
                </div>
                {idea.avgRating !== null && idea.avgRating > 0 && (
                  <RatingDisplay
                    rating={idea.avgRating}
                    reviewCount={idea.reviewsCount}
                    size="sm"
                    showCount={false}
                  />
                )}
              </div>
            </div>

            {canEditAndDeleteIdea && <IdeaActions idea={idea} />}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>{idea.shortDescription}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {idea.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
