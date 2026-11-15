import { Link, type ErrorComponentProps } from '@tanstack/react-router'

export function RouteErrorPage({ error }: ErrorComponentProps) {
  const status = error !== null && typeof error === 'object' && 'status' in error && typeof error.status === 'number'
    ? error.status
    : undefined
  return (
    <section role="alert" className="space-y-4 p-8">
      <h2 className="text-2xl font-bold">页面加载失败</h2>
      <p>{status ? `请求失败（${status}）` : '请稍后刷新页面重试'}</p>
      <Link to="/" className="text-blue-600 underline">返回首页</Link>
    </section>
  )
}
