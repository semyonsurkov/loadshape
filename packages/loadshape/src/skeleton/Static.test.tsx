import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { Static } from './Static';

test('marks its contents as static and keeps them out of the skeleton', () => {
  render(<Static>Known</Static>);

  const contents = screen.getByText('Known');

  expect(contents.tagName).toBe('SPAN');
  expect(contents).toHaveAttribute('data-skeleton-contents');
  expect(contents).toHaveAttribute('data-skeleton-static');
});

test('renders a custom element, merges props and forwards the ref', () => {
  const ref = createRef<HTMLElement>();

  render(
    <Static ref={ref} render={<h2 className="title" />} id="heading">
      Static
    </Static>,
  );

  const heading = screen.getByRole('heading', { name: 'Static' });

  expect(heading.tagName).toBe('H2');
  expect(heading).toHaveClass('title');
  expect(heading).toHaveAttribute('id', 'heading');
  expect(heading).toHaveAttribute('data-skeleton-static');
  expect(ref.current).toBe(heading);
});
