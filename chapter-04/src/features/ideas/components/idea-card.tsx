import { MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router';

import { RatingDisplay } from '@/components/rating-display';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/date';
import type { Idea } from '@/types/data';

export type IdeaCardProps = {
  idea: Idea;
};

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            <Link to={`/ideas/${idea.id}`} className="hover:text-primary">
              {idea.title}
            </Link>
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <Link
            to={`/profile/${idea.author.username}`}
            className="hover:text-primary"
          >
            @{idea.author.username}
          </Link>
          <span>•</span>
          <span>{formatDate(idea.createdAt, 'en')}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4 line-clamp-3 overflow-hidden">
          <p>{idea.shortDescription}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {idea.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            {idea.avgRating !== null && idea.avgRating > 0 && (
              <RatingDisplay
                rating={idea.avgRating}
                reviewCount={idea.reviewsCount}
                size="sm"
                showCount={false}
              />
            )}
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{idea.reviewsCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
