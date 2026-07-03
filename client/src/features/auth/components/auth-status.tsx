import { useAuth } from '../hooks/use-auth'

export function AuthStatus() {
  const { isAuthenticated } = useAuth()

  return (
    <span className="text-sm text-muted-foreground">
      {isAuthenticated ? '已登录' : '未登录'}
    </span>
  )
}
