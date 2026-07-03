import { DashboardPage } from '@/pages/dashboard'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import type { AppRoute } from '../types/index'

interface RouteRendererProps {
  activePath: string
  onNavigate: (path: string) => void
}

export const routes: AppRoute[] = [
  { id: 'home', path: '/', label: '首页' },
  { id: 'dashboard', path: '/dashboard', label: '仪表盘' },
  { id: 'login', path: '/login', label: '登录' },
]

export function RouteRenderer({ activePath, onNavigate }: RouteRendererProps) {
  switch (activePath) {
    case '/dashboard':
      return <DashboardPage />
    case '/login':
      return <LoginPage />
    default:
      return <HomePage onNavigate={onNavigate} />
  }
}
