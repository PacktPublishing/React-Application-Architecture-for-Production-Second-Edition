/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
}));

/** Env vars are strings; comma-separated URLs or JSON array (as in `.env`). */
const clientUrlsSchema = z.preprocess(
  (raw) => {
    if (Array.isArray(raw))
      return raw;
    if (typeof raw !== "string")
      return raw;
    const s = raw.trim();
    if (!s)
      return raw;
    if (s.startsWith("[")) {
      try {
        return JSON.parse(s) as unknown;
      }
      catch {
        return raw;
      }
    }
    return s.split(",").map(u => u.trim()).filter(Boolean);
  },
  z.array(z.url()),
);

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(9999),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  JWT_SECRET: z.string(),
  CLIENT_URLS: clientUrlsSchema,
  BYPASS_AUTH: z.string().optional(),
}).superRefine((input, ctx) => {
  if (input.NODE_ENV === "production" && !input.DATABASE_AUTH_TOKEN) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: "string",
      received: "undefined",
      path: ["DATABASE_AUTH_TOKEN"],
      message: "Must be set when NODE_ENV is 'production'",
    });
  }
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;
