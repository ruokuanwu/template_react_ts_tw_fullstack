import { treaty } from "@elysiajs/eden";
import { config } from "@/config";
import type { App } from "../../../app";

export const apiClient = treaty<App>(config.apiBaseUrl, {
  fetch: {
    credentials: "include",
  },
});
