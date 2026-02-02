import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import ideas from "@/routes/ideas/ideas.index";
import index from "@/routes/index.route";
import profile from "@/routes/profile/profile.index";
import reviews from "@/routes/reviews/reviews.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  auth,
  ideas,
  profile,
  reviews,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
