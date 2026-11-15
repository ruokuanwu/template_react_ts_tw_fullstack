import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">页面不存在</h2>
      <Link to="/" className="text-blue-600 underline">返回首页</Link>
    </section>
  )
}
