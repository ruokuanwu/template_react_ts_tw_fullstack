import { redirect, type LoaderFunctionArgs } from 'react-router'
import { getSession } from '@/features/auth/api'

export async function requireSession({ request }: LoaderFunctionArgs) {
  const { data, error } = await getSession()
  if (error) {
    throw new Response('无法读取会话，请稍后重试', { status: error.status || 503 })
  }
  if (!data) {
    const url = new URL(request.url)
    const returnTo = `${url.pathname}${url.search}`
    throw redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`)
  }
  return data
}
