import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, StrictMode, version } from 'react';
import { expect, test, vi } from 'vitest';
import { Root } from './Root';

const REACT_MAJOR = Number.parseInt(version, 10);

test('renders a div with children and project props when loaded', () => {
  render(
    <Root loading={false} id="content" className="card">
      <p>Ready</p>
    </Root>,
  );

  const root = screen.getByText('Ready').parentElement;

  expect(root?.tagName).toBe('DIV');
  expect(root).toHaveAttribute('id', 'content');
  expect(root).toHaveClass('card');
  expect(root).not.toHaveAttribute('data-skeleton');
  expect(root).not.toHaveAttribute('inert');
});

test('marks the root as loading and inert', () => {
  render(
    <Root loading data-testid="root">
      <p>Loading</p>
    </Root>,
  );

  const root = screen.getByTestId('root');

  expect(root).toHaveAttribute('data-skeleton', 'loading');
  expect(root).toHaveAttribute('inert');
  expect(root).not.toHaveAttribute('aria-busy');
});

test('merges className, style and event handlers with the render element', async () => {
  const user = userEvent.setup();
  const renderClick = vi.fn();
  const rootClick = vi.fn();

  render(
    <Root
      loading={false}
      render={
        <section
          className="layout"
          style={{ padding: 8 }}
          onClick={renderClick}
          data-testid="root"
        />
      }
      className="card"
      style={{ margin: 4 }}
      onClick={rootClick}
    />,
  );

  const root = screen.getByTestId('root');

  expect(root).toHaveClass('layout', 'card');
  expect(root).toHaveStyle({ padding: '8px', margin: '4px' });

  await user.click(root);

  expect(renderClick).toHaveBeenCalledOnce();
  expect(rootClick).toHaveBeenCalledOnce();
});

test('state attributes override project props', () => {
  render(<Root loading data-skeleton="project" data-testid="root" />);

  expect(screen.getByTestId('root')).toHaveAttribute('data-skeleton', 'loading');
});

test('forwards the root ref and the ref of the render element to the same node', () => {
  const rootRef = createRef<HTMLElement>();
  const elementRef = createRef<HTMLUListElement>();

  render(<Root loading={false} ref={rootRef} render={<ul ref={elementRef} />} />);

  expect(rootRef.current).toBeInstanceOf(HTMLUListElement);
  expect(elementRef.current).toBe(rootRef.current);
});

test('releases callback refs of the root and render element on unmount', () => {
  const rootCalls: Array<HTMLElement | null> = [];
  const elementCalls: Array<HTMLElement | null> = [];

  const view = render(
    <Root
      loading={false}
      ref={(node) => {
        rootCalls.push(node);
      }}
      render={
        <div
          ref={(node) => {
            elementCalls.push(node);
          }}
          data-testid="root"
        />
      }
    />,
  );

  const root = screen.getByTestId('root');

  expect(rootCalls).toEqual([root]);
  expect(elementCalls).toEqual([root]);

  view.unmount();

  expect(rootCalls).toEqual([root, null]);
  expect(elementCalls).toEqual([root, null]);
});

test.runIf(REACT_MAJOR >= 19)(
  'runs the cleanup returned by the callback ref of the render element',
  () => {
    const cleanup = vi.fn();

    const view = render(
      <Root
        loading={false}
        ref={() => {}}
        render={
          <div
            ref={(node) => {
              if (node) {
                return cleanup;
              }
            }}
            data-testid="root"
          />
        }
      />,
    );

    expect(cleanup).not.toHaveBeenCalled();

    view.unmount();

    expect(cleanup).toHaveBeenCalledOnce();
  },
);

test('keeps refs attached through StrictMode remounts', () => {
  const rootRef = createRef<HTMLElement>();
  const elementRef = createRef<HTMLDivElement>();

  const view = render(
    <StrictMode>
      <Root loading={false} ref={rootRef} render={<div ref={elementRef} />} />
    </StrictMode>,
  );

  const root = view.container.querySelector('div');

  expect(rootRef.current).toBe(root);
  expect(elementRef.current).toBe(root);

  view.unmount();

  expect(rootRef.current).toBeNull();
  expect(elementRef.current).toBeNull();
});

test('removes the loading state when loading ends', () => {
  const { rerender } = render(
    <Root loading data-testid="root">
      <p>Item</p>
    </Root>,
  );
  const root = screen.getByTestId('root');

  expect(root).toHaveAttribute('inert');
  expect(root).toHaveAttribute('data-skeleton', 'loading');

  rerender(
    <Root loading={false} data-testid="root">
      <p>Item</p>
    </Root>,
  );

  expect(root).not.toHaveAttribute('inert');
  expect(root).not.toHaveAttribute('data-skeleton');
});
