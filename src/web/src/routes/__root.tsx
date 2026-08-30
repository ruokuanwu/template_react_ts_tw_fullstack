import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { navigationItems } from "@/config";
import { APP_NAME } from "@/lib/constants";

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header routes={navigationItems} activePath={pathname} />

      <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <Sidebar routes={navigationItems} />

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

export const Route = createRootRoute({
  component: RootLayout,
});
