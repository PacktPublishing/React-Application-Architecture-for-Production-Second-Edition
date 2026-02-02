import { User as UserIcon } from 'lucide-react';
import { Link } from 'react-router';

import { MarkdownRenderer } from '@/components/markdown-renderer';
import { RatingDisplay } from '@/components/rating-display';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthorization } from '@/features/auth/hooks/use-authorization';
import { formatDate } from '@/lib/date';
import type { Idea } from '@/types/generated/types.gen';

import { IdeaActions } from './idea-actions';

export type IdeaDetailsProps = {
  idea: Idea;
};

export function IdeaDetails({ idea }: IdeaDetailsProps) {
  const { canEditIdea, canDeleteIdea } = useAuthorization();

  const canEditAndDeleteIdea = canEditIdea(idea) && canDeleteIdea(idea);
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl">{idea?.title}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              <Link
                to={`/profile/${idea?.author.username}`}
                className="hover:text-primary"
              >
                @{idea?.author.username}
              </Link>
              <span>•</span>
              <span>{formatDate(idea?.createdAt, 'en')}</span>
            </div>
          </div>

          {canEditAndDeleteIdea && <IdeaActions idea={idea} />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-base text-foreground border-l-4 border-primary/20 pl-4 bg-muted/30 py-3 rounded-r">
            <p className="font-medium">{idea?.shortDescription}</p>
          </div>

          {idea?.avgRating !== null && (
            <div className="flex items-center space-x-4">
              <RatingDisplay
                rating={idea.avgRating}
                reviewCount={idea.reviewsCount}
                size="md"
              />
            </div>
          )}

          <div className="text-muted-foreground">
            <MarkdownRenderer content={idea?.description} />
          </div>

          <div className="flex flex-wrap gap-2">
            {idea?.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
