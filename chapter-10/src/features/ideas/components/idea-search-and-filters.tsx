import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTagsQuery } from '@/features/ideas/api/get-tags';
import { useSearchAndFilters } from '@/features/ideas/hooks/use-search-and-filters';

export function IdeaSearchAndFilters() {
  const { t } = useTranslation(['ideas', 'common']);
  const {
    searchTerm,
    selectedTags,
    sortBy,
    hasActiveFilters,
    setSearchTerm,
    toggleTag,
    setSortBy,
    clearFilters,
  } = useSearchAndFilters();

  const tagsQuery = useTagsQuery();
  const availableTags = tagsQuery.data?.data || [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          aria-label={t('ideas:searchPlaceholder')}
          placeholder={t('ideas:searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">{t('ideas:filterByTags')}</span>
        {availableTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            className="cursor-pointer"
            render={
              <button
                type="button"
                aria-pressed={selectedTags.includes(tag)}
                aria-label={t('ideas:tagStatus', {
                  tag,
                  status: selectedTags.includes(tag)
                    ? t('common:selected')
                    : t('common:notSelected'),
                })}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            }
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">
            {t('ideas:sortBy')}:
          </span>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
            itemToStringLabel={(item) =>
              t(`ideas:${item as 'newest' | 'oldest' | 'rating' | 'reviews'}`)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('ideas:newest')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('ideas:newest')}</SelectItem>
              <SelectItem value="oldest">{t('ideas:oldest')}</SelectItem>
              <SelectItem value="rating">{t('ideas:rating')}</SelectItem>
              <SelectItem value="reviews">{t('ideas:reviews')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2"
          >
            <X className="h-3 w-3 mr-1" aria-hidden="true" />
            {t('common:clearFilters')}
          </Button>
        )}
      </div>
    </div>
  );
}
