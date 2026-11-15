import { Elysia } from "elysia";
import { auth } from "./service";
import { wrapJsonResponse } from "../../pkg/response";

const handleAuth = async ({ request }: { request: Request }) =>
  wrapJsonResponse(await auth.handler(request));

export const authModule = new Elysia({ name: "auth-module" })
  .get("/auth/*", handleAuth, { detail: { hide: true } })
  .post("/auth/*", handleAuth, { detail: { hide: true } });
