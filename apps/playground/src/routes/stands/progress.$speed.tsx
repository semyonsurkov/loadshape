import { createFileRoute, notFound } from '@tanstack/react-router';
import { loadPage, SLOW_LOAD_MS } from '../../pages/ProgressStand/api/loadPage';

// Стенд сохраняет предыдущую страницу до конца искусственной задержки.
const PENDING_UI_DELAY_MS = SLOW_LOAD_MS * 2;

export const Route = createFileRoute('/stands/progress/$speed')({
  loaderDeps: ({ search }) => ({ run: search.run }),
  loader: ({ params, abortController }) => {
    if (params.speed !== 'fast' && params.speed !== 'slow') {
      throw notFound();
    }
    return loadPage(params.speed, abortController.signal);
  },
  pendingMs: PENDING_UI_DELAY_MS,
  staleTime: 0,
  component: DestinationPage,
});

function DestinationPage() {
  const page = Route.useLoaderData();
  return (
    <>
      <h2>{page.title}</h2>
      <p>
        Переход за {page.duration} мс завершён. Его можно повторить или вернуться на начальную
        страницу.
      </p>
    </>
  );
}
