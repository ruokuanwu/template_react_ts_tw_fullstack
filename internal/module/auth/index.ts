import { Elysia } from "elysia";
import { auth } from "./service";

export const authModule = new Elysia({ name: "auth-module" }).mount(
  auth.handler,
);
