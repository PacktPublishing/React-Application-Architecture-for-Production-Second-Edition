import { useEffect, useState } from 'react';

import * as api from '@/lib/api';
import type { Idea } from '@/types/data';

export type GetCurrentUserIdeasResponse = {
  data: Idea[];
};

export async function getCurrentUserIdeas(): Promise<GetCurrentUserIdeasResponse> {
  return api.getCurrentUserIdeas();
}

export function useCurrentUserIdeasQuery({
  options,
}: {
  options?: {
    enabled?: boolean;
    initialData?: GetCurrentUserIdeasResponse;
  };
} = {}) {
  const [data, setData] = useState<GetCurrentUserIdeasResponse | undefined>(
    options?.initialData,
  );
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    getCurrentUserIdeas()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData(undefined);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [enabled]);

  const refetch = async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getCurrentUserIdeas();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    isError: error !== null,
    refetch,
  };
}
