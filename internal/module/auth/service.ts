import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { config } from "../../config";

export const auth = betterAuth({
  appName: "Fullstack Template",
  baseURL: config.baseUrl,
  trustedOrigins: config.clientUrl ? [config.clientUrl] : [],
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
