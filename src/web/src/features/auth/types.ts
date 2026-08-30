import type { authClient } from "@/lib/auth-client";

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthUser = AuthSession["user"];
