import { createFileRoute } from '@tanstack/react-router';
import { EdgesStand } from '../../pages/EdgesStand';

export const Route = createFileRoute('/stands/edges')({
  component: EdgesStand,
});
