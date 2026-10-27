import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { Root } from './skeleton/Root';
import { Static } from './skeleton/Static';
import './styles.css';

/*
 * WebKit переключает неоформленную кнопку на запасную отрисовку, когда заглушка меняет ей фон,
 * и её высота расходится с загруженным состоянием. Это описано в styles.css; для проверки
 * геометрии кнопка должна быть оформлена как в проекте.
 */
const BUTTON_STYLE: CSSProperties = {
  padding: '8px 16px',
  border: 0,
  background: 'black',
  color: 'white',
};

const CONTENT_INSET = 32;

test('blocks focus while loading and releases it after load', () => {
  const view = render(
    <Root loading>
      <button type="button" style={BUTTON_STYLE}>
        Action
      </button>
    </Root>,
  );
  const button = screen.getByRole('button', { name: 'Action' });

  button.focus();
  expect(document.activeElement).not.toBe(button);

  view.rerender(
    <Root loading={false}>
      <button type="button" style={BUTTON_STYLE}>
        Action
      </button>
    </Root>,
  );

  button.focus();
  expect(document.activeElement).toBe(button);
});

test.each([375, 768, 1440])('keeps content geometry at %ipx', async (width) => {
  await page.viewport(width, 900);
  await document.fonts.ready;

  const contentWidth = width - CONTENT_INSET;

  const content = (
    <Root loading data-testid="root">
      <h2>Heading</h2>
      <p>Text long enough to wrap onto several lines inside the measured container.</p>
      <Static>Known label</Static>
      <button type="button" style={BUTTON_STYLE}>
        Action
      </button>
    </Root>
  );

  const view = render(<div style={{ width: contentWidth }}>{content}</div>);

  expect(screen.getByTestId('root').getBoundingClientRect().width).toBeCloseTo(contentWidth, 0);

  const measure = () => {
    const root = screen.getByTestId('root');

    return Array.from(root.children).map((child) => {
      const rect = child.getBoundingClientRect();

      return {
        tag: child.tagName,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    });
  };

  const before = measure();
  view.rerender(
    <div style={{ width: contentWidth }}>
      <Root loading={false} data-testid="root">
        <h2>Heading</h2>
        <p>Text long enough to wrap onto several lines inside the measured container.</p>
        <Static>Known label</Static>
        <button type="button" style={BUTTON_STYLE}>
          Action
        </button>
      </Root>
    </div>,
  );
  const after = measure();

  expect(after).toEqual(before);

  const root = screen.getByTestId('root');

  expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
});

test('keeps static text visible while the skeleton hides dynamic text', () => {
  render(
    <Root loading>
      <Static data-testid="static">Known</Static>
      <p data-testid="dynamic">Dynamic</p>
    </Root>,
  );

  const staticColor = getComputedStyle(screen.getByTestId('static')).webkitTextFillColor;
  const dynamicColor = getComputedStyle(screen.getByTestId('dynamic')).webkitTextFillColor;

  expect(staticColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(dynamicColor).toBe('rgba(0, 0, 0, 0)');
});
