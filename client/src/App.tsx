import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { routes, RouteRenderer } from '@/routes'
import { APP_NAME } from '@/lib/constants'

function App() {
  const [activePath, setActivePath] = useState('/')

  return (
    <div className="min-h-screen bg-slate-50">
      <Header routes={routes} activePath={activePath} onNavigate={setActivePath} />

      <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <Sidebar routes={routes} />

        <main className="min-w-0">
          <div className="mb-6 rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground shadow-sm">
            当前应用：<span className="font-medium text-slate-950">{APP_NAME}</span>
          </div>
          <RouteRenderer activePath={activePath} onNavigate={setActivePath} />
        </main>
      </div>
    </div>
  )
}

export default App
