import {
  mutationOptions,
  useMutation,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  CreateIdeaData,
  CreateIdeaResponse,
} from '@/types/generated/types.gen';
import {
  zCreateIdeaData,
  zCreateIdeaResponse,
} from '@/types/generated/zod.gen';

export async function createIdea(
  data: CreateIdeaData['body'],
): Promise<CreateIdeaResponse> {
  const validatedData = zCreateIdeaData.parse({ body: data });

  const response = await api.post<CreateIdeaResponse>(
    '/ideas',
    validatedData.body,
  );

  return zCreateIdeaResponse.parse(response);
}

export function getCreateIdeaMutationOptions() {
  return mutationOptions({
    mutationFn: createIdea,
  });
}

export function useCreateIdeaMutation({
  options,
}: {
  options?: Omit<
    UseMutationOptions<CreateIdeaResponse, Error, CreateIdeaData['body']>,
    'mutationFn'
  >;
}) {
  return useMutation({
    ...getCreateIdeaMutationOptions(),
    ...options,
  });
}
