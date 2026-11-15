import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/layout/site-layout";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => <><SiteHeader /><Outlet /><SiteFooter /></>,
  notFoundComponent: () => (
    <main className="page-container py-32 text-center">
      <p className="eyebrow justify-center">404 / OFF THE MAP</p>
      <h1 className="section-heading mb-8">Nothing in this orbit.</h1>
      <Link to="/" className="button-primary">Back to home</Link>
    </main>
  ),
});
