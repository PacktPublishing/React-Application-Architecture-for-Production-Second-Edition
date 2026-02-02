import { useEffect, useState } from 'react';

import * as api from '@/lib/api';
import type { Idea, Pagination } from '@/types/data';

export type GetIdeasParams = {
  page?: string;
  limit?: string;
  search?: string;
  tags?: string;
};

export type GetIdeasResponse = {
  data: Idea[];
  pagination: Pagination;
};

export async function getIdeas(
  params?: GetIdeasParams,
): Promise<GetIdeasResponse> {
  return api.getIdeas(params);
}

export function useIdeasQuery({
  params,
  options,
}: {
  params?: GetIdeasParams;
  options?: {
    enabled?: boolean;
    initialData?: GetIdeasResponse;
  };
} = {}) {
  const [data, setData] = useState<GetIdeasResponse | undefined>(
    options?.initialData,
  );
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    getIdeas(params)
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
  }, [enabled, params]);

  const refetch = async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getIdeas(params);
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
