import { createAuthClient } from "better-auth/react";
import { config } from "@/config";

export const authClient = createAuthClient({
  baseURL: config.baseUrl,
  fetchOptions: {
    customFetchImpl: async (input, init) => {
      const response = await fetch(input, init);
      if (!response.headers.get("content-type")?.includes("application/json")) return response;

      const body: unknown = await response.json();
      if (typeof body !== "object" || body === null || !("code" in body) || !("data" in body)) {
        throw new Error("Invalid authentication API response");
      }
      const headers = new Headers(response.headers);
      headers.delete("content-length");
      return Response.json(response.ok ? body.data : body, { status: response.status, headers });
    },
  },
});
