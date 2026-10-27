import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { RouteProgress } from './RouteProgress';

test('marks a pending transition and hides the bar from assistive technology', () => {
  render(<RouteProgress pending data-testid="progress" />);

  const progress = screen.getByTestId('progress');

  expect(progress.tagName).toBe('DIV');
  expect(progress).toHaveAttribute('data-route-progress', 'pending');
  expect(progress).toHaveAttribute('aria-hidden', 'true');
});

test('keeps the marker on an idle transition', () => {
  render(<RouteProgress pending={false} data-testid="progress" />);

  expect(screen.getByTestId('progress')).toHaveAttribute('data-route-progress', '');
});

test('renders a custom element and forwards the ref', () => {
  const ref = createRef<HTMLElement>();

  render(
    <RouteProgress
      ref={ref}
      pending={false}
      render={<span className="bar" />}
      data-testid="progress"
    />,
  );

  const progress = screen.getByTestId('progress');

  expect(progress.tagName).toBe('SPAN');
  expect(progress).toHaveClass('bar');
  expect(ref.current).toBe(progress);
});
