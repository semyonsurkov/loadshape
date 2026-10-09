import { createFileRoute } from '@tanstack/react-router';
import { ListStand } from '../../pages/ListStand';

export const Route = createFileRoute('/stands/list')({
  component: ListStand,
});
