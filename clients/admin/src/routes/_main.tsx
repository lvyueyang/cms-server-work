import { createFileRoute, redirect } from '@tanstack/react-router';
import MainLayout from '@/layouts/main';
import { getAuthToken } from '@/router/auth';

export const Route = createFileRoute('/_main')({
  beforeLoad: ({ location }) => {
    if (!getAuthToken()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: MainLayout,
});
