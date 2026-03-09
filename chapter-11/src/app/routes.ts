import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./routes/layout.tsx', [
    index('routes/home.tsx'),
    route('about', './routes/about.tsx'),
    route('auth/register', './routes/auth/register.tsx'),
    route('auth/login', './routes/auth/login.tsx'),
    ...prefix('dashboard', [
      layout('./routes/dashboard/layout.tsx', [
        index('./routes/dashboard/dashboard.tsx'),
        ...prefix('ideas', [
          index('./routes/dashboard/ideas/ideas.tsx'),
          route('new', './routes/dashboard/ideas/new.tsx'),
          route(':id/edit', './routes/dashboard/ideas/edit.tsx'),
        ]),
        route('reviews', './routes/dashboard/reviews.tsx'),
      ]),
    ]),
    route('profile/:username', './routes/profile.tsx'),
    route('ideas/:id', './routes/ideas/idea.tsx'),
    route('ideas', './routes/ideas/ideas.tsx'),
    route('*', './routes/not-found.tsx'),
  ]),
  route('api/locales/:lng/:ns', './routes/api/locales.ts'),
  route('api/set-language', './routes/api/set-language.ts'),
] satisfies RouteConfig;
