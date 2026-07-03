import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { APP_NAME } from '@/lib/constants'
import type { AppRoute } from '@/types'

const routes: AppRoute[] = [
  { id: 'index', path: '/', label: '首页', file: 'src/routes/index.tsx' },
  { id: 'dashboard', path: '/dashboard', label: '仪表盘', file: 'src/routes/dashboard.tsx' },
  { id: 'login', path: '/login', label: '登录', file: 'src/routes/login.tsx' },
]

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <div className="min-h-screen bg-slate-50">
      <Header routes={routes} activePath={pathname} />

      <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <Sidebar routes={routes} />

        <main className="min-w-0">
          <div className="mb-6 rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground shadow-sm">
            当前应用：<span className="font-medium text-slate-950">{APP_NAME}</span>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})