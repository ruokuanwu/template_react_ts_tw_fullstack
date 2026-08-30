import { Elysia } from "elysia";
import { authService } from "./service";

export const authModule = new Elysia({ name: "auth-module" }).mount(
  authService.handler,
);
