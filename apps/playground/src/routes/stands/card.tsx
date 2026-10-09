import { createFileRoute } from '@tanstack/react-router';
import { CardStand } from '../../pages/CardStand';

export const Route = createFileRoute('/stands/card')({
  component: CardStand,
});
