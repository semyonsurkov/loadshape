import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton, Spinner } from 'loadshape';
import { PLACEHOLDERS, loadPosts, type Scenario } from './api/posts';
import { PostCard } from './PostCard';
import styles from './styles.module.css';

export function App() {
  const [scenario, setScenario] = useState<Scenario>('success');
  const enabled = scenario !== 'disabled';
  const query = useQuery({
    queryKey: ['posts', scenario],
    queryFn: ({ signal }) => loadPosts(scenario, signal),
    enabled,
    placeholderData: enabled ? PLACEHOLDERS : undefined,
    retry: false,
  });
  const loading = enabled && query.isPlaceholderData;

  return (
    <main className={styles.page}>
      <h1>loadshape + TanStack Query</h1>
      <p>Choose a response, then refresh to see cached content stay visible.</p>
      <div className={styles.controls}>
        <label>
          Response{' '}
          <select
            value={scenario}
            onChange={(event) => setScenario(event.target.value as Scenario)}
          >
            <option value="success">Posts</option>
            <option value="empty">Empty</option>
            <option value="error">Error</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>
        <button
          type="button"
          disabled={!enabled || query.isFetching}
          onClick={() => void query.refetch()}
        >
          Refresh
        </button>
        <span role="status">
          {query.isFetching && !loading ? (
            <>
              <Spinner /> Refreshing
            </>
          ) : (
            ''
          )}
        </span>
      </div>
      {enabled && query.isRefetchError && (
        <p role="alert">Refresh failed. Showing the previous data.</p>
      )}
      {!enabled ? (
        <p>Choose a response to start the request.</p>
      ) : query.isError && !query.data ? (
        <p role="alert">{query.error.message} Try refreshing.</p>
      ) : query.data?.length === 0 ? (
        <p>No posts found.</p>
      ) : query.data ? (
        <section aria-busy={loading || undefined}>
          <Skeleton.Root loading={loading} render={<ul className={styles.list} />}>
            {query.data.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </Skeleton.Root>
        </section>
      ) : null}
    </main>
  );
}
