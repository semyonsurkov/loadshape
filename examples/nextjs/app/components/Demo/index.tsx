'use client';

import { useEffect, useRef, useState } from 'react';
import { Spinner } from 'loadshape';
import { PostList, type Post } from '../PostList';
import styles from './styles.module.css';

type Scenario = 'success' | 'empty' | 'error' | 'disabled';
type State = {
  scenario: Scenario;
  posts: Post[] | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

const PLACEHOLDERS: Post[] = [
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

export function Demo() {
  const [scenario, setScenario] = useState<Scenario>('success');
  const [request, setRequest] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);
  const [state, setState] = useState<State>({
    scenario: 'success',
    posts: null,
    loading: true,
    refreshing: false,
    error: null,
  });

  useEffect(() => {
    if (scenario === 'disabled') return;
    const controller = new AbortController();
    activeRequest.current = controller;
    async function load() {
      try {
        const response = await fetch(`/api/posts?scenario=${scenario}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('The example request failed.');
        const posts: Post[] = await response.json();
        if (controller.signal.aborted) return;
        setState({ scenario, posts, loading: false, refreshing: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState((previous) => ({
          ...previous,
          loading: false,
          refreshing: false,
          error: error instanceof Error ? error.message : 'The example request failed.',
        }));
      }
    }
    void load();
    return () => {
      controller.abort();
      if (activeRequest.current === controller) activeRequest.current = null;
    };
  }, [scenario, request]);

  function changeScenario(next: Scenario) {
    activeRequest.current?.abort();
    setScenario(next);
    setState({
      scenario: next,
      posts: null,
      loading: next !== 'disabled',
      refreshing: false,
      error: null,
    });
  }

  function refresh() {
    setState((previous) => ({
      ...previous,
      loading: previous.posts === null,
      refreshing: previous.posts !== null,
      error: null,
    }));
    setRequest((value) => value + 1);
  }

  const loading = scenario !== 'disabled' && (state.scenario !== scenario || state.loading);
  const posts = loading ? PLACEHOLDERS : state.posts;
  return (
    <main className={styles.page}>
      <h1>loadshape + Next.js</h1>
      <p>Choose an API response, then refresh to keep the existing cards visible.</p>
      <div className={styles.controls}>
        <label>
          Response{' '}
          <select
            value={scenario}
            onChange={(event) => changeScenario(event.target.value as Scenario)}
          >
            <option value="success">Posts</option>
            <option value="empty">Empty</option>
            <option value="error">Error</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>
        <button
          type="button"
          disabled={scenario === 'disabled' || loading || state.refreshing}
          onClick={refresh}
        >
          Refresh
        </button>
        <span role="status">
          {state.refreshing && state.scenario === scenario ? (
            <>
              <Spinner /> Refreshing
            </>
          ) : (
            ''
          )}
        </span>
      </div>
      {scenario === 'disabled' ? (
        <p>Choose a response to start the request.</p>
      ) : (
        <>
          {state.scenario === scenario && state.error && (
            <p role="alert">
              {state.error} {state.posts ? 'Showing the previous data.' : 'Try refreshing.'}
            </p>
          )}
          {posts?.length === 0 ? (
            <p>No posts found.</p>
          ) : posts ? (
            <PostList posts={posts} loading={loading} />
          ) : null}
        </>
      )}
    </main>
  );
}
