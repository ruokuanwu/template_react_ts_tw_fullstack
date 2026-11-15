import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/features/auth/components/auth-page'
import { authSearchSchema, redirectAuthenticated } from '@/features/auth/navigation'

export const Route = createFileRoute('/login')({
  validateSearch: authSearchSchema,
  beforeLoad: redirectAuthenticated,
  staleTime: 0,
  preload: false,
  component: LoginPage,
})

function LoginPage() {
  const { returnTo } = Route.useSearch()
  return <AuthPage key="login" mode="login" returnTo={returnTo} />
}