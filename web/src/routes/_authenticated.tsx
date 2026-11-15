import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSession } from '@/features/auth/api'
import { RouteErrorPage } from '@/components/layout/route-error'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { data, error } = await getSession()
    if (error) {
      throw Object.assign(new Error('无法读取会话，请稍后重试'), { status: error.status || 503 })
    }
    if (!data) {
      throw redirect({ to: '/login', search: { returnTo: location.href }, replace: true })
    }
    return { session: data }
  },
  staleTime: 0,
  preload: false,
  errorComponent: RouteErrorPage,
  component: Outlet,
})
