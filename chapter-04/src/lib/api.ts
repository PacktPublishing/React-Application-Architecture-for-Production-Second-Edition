import type { Idea, Pagination, Review, User } from '@/types/data';

const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'johndoe',
    bio: 'Software engineer passionate about building great products',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    username: 'janesmith',
    bio: 'Product designer with a love for user experience',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    email: 'mike@example.com',
    username: 'mikejohnson',
    bio: 'Entrepreneur and startup advisor',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

export const CURRENT_USER: User = MOCK_USERS[0];

const MOCK_TAGS = [
  'technology',
  'design',
  'business',
  'health',
  'education',
  'entertainment',
  'finance',
  'productivity',
  'social',
  'sustainability',
];

const MOCK_IDEAS: Idea[] = [
  {
    id: '1',
    title: 'AI-Powered Code Review Assistant',
    shortDescription:
      'An intelligent code review tool that uses AI to provide meaningful feedback',
    description:
      "# AI-Powered Code Review Assistant\n\nThis tool would analyze code changes and provide intelligent suggestions for improvements, bug detection, and best practices. It would integrate with popular version control systems and learn from your team's coding patterns over time.",
    tags: ['technology', 'productivity', 'ai'],
    authorId: '1',
    author: {
      id: '1',
      email: 'john@example.com',
      username: 'johndoe',
    },
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    reviewsCount: 2,
    avgRating: 4.5,
  },
  {
    id: '2',
    title: 'Sustainable Fashion Marketplace',
    shortDescription:
      'A platform connecting eco-conscious consumers with sustainable fashion brands',
    description:
      '# Sustainable Fashion Marketplace\n\nCreate a marketplace that only features brands committed to sustainable and ethical practices. Include transparency scores, carbon footprint tracking, and a community for sharing sustainable fashion tips.',
    tags: ['sustainability', 'business', 'social'],
    authorId: '2',
    author: {
      id: '2',
      email: 'jane@example.com',
      username: 'janesmith',
    },
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
    reviewsCount: 2,
    avgRating: 4.0,
  },
  {
    id: '3',
    title: 'Virtual Fitness Coach',
    shortDescription:
      'AI-powered personal trainer that adapts to your fitness level and goals',
    description:
      '# Virtual Fitness Coach\n\nAn intelligent fitness app that creates personalized workout plans, tracks your progress, and adjusts based on your performance. Includes video demonstrations, form correction using computer vision, and integration with wearable devices.',
    tags: ['health', 'technology', 'ai'],
    authorId: '1',
    author: {
      id: '1',
      email: 'john@example.com',
      username: 'johndoe',
    },
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    reviewsCount: 1,
    avgRating: 5.0,
  },
  {
    id: '4',
    title: 'Local Business Network',
    shortDescription:
      'Connect local businesses for collaboration and resource sharing',
    description:
      '# Local Business Network\n\nA platform where local businesses can connect, share resources, collaborate on projects, and support each other. Features include a marketplace for B2B services, community events, and networking opportunities.',
    tags: ['business', 'social'],
    authorId: '3',
    author: {
      id: '3',
      email: 'mike@example.com',
      username: 'mikejohnson',
    },
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
    reviewsCount: 0,
    avgRating: 0,
  },
  {
    id: '5',
    title: 'Interactive Learning Platform for Kids',
    shortDescription:
      'Gamified educational content that makes learning fun and engaging',
    description:
      '# Interactive Learning Platform for Kids\n\nCreate an educational platform that uses game mechanics to teach core subjects. Include progress tracking for parents, adaptive difficulty levels, and collaborative challenges that kids can complete together.',
    tags: ['education', 'entertainment', 'technology'],
    authorId: '2',
    author: {
      id: '2',
      email: 'jane@example.com',
      username: 'janesmith',
    },
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    reviewsCount: 0,
    avgRating: 0,
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    content:
      'This is a fantastic idea! I would definitely use this tool in my daily workflow.',
    rating: 5,
    authorId: '2',
    author: {
      id: '2',
      email: 'jane@example.com',
      username: 'janesmith',
    },
    ideaId: '1',
    idea: {
      id: '1',
      title: 'AI-Powered Code Review Assistant',
    },
    createdAt: '2024-03-02T10:00:00Z',
    updatedAt: '2024-03-02T10:00:00Z',
  },
  {
    id: '2',
    content:
      'Great concept! Have you considered integrating with GitHub Actions?',
    rating: 4,
    authorId: '3',
    author: {
      id: '3',
      email: 'mike@example.com',
      username: 'mikejohnson',
    },
    ideaId: '1',
    idea: {
      id: '1',
      title: 'AI-Powered Code Review Assistant',
    },
    createdAt: '2024-03-03T10:00:00Z',
    updatedAt: '2024-03-03T10:00:00Z',
  },
  {
    id: '3',
    content: 'Love this! We need more sustainable fashion options.',
    rating: 5,
    authorId: '1',
    author: {
      id: '1',
      email: 'john@example.com',
      username: 'johndoe',
    },
    ideaId: '2',
    idea: {
      id: '2',
      title: 'Sustainable Fashion Marketplace',
    },
    createdAt: '2024-03-06T10:00:00Z',
    updatedAt: '2024-03-06T10:00:00Z',
  },
  {
    id: '4',
    content: 'Interesting idea, but how would you verify brand claims?',
    rating: 3,
    authorId: '3',
    author: {
      id: '3',
      email: 'mike@example.com',
      username: 'mikejohnson',
    },
    ideaId: '2',
    idea: {
      id: '2',
      title: 'Sustainable Fashion Marketplace',
    },
    createdAt: '2024-03-07T10:00:00Z',
    updatedAt: '2024-03-07T10:00:00Z',
  },
  {
    id: '5',
    content: 'This could really help me stay motivated with my fitness goals!',
    rating: 5,
    authorId: '2',
    author: {
      id: '2',
      email: 'jane@example.com',
      username: 'janesmith',
    },
    ideaId: '3',
    idea: {
      id: '3',
      title: 'Virtual Fitness Coach',
    },
    createdAt: '2024-03-11T10:00:00Z',
    updatedAt: '2024-03-11T10:00:00Z',
  },
];

