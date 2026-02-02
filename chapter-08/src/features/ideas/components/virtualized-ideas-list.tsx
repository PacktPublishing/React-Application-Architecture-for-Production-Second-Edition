import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Lightbulb } from 'lucide-react';

import { EmptyState } from '@/components/empty-state';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Idea } from '@/types/generated/types.gen';

import { IdeaListItem } from './idea-list-item';

export type VirtualizedIdeasListProps = {
  ideas: Idea[] | undefined;
  isLoading?: boolean;
  emptyMessage?: string;
  error?: Error | null;
};

export function VirtualizedIdeasList({
  ideas,
  isLoading,
  emptyMessage,
  error,
}: VirtualizedIdeasListProps) {
  const virtualizer = useWindowVirtualizer({
    count: ideas?.length || 0,
    estimateSize: () => 150,
    overscan: 5,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Error" />;
  }

  if (!ideas || ideas.length === 0) {
    return (
      <EmptyState
        icon={<Lightbulb />}
        title={emptyMessage || 'No ideas available yet'}
        description="Check back later or be the first to share an idea!"
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const idea = ideas[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="px-6 border-b border-border last:border-b-0">
                  <IdeaListItem idea={idea} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
