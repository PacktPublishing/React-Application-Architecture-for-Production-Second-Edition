import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { GetIdeasByUserResponse } from '@/types/generated/types.gen';
import {
  zGetIdeasByUserData,
  zGetIdeasByUserResponse,
} from '@/types/generated/zod.gen';

import { ideasQueryKeys } from '../config/query-keys';

export async function getIdeasByUser({
  username,
}: {
  username: string;
}): Promise<GetIdeasByUserResponse> {
  const validatedData = zGetIdeasByUserData.parse({
    path: { username },
  });

  const response = await api.get<GetIdeasByUserResponse>(
    `/ideas/user/${validatedData.path.username}`,
  );

  return zGetIdeasByUserResponse.parse(response);
}

export function getIdeasByUserQueryOptions({
  username = '',
}: {
  username: string | undefined;
}) {
  return queryOptions({
    queryKey: ideasQueryKeys.byUser(username),
    queryFn: () => getIdeasByUser({ username }),
    enabled: !!username,
  });
}

export function useIdeasByUserQuery({
  username,
  options,
}: {
  username: string | undefined;
  options?: Omit<
    ReturnType<typeof getIdeasByUserQueryOptions>,
    'queryKey' | 'queryFn' | 'enabled'
  >;
}) {
  return useQuery({
    ...getIdeasByUserQueryOptions({ username }),
    ...options,
  });
}
