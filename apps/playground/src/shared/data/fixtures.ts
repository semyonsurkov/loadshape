export type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readingTime: string;
  tag: string;
  avatarUrl: string;
};

export type Profile = {
  name: string;
  handle: string;
  bio: string;
  followers: number;
  following: number;
  coverUrl: string;
  avatarUrl: string;
};

const avatar = (color: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23${color}' width='80' height='80'/%3E%3C/svg%3E`;

export const POSTS: Post[] = [
  {
    id: 'geometry',
    title: 'Why skeletons should match the layout',
    excerpt: 'When placeholders have different dimensions, nearby elements move as content loads.',
    author: 'Semyon Surkov',
    readingTime: '4 min',
    tag: 'UX',
    avatarUrl: avatar('f80'),
  },
  {
    id: 'tokens',
    title: 'CSS Modules and tokens',
    excerpt:
      'Skeleton colors come from their surroundings, so dark themes work without extra configuration.',
    author: 'Anna Petrova',
    readingTime: '2 min',
    tag: 'CSS',
    avatarUrl: avatar('3a8'),
  },
  {
    id: 'delay',
    title: 'A 150 ms appearance delay',
    excerpt:
      'Fast loading should not flash gray. Placeholders appear only when data takes longer to arrive.',
    author: 'Ilya Kim',
    readingTime: '6 min',
    tag: 'Motion',
    avatarUrl: avatar('86f'),
  },
];

export const PROFILE: Profile = {
  name: 'Semyon Surkov',
  handle: '@semyon',
  bio: 'Frontend, React and CSS Modules. Writing about loading states and interface details.',
  followers: 1280,
  following: 164,
  coverUrl: avatar('2b59ff'),
  avatarUrl: avatar('f80'),
};
