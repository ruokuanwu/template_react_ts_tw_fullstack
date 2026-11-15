import type { ElysiaOpenAPIConfig } from "@elysiajs/openapi";
import { auth } from "./service";

type AuthOperation = NonNullable<Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>["paths"][string]["get"]>;

export const getAuthDocumentation = async () => {
  const { paths, components } = await auth.api.generateOpenAPISchema();
  const prefixedPaths = Object.fromEntries(
    Object.entries(paths).map(([path, operations]) => [
      `/api/auth${path}`,
      Object.fromEntries(
        Object.entries(operations).map(([method, operation]: [string, AuthOperation]) => [
          method,
          {
            ...operation,
            tags: ["Auth"],
            responses: Object.fromEntries(
              Object.entries(operation.responses ?? {}).map(([status, response]) => [
                status,
                {
                  ...response,
                  content: Object.fromEntries(
                    Object.entries(response.content ?? {}).map(([mediaType, media]) => [
                      mediaType,
                      mediaType === "application/json" ? {
                        schema: {
                          type: "object",
                          required: ["code", "message", "data"],
                          properties: Number(status) >= 200 && Number(status) < 300 ? {
                            code: { type: "integer", const: 0 },
                            message: { type: "string", example: "Success" },
                            data: media?.schema ?? {},
                          } : {
                            code: { anyOf: [{ type: "integer" }, { type: "string" }] },
                            message: { type: "string" },
                            data: { type: "null" },
                          },
                        },
                      } : media,
                    ]),
                  ),
                },
              ]),
            ),
          },
        ]),
      ),
    ]),
  );

  // Better Auth emits OpenAPI 3.1 but widens schema literals to string in its types.
  return { paths: prefixedPaths, components } as NonNullable<ElysiaOpenAPIConfig["documentation"]>;
};
