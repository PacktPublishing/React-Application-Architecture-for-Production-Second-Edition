import type { Context, Next } from "hono";

import pino from "pino";
import pretty from "pino-pretty";

import env from "@/env";

const logger = pino(
  {
    level: env.LOG_LEVEL || "info",
  },
  env.NODE_ENV === "production" ? undefined : pretty(),
);

export function pinoLogger() {
  return async (c: Context, next: Next) => {
    // Set logger in context for compatibility
    c.set("logger", logger as any);

    await next();

    logger.info({
      method: c.req.method,
      url: c.req.url,
      status: c.res.status,
      cookies: c.req.header("Cookie"),
      authorization: c.req.header("Authorization"),
    });
  };
}
