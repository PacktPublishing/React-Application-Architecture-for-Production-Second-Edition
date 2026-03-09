export const profileQueryKeys = {
  all: ['profile'] as const,
  byUsername: (username: string) =>
    [...profileQueryKeys.all, username] as const,
} as const;
