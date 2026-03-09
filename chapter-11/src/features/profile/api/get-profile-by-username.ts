import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { GetUserByUsernameResponse } from '@/types/generated/types.gen';
import {
  zGetUserByUsernameData,
  zGetUserByUsernameResponse,
} from '@/types/generated/zod.gen';

import { profileQueryKeys } from '../config/query-keys';

export async function getProfileByUsername(
  username: string,
): Promise<GetUserByUsernameResponse> {
  const validatedData = zGetUserByUsernameData.parse({ path: { username } });

  const response = await api.get<GetUserByUsernameResponse>(
    `/profile/${validatedData.path.username}`,
  );

  return zGetUserByUsernameResponse.parse(response);
}

export function getProfileByUsernameQueryOptions(username: string) {
  return queryOptions({
    queryKey: profileQueryKeys.byUsername(username),
    queryFn: () => getProfileByUsername(username),
  });
}

export function useProfileByUsernameQuery({
  username,
  options,
}: {
  username: string;
  options?: Omit<
    ReturnType<typeof getProfileByUsernameQueryOptions>,
    'queryKey' | 'queryFn'
  >;
}) {
  return useQuery({
    ...getProfileByUsernameQueryOptions(username),
    ...options,
  });
}
