import { expect, test } from "bun:test";
import { Elysia, t } from "elysia";
import { responseMiddleware } from "./response";
import { createApp } from "../app";
import { wrapJsonResponse } from "../pkg/response";

test("API validation, missing endpoints and unexpected errors use the error envelope", async () => {
  const app = new Elysia().use(responseMiddleware)
    .get("/validate", () => "unused", { query: t.Object({ count: t.Number() }) })
    .get("/error", () => { throw new Error("private database details"); });
  for (const [path, status, message] of [
    ["/validate?count=invalid", 422, "Validation failed"],
    ["/error", 500, "Internal server error"],
  ] as const) {
    const response = await app.handle(new Request(`http://localhost${path}`));
    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ code: status, message, data: null });
  }
  const response = await createApp().handle(new Request("http://localhost/api/missing"));
  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({ code: 404, message: "API endpoint not found", data: null });
});

test("auth envelopes retain status, cookies and error details", async () => {
  const original = Response.json({ token: "test-token" }, {
    headers: [["set-cookie", "session=test; HttpOnly"], ["set-cookie", "other=value"]],
  });
  const response = await wrapJsonResponse(original);
  expect(response.headers.getSetCookie()).toEqual(original.headers.getSetCookie());
  expect(await response.json()).toEqual({ code: 0, message: "Success", data: { token: "test-token" } });

  const failed = await wrapJsonResponse(Response.json({ code: "INVALID_PASSWORD", message: "Invalid password" }, { status: 401 }));
  expect(failed.status).toBe(401);
  expect(await failed.json()).toEqual({ code: "INVALID_PASSWORD", message: "Invalid password", data: null });

  const redirect = new Response(null, { status: 302, headers: { location: "/login" } });
  expect(await wrapJsonResponse(redirect)).toBe(redirect);

  const missing = await wrapJsonResponse(new Response(null, { status: 404 }));
  expect(missing.status).toBe(404);
  expect(await missing.json()).toEqual({ code: 404, message: "Request failed", data: null });
});
