import { useEffect, useState } from 'react';

import * as api from '@/lib/api';
import type { Review } from '@/types/data';

export type GetReviewsByIdeaResponse = {
  data: Review[];
};

export async function getReviewsByIdea({
  id,
}: {
  id: string;
}): Promise<GetReviewsByIdeaResponse> {
  return api.getReviewsByIdea({ id });
}

export function useReviewsByIdeaQuery({
  id,
  options,
}: {
  id: string;
  options?: {
    enabled?: boolean;
    initialData?: GetReviewsByIdeaResponse;
  };
}) {
  const [data, setData] = useState<GetReviewsByIdeaResponse | undefined>(
    options?.initialData,
  );
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = (options?.enabled ?? true) && !!id;

  useEffect(() => {
    if (!enabled || !id) return;

    setIsLoading(true);
    setError(null);

    getReviewsByIdea({ id })
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
  }, [enabled, id]);

  const refetch = async () => {
    if (!enabled || !id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getReviewsByIdea({ id });
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
