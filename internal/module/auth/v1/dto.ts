import type { auth } from "../service";

export type AuthSessionDto = typeof auth.$Infer.Session;
export type AuthUserDto = AuthSessionDto["user"];
