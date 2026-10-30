export type Post = { id: string; title: string; summary: string };
export type Scenario = 'success' | 'empty' | 'error' | 'disabled';

const DELAY_MS = 1200;
const POSTS: Post[] = [
  {
    id: '1',
    title: 'Keep the layout in place',
    summary: 'Render the actual card while its data loads.',
  },
  {
    id: '2',
    title: 'Preserve cached content',
    summary: 'A refresh keeps the existing cards visible.',
  },
];
export const PLACEHOLDERS: Post[] = [
  {
    id: 'placeholder-1',
    title: 'A representative card title',
    summary: 'A summary with a typical length.',
  },
  {
    id: 'placeholder-2',
    title: 'Another representative title',
    summary: 'A second summary of realistic length.',
  },
];

export function loadPosts(scenario: Scenario, signal: AbortSignal): Promise<Post[]> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      if (scenario === 'error') reject(new Error('The example request failed.'));
      else resolve(scenario === 'empty' ? [] : POSTS);
    }, DELAY_MS);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer);
        reject(new DOMException('Request cancelled', 'AbortError'));
      },
      { once: true },
    );
  });
}
