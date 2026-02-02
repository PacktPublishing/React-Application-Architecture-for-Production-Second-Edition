import { useEffect, useState } from 'react';

import * as api from '@/lib/api';

export type GetTagsResponse = {
  data: string[];
};

export async function getTags(): Promise<GetTagsResponse> {
  return api.getTags();
}

export function useTagsQuery({
  options,
}: {
  options?: {
    enabled?: boolean;
    initialData?: GetTagsResponse;
  };
} = {}) {
  const [data, setData] = useState<GetTagsResponse | undefined>(
    options?.initialData,
  );
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    getTags()
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
      const result = await getTags();
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
