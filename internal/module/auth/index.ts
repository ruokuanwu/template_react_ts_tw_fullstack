import { Elysia } from "elysia";
import { auth } from "./service";

export const authModule = new Elysia({ name: "auth-module" })
  .get("/auth/*", ({ request }) => auth.handler(request))
  .post("/auth/*", ({ request }) => auth.handler(request));
