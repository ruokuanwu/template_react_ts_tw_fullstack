import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { getSession } from './api'

export function safeReturnTo(value: string | undefined) {
  if (!value?.startsWith('/') || value.includes('\\') || [...value].some((char) => char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127)) return undefined
  try {
    const url = new URL(value, 'https://app.local')
    if (url.origin !== 'https://app.local' || ['/login', '/register'].includes(url.pathname.replace(/\/+$/, ''))) return undefined
    return value
  } catch {
    return undefined
  }
}

export const authSearchSchema = z.object({
  returnTo: z.string().transform(safeReturnTo).optional().catch(undefined),
})

export async function redirectAuthenticated({ search }: { search: { returnTo?: string } }) {
  const { data, error } = await getSession()
  if (error) throw Object.assign(new Error('无法读取会话，请稍后重试'), { status: error.status || 503 })
  if (data) throw redirect({ href: safeReturnTo(search.returnTo) ?? '/dashboard', replace: true })
}
