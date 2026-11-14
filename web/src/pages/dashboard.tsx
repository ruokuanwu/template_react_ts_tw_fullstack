import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { helloQueryOptions } from '@/features/hello/queries';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dashboardSearchSchema = z.object({
  view: z.enum(['summary', 'users']).catch('summary'),
});

const stats = [
  { label: "页面", value: "3" },
  { label: "业务模块", value: "2" },
  { label: "UI 组件", value: "2" },
];

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const { view } = dashboardSearchSchema.parse({ view: searchParams.get('view') });
  const hello = useQuery(helloQueryOptions);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-950">仪表盘</h2>
        <p className="mt-2 text-muted-foreground">
          这是一个最小示例页面，用于展示 React Router 与 TanStack Query。
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          当前视图由 zod 校验 URL 搜索参数：
          <span className="font-medium text-slate-950">{view}</span>
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>服务端消息</CardTitle></CardHeader>
        <CardContent aria-live="polite" className="space-y-3">
          {hello.isPending ? <p>正在加载...</p> : hello.isError ? (
            <p role="alert">{hello.error.message}</p>
          ) : <p>{hello.data?.message ?? '暂无消息'}</p>}
          <button type="button" className="text-blue-600 underline" disabled={hello.isFetching} onClick={() => void hello.refetch()}>
            {hello.isFetching ? '刷新中...' : '刷新消息'}
          </button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              当前模板中的示例数量
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
