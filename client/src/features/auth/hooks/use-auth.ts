import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const { data, error, isPending, refetch } = authClient.useSession();

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    isAuthenticated: Boolean(data?.user),
    isPending,
    error,
    refetch,
  };
}
