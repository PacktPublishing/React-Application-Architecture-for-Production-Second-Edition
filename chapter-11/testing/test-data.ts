import { faker } from '@faker-js/faker';

import type { Idea, Review, User } from '@/types/generated/types.gen';

export const generateUser = (overrides: Partial<User> = {}): User => {
  const id = faker.string.uuid();
  return {
    id,
    email: faker.internet.email(),
    username: faker.internet.username(),
    bio: faker.person.bio(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
};

export const generateIdea = (overrides: Partial<Idea> = {}): Idea => {
  const id = faker.string.uuid();
  const author = overrides?.author ?? generateUser();
  return {
    id,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(),
    shortDescription: faker.lorem.sentence(),
    tags: faker.helpers.multiple(() => faker.word.sample(), { count: 3 }),
    authorId: author.id,
    author,
    reviewsCount: 0,
    avgRating: null,
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
};

export const generateReview = (overrides: Partial<Review> = {}): Review => {
  const id = faker.string.uuid();
  const author = overrides?.author ?? generateUser();
  const ideaId = overrides?.ideaId ?? faker.string.uuid();
  return {
    id,
    rating: faker.number.int({ min: 1, max: 5 }),
    content: faker.lorem.paragraph(),
    authorId: author.id,
    author,
    ideaId,
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
};
