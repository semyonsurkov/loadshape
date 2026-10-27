import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { Spinner } from './Spinner';

test('is decorative when there is no label', () => {
  render(<Spinner data-testid="spinner" />);

  const spinner = screen.getByTestId('spinner');

  expect(spinner.tagName).toBe('SPAN');
  expect(spinner).toHaveAttribute('data-spinner');
  expect(spinner).toHaveAttribute('aria-hidden', 'true');
  expect(spinner).not.toHaveAttribute('role');
  expect(spinner).toBeEmptyDOMElement();
});

test('becomes a status with visually hidden text when labeled', () => {
  render(<Spinner label="Saving" />);

  const status = screen.getByRole('status');
  const label = screen.getByText('Saving');

  expect(status).toHaveAttribute('data-spinner');
  expect(status).not.toHaveAttribute('aria-hidden');
  expect(label.tagName).toBe('SPAN');
  expect(label).toHaveAttribute('data-spinner-label');
});

test('state attributes override project props', () => {
  render(<Spinner aria-hidden={false} data-testid="spinner" />);

  expect(screen.getByTestId('spinner')).toHaveAttribute('aria-hidden', 'true');
});

test('renders a custom element and forwards the ref', () => {
  const ref = createRef<HTMLElement>();

  render(
    <Spinner ref={ref} label="Loading" render={<i className="ring" />} data-testid="spinner" />,
  );

  const spinner = screen.getByTestId('spinner');

  expect(spinner.tagName).toBe('I');
  expect(spinner).toHaveClass('ring');
  expect(ref.current).toBe(spinner);
});
