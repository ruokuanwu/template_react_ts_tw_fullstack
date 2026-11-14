import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts/root-layout'
import { RouteErrorPage } from '@/pages/route-error'
import { requireSession } from './loaders'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: RouteErrorPage,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('@/pages/home')).HomePage }) },
      { path: 'login', lazy: async () => ({ Component: (await import('@/pages/login')).LoginPage }) },
      {
        loader: requireSession,
        ErrorBoundary: RouteErrorPage,
        children: [
          { path: 'dashboard', lazy: async () => ({ Component: (await import('@/pages/dashboard')).DashboardPage }) },
        ],
      },
      { path: '*', lazy: async () => ({ Component: (await import('@/pages/not-found')).NotFoundPage }) },
    ],
  },
])
