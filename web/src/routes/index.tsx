import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-100">Vite + React + shadcn/ui</p>
        <h2 className="mt-3 text-4xl font-bold">现代前端项目骨架</h2>
        <p className="mt-4 max-w-2xl text-sky-50">
          这里演示常见目录分层：文件路由、业务模块、通用组件、hooks、工具库、类型与静态资源。
        </p>
        <Button className="mt-6" variant="secondary" asChild>
          <Link to="/dashboard" search={{ view: 'summary' }}>
            查看仪表盘
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {['components/ui', 'features', 'lib'].map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>{item}</CardTitle>
              <CardDescription>常见前端代码分层</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              用简单占位内容展示目录职责，可按业务继续扩展。
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
