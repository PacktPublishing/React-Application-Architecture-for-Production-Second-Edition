import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';

export function useSearchAndFilters() {
  const [urlSearchTerm, setUrlSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  );

  const [selectedTags, setSelectedTags] = useQueryState(
    'tags',
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsString.withDefault(''),
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((currentTags) => {
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      return newTags.length > 0 ? newTags : null;
    });
  };

  const clearFilters = () => {
    setUrlSearchTerm('');
    setSelectedTags(null);
    setSortBy(null);
  };

  const hasActiveFilters =
    selectedTags.length > 0 || urlSearchTerm.length > 0 || sortBy.length > 0;

  return {
    searchTerm: urlSearchTerm,
    urlSearchTerm,
    selectedTags,
    sortBy,
    params: {
      ...(selectedTags.length > 0 && { tags: selectedTags.join(',') }),
      ...(urlSearchTerm && { search: urlSearchTerm }),
      ...(sortBy && { sortBy }),
    },
    hasActiveFilters,

    setSearchTerm: setUrlSearchTerm,
    setSelectedTags,
    toggleTag,
    setSortBy,
    clearFilters,
  };
}
