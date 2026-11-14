import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export function RouteErrorPage() {
  const error = useRouteError()
  return (
    <section role="alert" className="space-y-4 p-8">
      <h2 className="text-2xl font-bold">页面加载失败</h2>
      <p>{isRouteErrorResponse(error) ? `请求失败（${error.status}）` : '请稍后刷新页面重试'}</p>
      <Link to="/" className="text-blue-600 underline">返回首页</Link>
    </section>
  )
}
