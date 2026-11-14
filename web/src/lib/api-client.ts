import { treaty } from "@elysiajs/eden";
import { config } from "@/config";
import type { App } from "../../../internal/app";

export const apiClient = treaty<App>(config.apiBaseUrl, {
  fetch: {
    credentials: "include",
  },
});
