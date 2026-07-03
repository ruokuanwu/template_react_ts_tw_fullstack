import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AppRoute } from '../../types/index'

interface HeaderProps {
  routes: AppRoute[]
  activePath: string
  onNavigate: (path: string) => void
}

export function Header({ routes, activePath, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white/90 backdrop-blur">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-6 px-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Vite React App</p>
          <h1 className="text-lg font-bold text-slate-950">Frontend Template</h1>
        </div>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant={activePath === route.path ? 'default' : 'ghost'}
              size="sm"
              className={cn(activePath === route.path && 'shadow-sm')}
              onClick={() => onNavigate(route.path)}
            >
              {route.label}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}
