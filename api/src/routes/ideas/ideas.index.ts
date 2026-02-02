import { createRouter } from "@/lib/create-app";

import * as handlers from "./ideas.handlers";
import * as routes from "./ideas.routes";

const router = createRouter()
  // Public routes - specific paths first
  .openapi(routes.getAllTags, handlers.getAllTags)
  .openapi(routes.getAllIdeas, handlers.getAllIdeas)
  .openapi(routes.getIdeasByUser, handlers.getIdeasByUser)
  // Authenticated routes - specific paths first
  .openapi(routes.getCurrentUserIdeas, handlers.getCurrentUserIdeas)
  .openapi(routes.createIdea, handlers.createIdea)
  .openapi(routes.getIdeaById, handlers.getIdeaById)
  .openapi(routes.updateIdea, handlers.updateIdea)
  .openapi(routes.deleteIdea, handlers.deleteIdea);

export default router;