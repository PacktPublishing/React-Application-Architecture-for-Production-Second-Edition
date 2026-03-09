import type {
  CurrentUser,
  Idea,
  Review,
  User,
} from '@/types/generated/types.gen';

export const IdeaPolicies = {
  canCreate: (currentUser: CurrentUser | null): boolean => {
    return !!currentUser;
  },

  canEdit: (currentUser: CurrentUser | null, idea: Idea): boolean => {
    if (!currentUser) return false;
    return currentUser.id === idea.authorId;
  },

  canDelete: (currentUser: CurrentUser | null, idea: Idea): boolean => {
    if (!currentUser) return false;
    return currentUser.id === idea.authorId;
  },
};

export const ReviewPolicies = {
  canCreate: (
    currentUser: CurrentUser | null,
    idea: Idea,
    existingReviews?: Review[],
  ): boolean => {
    if (!currentUser) return false;

    if (currentUser.id === idea.authorId) return false;

    if (existingReviews?.some((review) => review.authorId === currentUser.id)) {
      return false;
    }

    return true;
  },

  canEdit: (currentUser: CurrentUser | null, review: Review): boolean => {
    if (!currentUser) return false;
    return currentUser.id === review.authorId;
  },

  canDelete: (currentUser: CurrentUser | null, review: Review): boolean => {
    if (!currentUser) return false;
    return currentUser.id === review.authorId;
  },
};

export const ProfilePolicies = {
  canEdit: (currentUser: CurrentUser | null, user: User): boolean => {
    if (!currentUser) return false;
    return currentUser.id === user.id;
  },
};
