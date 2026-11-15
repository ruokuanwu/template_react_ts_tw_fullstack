import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/features/auth/components/auth-page'
import { authSearchSchema, redirectAuthenticated } from '@/features/auth/navigation'

export const Route = createFileRoute('/register')({
  validateSearch: authSearchSchema,
  beforeLoad: redirectAuthenticated,
  staleTime: 0,
  preload: false,
  component: RegisterPage,
})

function RegisterPage() {
  const { returnTo } = Route.useSearch()
  return <AuthPage key="register" mode="register" returnTo={returnTo} />
}
