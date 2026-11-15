import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { authClient } from "@/features/auth/auth-client";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const result = await authClient.getSession();
    if (result.error) throw new Error(result.error.message || "Unable to load your account. Please try again.");
    if (!result.data) throw redirect({ to: "/login" });
    return { authenticatedSession: result.data };
  },
  errorComponent: ({ error, reset }) => <main className="page-container py-24"><h1 className="text-2xl">Unable to load your account.</h1><p role="alert" className="my-5 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Check your connection and try again."}</p><button className="button-primary" onClick={reset}>Try again</button></main>,
  component: DashboardLayout,
});
