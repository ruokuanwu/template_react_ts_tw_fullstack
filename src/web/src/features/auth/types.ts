import type { authClient } from "@/lib/authClient";

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthUser = AuthSession["user"];
