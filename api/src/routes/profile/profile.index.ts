import { createRouter } from "@/lib/create-app";

import * as handlers from "./profile.handlers";
import * as routes from "./profile.routes";

const router = createRouter()
  .openapi(routes.getUserByUsername, handlers.getUserByUsername)
  .openapi(routes.updateProfile, handlers.updateProfile);

export default router;
