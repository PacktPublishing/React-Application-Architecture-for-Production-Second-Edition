import { useEffect, useState } from 'react';

import * as api from '@/lib/api';
import type { Idea } from '@/types/data';

export async function getIdeaById(id: string): Promise<Idea> {
  return api.getIdeaById(id);
}

export function useIdeaByIdQuery({
  id,
  options,
}: {
  id: string;
  options?: {
    enabled?: boolean;
    initialData?: Idea;
  };
}) {
  const [data, setData] = useState<Idea | undefined>(options?.initialData);
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = (options?.enabled ?? true) && !!id;

  useEffect(() => {
    if (!enabled || !id) return;

    setIsLoading(true);
    setError(null);

    getIdeaById(id)
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
      const result = await getIdeaById(id);
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
