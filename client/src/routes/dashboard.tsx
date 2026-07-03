import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const dashboardSearchSchema = z.object({
  view: z.enum(['summary', 'users']).catch('summary'),
})

const stats = [
  { label: '页面', value: '3' },
  { label: '业务模块', value: '2' },
  { label: 'UI 组件', value: '2' },
]

export const Route = createFileRoute('/dashboard')({
  validateSearch: (search) => dashboardSearchSchema.parse(search),
  component: DashboardRoute,
})

function DashboardRoute() {
  const { view } = Route.useSearch()

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-950">仪表盘</h2>
        <p className="mt-2 text-muted-foreground">这是一个最小占位页面，用于展示文件路由。</p>
        <p className="mt-2 text-sm text-muted-foreground">
          当前视图由 zod 校验 URL 搜索参数：<span className="font-medium text-slate-950">{view}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">当前模板中的示例数量</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}