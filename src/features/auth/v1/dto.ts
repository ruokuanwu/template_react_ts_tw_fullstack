import type { authService } from "../service";

export type AuthSessionDto = typeof authService.$Infer.Session;
export type AuthUserDto = AuthSessionDto["user"];
