import type { CurrentUser } from '@/types/generated/types.gen';

export interface RouterContextProvider {
  user: CurrentUser;

  nonce: string;
}

export interface RootLoaderData {
  user: CurrentUser;
}
