import { useMemo } from 'react';
import { POSTS, PROFILE } from '../fixtures';
import { usePreviewSettings } from '../../ui/PreviewSettings/context';

export function usePreviewData() {
  const { textLength } = usePreviewSettings();

  return useMemo(() => {
    if (textLength === 'normal') return { posts: POSTS, profile: PROFILE };

    return {
      posts: POSTS.map((post) => ({
        ...post,
        title: `${post.title}: keeping your interface layout stable`,
        excerpt: `${post.excerpt} ${post.excerpt}`,
      })),
      profile: { ...PROFILE, bio: `${PROFILE.bio} ${PROFILE.bio}` },
    };
  }, [textLength]);
}
