interface SidebarProps {
  routes: {
    path: string
    file: string
  }[]
}

export function Sidebar({ routes }: SidebarProps) {
  return (
    <aside className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-950">目录结构</h2>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {routes.map((route) => (
          <li key={route.path} className="rounded-md bg-muted px-3 py-2">
            {route.file}
          </li>
        ))}
      </ul>
    </aside>
  )
}
