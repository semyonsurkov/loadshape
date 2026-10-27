import { renderToString } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import { Root } from './skeleton/Root';
import { Static } from './skeleton/Static';
import { Spinner } from './spinner/Spinner';
import { RouteProgress } from './route-progress/RouteProgress';

test('serializes the loading tree without warnings', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  const html = renderToString(
    <Root loading id="app">
      <Static>Known</Static>
      <p>Dynamic</p>
      <Spinner label="Saving" />
      <RouteProgress pending />
    </Root>,
  );

  expect(html).toContain('inert=""');
  expect(html).toContain('data-skeleton="loading"');
  expect(html).toContain('data-skeleton-contents=""');
  expect(html).toContain('data-skeleton-static=""');
  expect(html).toContain('role="status"');
  expect(html).toContain('data-spinner-label=""');
  expect(html).toContain('data-route-progress="pending"');
  expect(consoleError).not.toHaveBeenCalled();
});

test('serializes a loaded root without loading attributes', () => {
  const html = renderToString(
    <Root loading={false}>
      <p>Ready</p>
    </Root>,
  );

  expect(html).not.toContain('inert');
  expect(html).not.toContain('data-skeleton');
});

test('serializes custom render elements with project props', () => {
  const html = renderToString(
    <Root loading={false} render={<section className="layout" />} id="app" />,
  );

  expect(html).toContain('<section');
  expect(html).toContain('class="layout"');
  expect(html).toContain('id="app"');
});

test('serializes a decorative spinner and an idle progress marker', () => {
  const html = renderToString(
    <div>
      <Spinner />
      <RouteProgress pending={false} />
    </div>,
  );

  expect(html).toContain('data-spinner=""');
  expect(html).toContain('aria-hidden="true"');
  expect(html).not.toContain('role="status"');
  expect(html).toContain('data-route-progress=""');
});
