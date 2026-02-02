import { useEffect, useState } from 'react';

import * as api from '@/lib/api';
import type { Idea } from '@/types/data';

export type GetIdeasByUserResponse = {
  data: Idea[];
};

export async function getIdeasByUser({
  username,
}: {
  username: string;
}): Promise<GetIdeasByUserResponse> {
  return api.getIdeasByUser({ username });
}

export function useIdeasByUserQuery({
  username,
  options,
}: {
  username: string | undefined;
  options?: {
    enabled?: boolean;
    initialData?: GetIdeasByUserResponse;
  };
}) {
  const [data, setData] = useState<GetIdeasByUserResponse | undefined>(
    options?.initialData,
  );
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = (options?.enabled ?? true) && !!username;

  useEffect(() => {
    if (!enabled || !username) return;

    setIsLoading(true);
    setError(null);

    getIdeasByUser({ username })
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
      const result = await getIdeasByUser({ username });
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
