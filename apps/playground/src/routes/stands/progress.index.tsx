import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stands/progress/')({
  component: InitialPage,
});

function InitialPage() {
  return (
    <>
      <h2>Начальная страница</h2>
      <p>Выбери переход. Во время загрузки эта страница остаётся на месте.</p>
    </>
  );
}
