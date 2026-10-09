export const FAST_LOAD_MS = 100;
export const SLOW_LOAD_MS = 1200;

export type PageLoad = { title: string; duration: number };

export async function loadPage(speed: string, signal: AbortSignal): Promise<PageLoad> {
  const duration = speed === 'fast' ? FAST_LOAD_MS : SLOW_LOAD_MS;
  await waitForPage(duration, signal);
  return {
    title: speed === 'fast' ? 'Быстрая страница' : 'Медленная страница',
    duration,
  };
}

function waitForPage(duration: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const timer = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, duration);

    function handleAbort() {
      window.clearTimeout(timer);
      reject(signal.reason);
    }

    signal.addEventListener('abort', handleAbort, { once: true });
  });
}
