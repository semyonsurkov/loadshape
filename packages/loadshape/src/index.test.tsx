import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { RouteProgress, Skeleton, Spinner } from './index';

test('exports the public components from the package entry point', () => {
  render(
    <Skeleton.Root loading>
      <Skeleton.Static>Known</Skeleton.Static>
      <Spinner label="Loading" />
    </Skeleton.Root>,
  );

  expect(screen.getByText('Known')).toBeInTheDocument();
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByText('Loading')).toBeInTheDocument();

  render(<RouteProgress pending data-testid="progress" />);

  expect(screen.getByTestId('progress')).toHaveAttribute('data-route-progress', 'pending');
});
