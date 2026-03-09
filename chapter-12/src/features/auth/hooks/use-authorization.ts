import type { Idea, Review, User } from '@/types/generated/types.gen';

import {
  IdeaPolicies,
  ProfilePolicies,
  ReviewPolicies,
} from '../lib/authorization-policies';

import { useUser } from './use-user';

export function useAuthorization() {
  const currentUser = useUser();

  return {
    canCreateIdea: () => IdeaPolicies.canCreate(currentUser),
    canEditIdea: (idea: Idea) => IdeaPolicies.canEdit(currentUser, idea),
    canDeleteIdea: (idea: Idea) => IdeaPolicies.canDelete(currentUser, idea),
    canCreateReview: (idea: Idea, reviews?: Review[]) =>
      ReviewPolicies.canCreate(currentUser, idea, reviews),
    canEditReview: (review: Review) =>
      ReviewPolicies.canEdit(currentUser, review),
    canDeleteReview: (review: Review) =>
      ReviewPolicies.canDelete(currentUser, review),
    canEditProfile: (user: User) => ProfilePolicies.canEdit(currentUser, user),
  };
}
