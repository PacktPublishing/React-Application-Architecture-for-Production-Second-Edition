import { useEffect, useState } from 'react';

import * as api from '@/lib/api';
import type { Review } from '@/types/data';

export type GetReviewsByUserResponse = {
  data: Review[];
};

export async function getReviewsByUser({
  username,
}: {
  username: string;
}): Promise<GetReviewsByUserResponse> {
  return api.getReviewsByUser({ username });
}

export function useReviewsByUserQuery({
  username,
  options,
}: {
  username: string | undefined;
  options?: {
    enabled?: boolean;
    initialData?: GetReviewsByUserResponse;
  };
}) {
  const [data, setData] = useState<GetReviewsByUserResponse | undefined>(
    options?.initialData,
  );
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = (options?.enabled ?? true) && !!username;

  useEffect(() => {
    if (!enabled || !username) return;

    setIsLoading(true);
    setError(null);

    getReviewsByUser({ username })
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
  }, [enabled, username]);

  const refetch = async () => {
    if (!enabled || !username) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getReviewsByUser({ username });
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
