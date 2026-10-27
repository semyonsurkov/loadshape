import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import { Root } from './skeleton/Root';
import { Spinner } from './spinner/Spinner';

test('hydrates server markup without warnings or attribute mismatches', async () => {
  const content = (
    <Root loading data-testid="root">
      <p>Title</p>
      <Spinner label="Loading" />
    </Root>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(content);
  document.body.append(container);

  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const root = hydrateRoot(container, content);

  await act(async () => {});

  expect(consoleError).not.toHaveBeenCalled();
  expect(container.querySelector('[data-testid="root"]')).toHaveAttribute('inert');

  await act(async () => {
    root.unmount();
  });
  container.remove();
});
