import {
  Link,
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import { RouteProgress } from './tanstack-router';

function RootLayout() {
  return (
    <>
      <RouteProgress data-testid="progress" />
      <Link to="/slow">Slow</Link>
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <p>Home</p>,
});

let releaseLoader: (() => void) | undefined;

const slowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/slow',
  loader: () =>
    new Promise<void>((resolve) => {
      releaseLoader = resolve;
    }),
  component: () => <p>Slow page</p>,
});

const routeTree = rootRoute.addChildren([indexRoute, slowRoute]);

function setup() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
    defaultPreload: false,
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
  });

  render(<RouterProvider router={router} />);
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

test('shows progress while a route loader is pending', async () => {
  const user = userEvent.setup();
  setup();

  await screen.findByText('Home');

  expect(screen.getByTestId('progress')).toHaveAttribute('data-route-progress', '');

  await user.click(screen.getByRole('link', { name: 'Slow' }));

  await waitFor(() => {
    expect(screen.getByTestId('progress')).toHaveAttribute('data-route-progress', 'pending');
  });

  expect(releaseLoader).toBeTypeOf('function');
  releaseLoader?.();

  await screen.findByText('Slow page');

  await waitFor(() => {
    expect(screen.getByTestId('progress')).toHaveAttribute('data-route-progress', '');
  });
});
