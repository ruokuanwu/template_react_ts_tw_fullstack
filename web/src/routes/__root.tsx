import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { RouteErrorPage } from '@/components/layout/route-error';
import { NotFoundPage } from '@/components/layout/not-found';
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { APP_NAME, NAVIGATION_ITEMS } from "@/lib/constants";

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: RouteErrorPage,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  const { pathname } = useLocation();

  if (['/', '/login', '/register'].includes(pathname.replace(/\/+$/, '') || '/')) return <Outlet />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header routes={NAVIGATION_ITEMS} activePath={pathname} />

      <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <Sidebar routes={NAVIGATION_ITEMS} />

        <main className="min-w-0">
          <div className="mb-6 rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground shadow-sm">
            当前应用：
            <span className="font-medium text-slate-950">{APP_NAME}</span>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

