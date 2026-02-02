import { useEffect, useState } from 'react';

import * as api from '@/lib/api';
import type { Review } from '@/types/data';

export type GetCurrentUserReviewsResponse = {
  data: Review[];
};

export async function getCurrentUserReviews(): Promise<GetCurrentUserReviewsResponse> {
  return api.getCurrentUserReviews();
}

export function useCurrentUserReviewsQuery({
  options,
}: {
  options?: {
    enabled?: boolean;
    initialData?: GetCurrentUserReviewsResponse;
  };
} = {}) {
  const [data, setData] = useState<GetCurrentUserReviewsResponse | undefined>(
    options?.initialData,
  );
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    getCurrentUserReviews()
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
      const result = await getCurrentUserReviews();
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
