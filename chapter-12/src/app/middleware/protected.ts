import { redirect, type MiddlewareFunction } from 'react-router';

import { userContext } from './user';

export const protectedMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  let user = null;

  try {
    user = context.get(userContext);
  } catch {}

  if (!user) {
    throw redirect('/auth/login');
  }

  return next();
};
