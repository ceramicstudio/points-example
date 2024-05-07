import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    CERAMIC_PRIVATE_KEY: z.string(),
    AGGREGATION_ID: z.string(),
    ALLOCATION_ID: z.string(),
    SHEET_ID: z.string(),
    TYPE: z.string(),
    PROJECT_ID: z.string(),
    PRIVATE_KEY_ID: z.string(),
    PRIVATE_KEY: z.string(),
    CLIENT_EMAIL: z.string(),
    CLIENT_ID: z.string(),
    UNIVERSE_DOMAIN: z.string(),
    GITCOIN_API_KEY: z.string(),
    SCORER_ID: z.string(),
    CERAMIC_API: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    CERAMIC_PRIVATE_KEY: process.env.CERAMIC_PRIVATE_KEY,
    AGGREGATION_ID: process.env.AGGREGATION_ID,
    ALLOCATION_ID: process.env.ALLOCATION_ID,
    SHEET_ID: process.env.SHEET_ID,
    TYPE: process.env.TYPE,
    PROJECT_ID: process.env.PROJECT_ID,
    PRIVATE_KEY_ID: process.env.PRIVATE_KEY_ID,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CLIENT_EMAIL: process.env.CLIENT_EMAIL,
    CLIENT_ID: process.env.CLIENT_ID,
    UNIVERSE_DOMAIN: process.env.UNIVERSE_DOMAIN,
    GITCOIN_API_KEY: process.env.GITCOIN_API_KEY,
    SCORER_ID: process.env.SCORER_ID,
    CERAMIC_API: process.env.CERAMIC_API,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
