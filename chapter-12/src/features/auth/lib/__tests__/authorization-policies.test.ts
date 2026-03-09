import type {
  CurrentUser,
  Idea,
  Review,
  User,
} from '@/types/generated/types.gen';

import {
  IdeaPolicies,
  ReviewPolicies,
  ProfilePolicies,
} from '../authorization-policies';

const createUser = (id: string): CurrentUser => ({
  id,
  email: `${id}@test.com`,
  username: `user${id}`,
  bio: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const createIdea = (authorId: string): Idea => ({
  id: '1',
  title: 'Test Idea',
  shortDescription: 'Short',
  description: 'Description',
  tags: [],
  authorId,
  author: {
    id: authorId,
    email: `${authorId}@test.com`,
    username: `user${authorId}`,
  },
  reviewsCount: 0,
  avgRating: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const createReview = (authorId: string): Review => ({
  id: '1',
  content: 'Review',
  rating: 5,
  authorId,
  author: {
    id: authorId,
    email: `${authorId}@test.com`,
    username: `user${authorId}`,
  },
  ideaId: '1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('IdeaPolicies', () => {
  describe('canCreate', () => {
    it('should return true for authenticated users', () => {
      expect(IdeaPolicies.canCreate(createUser('1'))).toBe(true);
    });

    it('should return false for unauthenticated users', () => {
      expect(IdeaPolicies.canCreate(null)).toBe(false);
    });
  });

  describe('canEdit', () => {
    it('should return true when user is the author', () => {
      const user = createUser('1');
      const idea = createIdea('1');
      expect(IdeaPolicies.canEdit(user, idea)).toBe(true);
    });

    it('should return false when user is not the author', () => {
      const user = createUser('2');
      const idea = createIdea('1');
      expect(IdeaPolicies.canEdit(user, idea)).toBe(false);
    });

    it('should return false when user is null', () => {
      const idea = createIdea('1');
      expect(IdeaPolicies.canEdit(null, idea)).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should return true when user is the author', () => {
      const user = createUser('1');
      const idea = createIdea('1');
      expect(IdeaPolicies.canDelete(user, idea)).toBe(true);
    });

    it('should return false when user is not the author', () => {
      const user = createUser('2');
      const idea = createIdea('1');
      expect(IdeaPolicies.canDelete(user, idea)).toBe(false);
    });
  });
});

describe('ReviewPolicies', () => {
  describe('canCreate', () => {
    it('should return true for authenticated user who is not the idea author', () => {
      const user = createUser('2');
      const idea = createIdea('1');
      expect(ReviewPolicies.canCreate(user, idea)).toBe(true);
    });

    it('should return false for idea author', () => {
      const user = createUser('1');
      const idea = createIdea('1');
      expect(ReviewPolicies.canCreate(user, idea)).toBe(false);
    });

    it('should return false if user already has a review', () => {
      const user = createUser('2');
      const idea = createIdea('1');
      const existingReviews = [createReview('2')];
      expect(ReviewPolicies.canCreate(user, idea, existingReviews)).toBe(false);
    });

    it('should return false for unauthenticated users', () => {
      const idea = createIdea('1');
      expect(ReviewPolicies.canCreate(null, idea)).toBe(false);
    });
  });

  describe('canEdit', () => {
    it('should return true when user is the review author', () => {
      const user = createUser('1');
      const review = createReview('1');
      expect(ReviewPolicies.canEdit(user, review)).toBe(true);
    });

    it('should return false when user is not the review author', () => {
      const user = createUser('2');
      const review = createReview('1');
      expect(ReviewPolicies.canEdit(user, review)).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should return true when user is the review author', () => {
      const user = createUser('1');
      const review = createReview('1');
      expect(ReviewPolicies.canDelete(user, review)).toBe(true);
    });

    it('should return false when user is not the review author', () => {
      const user = createUser('2');
      const review = createReview('1');
      expect(ReviewPolicies.canDelete(user, review)).toBe(false);
    });
  });
});

describe('ProfilePolicies', () => {
  describe('canEdit', () => {
    it('should return true when user is editing own profile', () => {
      const user = createUser('1');
      const profile: User = { ...createUser('1')! };
      expect(ProfilePolicies.canEdit(user, profile)).toBe(true);
    });

    it('should return false when user is editing another profile', () => {
      const user = createUser('1');
      const profile: User = { ...createUser('2')! };
      expect(ProfilePolicies.canEdit(user, profile)).toBe(false);
    });
  });
});
