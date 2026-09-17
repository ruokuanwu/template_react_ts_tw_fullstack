import { betterAuth } from "better-auth";
import { config } from "../../config";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../../db";
import * as schema from "../../db/schema";

export const authService = betterAuth({
  appName: "Fullstack Template",
  baseURL: config.authUrl,
  secret: config.authSecret,
  trustedOrigins: [config.clientUrl],
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