export async function getCurrentUserIdeas() {
  await _delay();
  const ideas = MOCK_IDEAS.filter((idea) => idea.authorId === CURRENT_USER.id);
  return { data: ideas };
}

export async function getIdeaById(id: string) {
  await _delay();
  const idea = _getIdeaById(id);
  if (!idea) {
    throw new Error('Idea not found');
  }
  return idea;
}

export async function getIdeasByUser({ username }: { username: string }) {
  await _delay();
  const user = _getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  const ideas = MOCK_IDEAS.filter((idea) => idea.authorId === user.id);
  return { data: ideas };
}

export async function getIdeas(params?: {
  page?: string;
  limit?: string;
  search?: string;
  tags?: string;
}) {
  await _delay();
  const page = params?.page ? parseInt(params.page) : 1;
  const limit = params?.limit ? parseInt(params.limit) : 10;

  const filtered = _filterIdeas(MOCK_IDEAS, params);
  return _paginateResults(filtered, page, limit);
}

export async function getTags() {
  await _delay();
  return { data: MOCK_TAGS };
}

export async function getProfileByUsername(username: string) {
  await _delay();
  const user = _getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export async function getReviewsByUser({ username }: { username: string }) {
  await _delay();
  const user = _getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  const reviews = MOCK_REVIEWS.filter((review) => review.authorId === user.id);
  return { data: reviews };
}

export async function getReviewsByIdea({ id }: { id: string }) {
  await _delay();
  const idea = _getIdeaById(id);
  if (!idea) {
    throw new Error('Idea not found');
  }
  const reviews = MOCK_REVIEWS.filter((review) => review.ideaId === id);
  return { data: reviews };
}

export async function getCurrentUserReviews() {
  await _delay();
  const user = CURRENT_USER;
  const reviews = MOCK_REVIEWS.filter((review) => review.authorId === user.id);
  return { data: reviews };
}

const _delay = () => {
  const ms = Math.floor(Math.random() * 100) + 100; // Random 100-200ms
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const _getUserByUsername = (username: string) => {
  return MOCK_USERS.find((user) => user.username === username);
};

const _getIdeaById = (id: string) => {
  return MOCK_IDEAS.find((idea) => idea.id === id);
};

const _filterIdeas = (
  ideas: Idea[],
  params?: {
    page?: string;
    limit?: string;
    search?: string;
    tags?: string;
  },
) => {
  let filtered = [...ideas];

  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (idea) =>
        idea.title.toLowerCase().includes(searchLower) ||
        idea.shortDescription.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower),
    );
  }

  if (params?.tags) {
    const tagArray = params.tags.split(',').map((tag) => tag.trim());
    filtered = filtered.filter((idea) =>
      tagArray.some((tag) => idea.tags.includes(tag)),
    );
  }

  return filtered;
};

const _paginateResults = <T>(
  items: T[],
  page: number,
  limit: number,
): {
  data: T[];
  pagination: Pagination;
} => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: items.slice(start, end),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    },
  };
};
