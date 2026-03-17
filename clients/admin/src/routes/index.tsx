import { Navigate, createFileRoute } from '@tanstack/react-router';
import { getMenuEntryPath } from '@/components/Layout/getNavMenu';

export const Route = createFileRoute('/')({
  component: () => <Navigate to={getMenuEntryPath('business')} replace />,
});
