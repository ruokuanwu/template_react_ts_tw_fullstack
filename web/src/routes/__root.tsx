import { createRootRouteWithContext, Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/layout/site-layout";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: () => (
    <main className="page-container py-32 text-center">
      <p className="eyebrow justify-center">404 / OFF THE MAP</p>
      <h1 className="section-heading mb-8">Nothing in this orbit.</h1>
      <Link to="/" className="button-primary">Back to home</Link>
    </main>
  ),
});

function RootLayout() {
  const isDashboard = useRouterState({ select: (state) => state.location.pathname === "/dashboard" || state.location.pathname.startsWith("/dashboard/") });
  return isDashboard ? <Outlet /> : <><SiteHeader /><Outlet /><SiteFooter /></>;
}
