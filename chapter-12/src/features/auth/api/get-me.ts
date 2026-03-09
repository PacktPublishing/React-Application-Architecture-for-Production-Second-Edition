import { api } from '@/lib/api';
import type { GetCurrentUserResponse } from '@/types/generated/types.gen';
import { zGetCurrentUserResponse } from '@/types/generated/zod.gen';

export async function getMe(
  cookieHeader?: string,
): Promise<GetCurrentUserResponse> {
  const response = await api.get<GetCurrentUserResponse>('/auth/me', {
    headers: {
      Cookie: cookieHeader ?? '',
    },
  });

  return zGetCurrentUserResponse.parse(response);
}
