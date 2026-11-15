import { expect, test } from "bun:test";
import { createApp } from "./index";

test("Swagger documents module request and response metadata", async () => {
  const app = createApp();
  await app.modules;

  const ui = await app.handle(new Request("http://localhost/swagger"));
  expect(ui.status).toBe(200);
  expect(ui.headers.get("content-type")).toContain("text/html");
  expect(await ui.text()).toContain("SwaggerUIBundle");

  const spec = await app.handle(new Request("http://localhost/swagger/json"));
  expect(spec.status).toBe(200);
  expect(spec.headers.get("content-type")).toContain("application/json");
  const document = await spec.json();
  expect(document).not.toHaveProperty("paths./*");
  expect(document).not.toHaveProperty("paths./api/auth/*");
  expect(document).toMatchObject({
    paths: {
      "/api/hello": {
        get: {
          tags: ["Hello"],
          summary: expect.any(String),
          responses: {
            "200": {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      message: { type: "string" },
                      code: { const: 0 },
                      data: { properties: { timestamp: { format: "date-time" } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/hello/{name}": {
        get: {
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "name", in: "path", required: true,
              schema: expect.objectContaining({ description: "Name to greet", examples: ["Alice"] }),
            }),
          ]),
        },
      },
      "/api/auth/sign-in/email": {
        post: {
          tags: ["Auth"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  properties: { email: expect.any(Object), password: expect.any(Object) },
                },
              },
            },
          },
          responses: { "200": { content: { "application/json": { schema: {
            properties: { code: { const: 0 }, data: expect.any(Object) },
          } } } } },
        },
      },
      "/api/auth/get-session": { get: { responses: { "200": expect.any(Object) } } },
    },
    components: { schemas: { User: expect.any(Object), Session: expect.any(Object) } },
  });

  const schemaEndpoint = await app.handle(new Request("http://localhost/api/auth/open-api/generate-schema"));
  expect(schemaEndpoint.status).toBe(404);

  for (const path of ["/api/hello", "/api/hello/Alice"]) {
    const hello = await app.handle(new Request(`http://localhost${path}`));
    expect(hello.status).toBe(200);
    expect(await hello.json()).toMatchObject({
      code: 0,
      message: path.endsWith("Alice") ? "Hello, Alice!" : "Hello from Elysia!",
      data: { timestamp: expect.any(String) },
    });
  }
});
