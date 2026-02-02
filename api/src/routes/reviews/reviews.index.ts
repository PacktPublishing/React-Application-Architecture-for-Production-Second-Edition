import { createRouter } from "@/lib/create-app";

import * as handlers from "./reviews.handlers";
import * as routes from "./reviews.routes";

const router = createRouter()
  // Public routes - specific paths first
  .openapi(routes.getReviewsByUser, handlers.getReviewsByUser)
  .openapi(routes.getReviewsByIdea, handlers.getReviewsByIdea)
  // Authenticated routes - specific paths first
  .openapi(routes.getCurrentUserReviews, handlers.getCurrentUserReviews)
  .openapi(routes.createReview, handlers.createReview)
  .openapi(routes.updateReview, handlers.updateReview)
  .openapi(routes.deleteReview, handlers.deleteReview);

export default router;