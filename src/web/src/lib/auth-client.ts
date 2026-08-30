import { createAuthClient } from "better-auth/react";
import { CONFIG } from "@/config";

export const authClient = createAuthClient({
  baseURL: CONFIG.apiBaseUrl,
  fetchOptions: {
    credentials: "include",
  },
});
