export const reviewsQueryKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewsQueryKeys.all, 'list'] as const,
  byIdea: (ideaId: string) =>
    [...reviewsQueryKeys.lists(), 'idea', ideaId] as const,
  byUser: (username: string) =>
    [...reviewsQueryKeys.lists(), 'user', username] as const,
  current: () => [...reviewsQueryKeys.all, 'current'] as const,
} as const;
