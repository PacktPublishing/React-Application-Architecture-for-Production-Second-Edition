import type {
  CurrentUser,
  Idea,
  Review,
  User,
} from '@/types/generated/types.gen';

export const IdeaPolicies = {
  canCreate: (currentUser: CurrentUser | null): boolean => {
    const isAuthenticated = !!currentUser;
    return isAuthenticated;
  },

  canEdit: (currentUser: CurrentUser | null, idea: Idea): boolean => {
    const isIdeaAuthor = currentUser?.id === idea.authorId;
    return isIdeaAuthor;
  },

  canDelete: (currentUser: CurrentUser | null, idea: Idea): boolean => {
    const isIdeaAuthor = currentUser?.id === idea.authorId;
    return isIdeaAuthor;
  },
};

export const ReviewPolicies = {
  canCreate: (
    currentUser: CurrentUser | null,
    idea: Idea,
    existingReviews?: Review[],
  ): boolean => {
    const isAuthenticated = !!currentUser;
    if (!isAuthenticated) return false;

    const isIdeaAuthor = currentUser.id === idea.authorId;
    if (isIdeaAuthor) return false;

    const hasAlreadyReviewed = existingReviews?.some(
      (review) => review.authorId === currentUser.id,
    );
    if (hasAlreadyReviewed) return false;

    return true;
  },

  canEdit: (currentUser: CurrentUser | null, review: Review): boolean => {
    const isReviewAuthor = currentUser?.id === review.authorId;
    return isReviewAuthor;
  },

  canDelete: (currentUser: CurrentUser | null, review: Review): boolean => {
    const isReviewAuthor = currentUser?.id === review.authorId;
    return isReviewAuthor;
  },
};

export const ProfilePolicies = {
  canEdit: (currentUser: CurrentUser | null, user: User): boolean => {
    const isUserAuthor = currentUser?.id === user.id;
    return isUserAuthor;
  },
};
