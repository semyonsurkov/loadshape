const ANIMATION_STATE = '--_skeleton_animation_state';

type ObservedDocument = {
  observer: IntersectionObserver;
  targets: Map<HTMLElement, number>;
};

const documents = new WeakMap<Document, ObservedDocument>();

export function observeVisibility(node: HTMLElement): (() => void) | undefined {
  const document = node.ownerDocument;
  const Observer = document.defaultView?.IntersectionObserver;
  if (!Observer) return;

  let group = documents.get(document);
  if (!group) {
    const targets = new Map<HTMLElement, number>();
    const observer = new Observer((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        if (!targets.has(target)) continue;
        // У display: contents нет бокса для наблюдения, хотя его дети могут быть видимы.
        const noBox = entry.boundingClientRect.width === 0 && entry.boundingClientRect.height === 0;
        target.style.setProperty(
          ANIMATION_STATE,
          entry.isIntersecting || noBox ? 'running' : 'paused',
        );
      }
    });
    group = { observer, targets };
    documents.set(document, group);
  }

  const { observer, targets } = group;
  const subscribers = targets.get(node) ?? 0;
  targets.set(node, subscribers + 1);
  if (subscribers === 0) observer.observe(node);

  let subscribed = true;
  return () => {
    if (!subscribed) return;
    subscribed = false;
    const remaining = (targets.get(node) ?? 1) - 1;
    if (remaining > 0) {
      targets.set(node, remaining);
      return;
    }
    observer.unobserve(node);
    targets.delete(node);
    node.style.removeProperty(ANIMATION_STATE);
    if (targets.size === 0) {
      observer.disconnect();
      documents.delete(document);
    }
  };
}
