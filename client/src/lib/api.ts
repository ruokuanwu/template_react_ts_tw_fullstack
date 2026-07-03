import { CONFIG } from '@/config'

/** 拼接完整请求地址：相对路径（如 /api/...）经 Vite 代理，绝对路径直接使用。 */
function resolveUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  if (path.startsWith('/')) return path
  return `${CONFIG.apiBaseUrl}/${path}`
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(resolveUrl(path))

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
