import { Elysia } from "elysia";
import { errorResponseSchema, failure } from "../pkg/response";
import { Logger } from "../pkg/logger";

export const responseMiddleware = new Elysia({ name: "api-response" })
  .onError({ as: "global" }, ({ code, error, set }) => {
    const status = code === "VALIDATION" ? 422
      : code === "NOT_FOUND" ? 404
      : code === "PARSE" ? 400
      : typeof set.status === "number" && set.status >= 400 ? set.status : 500;
    set.status = status;
    if (status >= 500) Logger.error({ err: error }, "API request failed");
    return failure(status, status >= 500 ? "Internal server error"
      : code === "VALIDATION" ? "Validation failed"
      : "message" in error ? String(error.message) : "Request failed");
  })
  .guard({ response: { 400: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema, 500: errorResponseSchema } });
