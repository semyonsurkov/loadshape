import { createFileRoute } from '@tanstack/react-router';
import { ProgressStand } from '../../pages/ProgressStand';

export const Route = createFileRoute('/stands/progress')({
  validateSearch: (search: Record<string, unknown>): { run: number } => ({
    run: typeof search.run === 'number' && Number.isSafeInteger(search.run) ? search.run : 0,
  }),
  component: ProgressStand,
});
