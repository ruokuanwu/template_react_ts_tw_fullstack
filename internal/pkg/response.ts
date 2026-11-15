import { t, type TSchema } from "elysia";

export interface ApiResponse<T> {
  code: number | string;
  message: string;
  data: T | null;
}

export const success = <T>(data: T, message = "Success") => ({
  code: 0 as const,
  message,
  data,
});

export const failure = (code: number | string, message: string): ApiResponse<never> => ({
  code,
  message,
  data: null,
});

export const responseSchema = <T extends TSchema>(data: T) => t.Object({
  code: t.Literal(0),
  message: t.String(),
  data,
});

export const errorResponseSchema = t.Object({
  code: t.Union([t.Number(), t.String()]),
  message: t.String(),
  data: t.Null(),
});

export const wrapJsonResponse = async (response: Response): Promise<Response> => {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  if (!isJson && response.status < 400) return response;

  const body: unknown = isJson ? await response.json() : null;
  let result: ApiResponse<unknown>;
  if (response.ok) {
    result = success(body);
  } else {
    const error = typeof body === "object" && body !== null ? body : {};
    const code = "code" in error && (typeof error.code === "string" || typeof error.code === "number")
      ? error.code : response.status;
    const message = "message" in error && typeof error.message === "string"
      ? error.message : response.statusText || "Request failed";
    result = failure(code, message);
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("content-type", "application/json");
  return Response.json(result, { status: response.status, headers });
};