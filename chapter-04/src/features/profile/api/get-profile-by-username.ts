import { useEffect, useState } from 'react';

import * as api from '@/lib/api';
import type { User } from '@/types/data';

export async function getProfileByUsername(username: string): Promise<User> {
  return api.getProfileByUsername(username);
}

export function useProfileByUsernameQuery({
  username,
  options,
}: {
  username: string;
  options?: {
    enabled?: boolean;
    initialData?: User;
  };
}) {
  const [data, setData] = useState<User | undefined>(options?.initialData);
  const [isLoading, setIsLoading] = useState(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const enabled = (options?.enabled ?? true) && !!username;

  useEffect(() => {
    if (!enabled || !username) return;

    setIsLoading(true);
    setError(null);

    getProfileByUsername(username)
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
      const result = await getProfileByUsername(username);
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
