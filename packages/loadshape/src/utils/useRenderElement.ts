import { IS_REACT_19 } from './reactVersion';
import {
  cloneElement,
  useMemo,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefCallback,
} from 'react';

export type ElementProps = Record<string, unknown> & {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  ref?: Ref<unknown>;
};

export type RenderElement = ReactElement<ElementProps>;

const EVENT_HANDLER = /^on[A-Z]/;

/**
 * Слитый ref возвращает общую очистку: колбэк-ref в React 19 может вернуть свою очистку, и без
 * этого подписка из него (например, observer.disconnect) копилась бы с каждым рендером.
 */
function mergeRefs(refs: Array<Ref<unknown> | undefined>): RefCallback<unknown> {
  let cleanups: Array<() => void> = [];
  const cleanup = () => {
    const pending = cleanups;
    cleanups = [];
    for (const dispose of pending) dispose();
  };

  return (node) => {
    cleanup();
    if (node === null) return;

    cleanups = refs.flatMap((ref) => {
      if (typeof ref === 'function') {
        const dispose = ref(node);
        return [typeof dispose === 'function' ? dispose : () => ref(null)];
      }
      if (ref) {
        // @types/react 18 объявляет current у RefObject только для чтения, хотя React пишет его.
        const objectRef = ref as { current: unknown };
        objectRef.current = node;
        return [
          () => {
            objectRef.current = null;
          },
        ];
      }
      return [];
    });
    // React 18 calls ref(null); React 19 can invoke the returned cleanup instead.
    if (IS_REACT_19) return cleanup;
  };
}

function mergeHandlers(own: unknown, passed: unknown): unknown {
  if (typeof own !== 'function' || typeof passed !== 'function') {
    return passed ?? own;
  }
  return (...args: unknown[]) => {
    own(...args);
    passed(...args);
  };
}

/**
 * Рисует элемент из пропа render с пропами компонента, как render у Base UI: className и style
 * объединяются, обработчики событий вызываются оба, ref сливаются, остальные пропы компонента
 * перебивают пропы элемента. Атрибуты состояния передаются последними и перебивают всё: проект
 * не должен случайно снять data-skeleton или inert, передав свой атрибут с тем же именем.
 */
export function useRenderElement(
  element: RenderElement,
  props: ElementProps,
  state: ElementProps = {},
  internalRef?: Ref<unknown>,
): ReactElement {
  const own = element.props;
  const merged: ElementProps = { ...props };

  for (const key of Object.keys(props)) {
    if (EVENT_HANDLER.test(key)) {
      merged[key] = mergeHandlers(own[key], props[key]);
    }
  }

  const className = [own.className, props.className].filter(Boolean).join(' ');
  // Reading props.ref warns in React 18; reading element.ref warns in React 19.
  const ownRef = IS_REACT_19 ? own.ref : (element as unknown as { ref?: Ref<unknown> }).ref;
  const ref = useMemo(
    () =>
      ownRef || props.ref || internalRef ? mergeRefs([ownRef, props.ref, internalRef]) : undefined,
    [ownRef, props.ref, internalRef],
  );

  return cloneElement(element, {
    ...merged,
    ...state,
    className: className || undefined,
    style: own.style || props.style ? { ...own.style, ...props.style } : undefined,
    ref,
    children: state.children ?? props.children ?? own.children,
  });
}
