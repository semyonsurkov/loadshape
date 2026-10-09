import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Agentation } from 'agentation';
import { RouteProgressBar } from '../shared/ui/RouteProgressBar';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <RouteProgressBar />
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
