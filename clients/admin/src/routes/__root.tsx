import { Outlet, createRootRoute } from '@tanstack/react-router';
import NotFoundPage from '@/routes/-404';

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
});
