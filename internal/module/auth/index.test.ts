import { expect, test } from "bun:test";
import { Elysia } from "elysia";
import { authModule } from "./index";

test("auth session endpoint takes precedence over the SPA fallback", async () => {
  const app = new Elysia()
    .group("/api", (api) => api.use(authModule))
    .get("/*", () => "SPA fallback");

  const response = await app.handle(
    new Request("http://localhost:3000/api/auth/get-session"),
  );

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("application/json");
  expect(await response.json()).toEqual({ code: 0, message: "Success", data: null });
});

test("auth validation errors use the response envelope", async () => {
  const app = new Elysia().group("/api", (api) => api.use(authModule));
  const response = await app.handle(new Request("http://localhost:3000/api/auth/sign-in/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "not-an-email", password: "test" }),
  }));

  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({
    code: expect.any(String),
    message: expect.any(String),
    data: null,
  });
});
