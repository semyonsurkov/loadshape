import { createFileRoute } from '@tanstack/react-router';
import { PageStand } from '../../pages/PageStand';

export const Route = createFileRoute('/stands/page')({
  component: PageStand,
});
