import {
  cloneElement,
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
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        return typeof cleanup === 'function' ? cleanup : () => ref(null);
      }
      if (ref) {
        ref.current = node;
        return () => {
          ref.current = null;
        };
      }
      return undefined;
    });
    return () => {
      for (const cleanup of cleanups) {
        cleanup?.();
      }
    };
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
export function renderElement(
  element: RenderElement,
  props: ElementProps,
  state: ElementProps = {},
): ReactElement {
  const own = element.props;
  const merged: ElementProps = { ...props };

  for (const key of Object.keys(props)) {
    if (EVENT_HANDLER.test(key)) {
      merged[key] = mergeHandlers(own[key], props[key]);
    }
  }

  const className = [own.className, props.className].filter(Boolean).join(' ');
  const hasRefs = own.ref !== undefined && props.ref !== undefined;

  return cloneElement(element, {
    ...merged,
    ...state,
    className: className || undefined,
    style: own.style || props.style ? { ...own.style, ...props.style } : undefined,
    ref: hasRefs ? mergeRefs([own.ref, props.ref]) : (props.ref ?? own.ref),
    children: state.children ?? props.children ?? own.children,
  });
}
