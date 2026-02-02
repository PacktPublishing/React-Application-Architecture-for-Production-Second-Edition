import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('components', 'routes/components.tsx'),
] satisfies RouteConfig;
