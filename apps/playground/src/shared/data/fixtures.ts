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
    title: 'Почему скелетон должен повторять геометрию',
    excerpt:
      'Если заглушка другого размера, при догрузке соседние блоки прыгают, и пользователь промахивается по кнопке, в которую уже целился.',
    author: 'Семён Сурков',
    readingTime: '4 мин',
    tag: 'UX',
    avatarUrl: avatar('f80'),
  },
  {
    id: 'tokens',
    title: 'CSS Modules и токены',
    excerpt:
      'Цвета заглушки берутся из места, где она стоит, поэтому тёмная тема работает без правок.',
    author: 'Анна Петрова',
    readingTime: '2 мин',
    tag: 'CSS',
    avatarUrl: avatar('3a8'),
  },
  {
    id: 'delay',
    title: 'Задержка появления в 150 мс',
    excerpt:
      'Быстрая загрузка не должна мигать серым: заглушка проявляется, только если данные задержались дольше, чем глаз успевает заметить, а до этого контейнер стоит пустым.',
    author: 'Илья Ким',
    readingTime: '6 мин',
    tag: 'Motion',
    avatarUrl: avatar('86f'),
  },
];

export const PROFILE: Profile = {
  name: 'Семён Сурков',
  handle: '@semyon',
  bio: 'Фронтенд, React и CSS Modules. Пишу про состояния загрузки и мелочи интерфейса.',
  followers: 1280,
  following: 164,
  coverUrl: avatar('2b59ff'),
  avatarUrl: avatar('f80'),
};
