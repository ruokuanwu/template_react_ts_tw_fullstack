import { authClient } from "@/lib/authClient";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  name: string;
}

export const signIn = (payload: SignInPayload) =>
  authClient.signIn.email(payload);

export const signUp = (payload: SignUpPayload) =>
  authClient.signUp.email(payload);

export const signOut = () => authClient.signOut();

export const getSession = () => authClient.getSession();
