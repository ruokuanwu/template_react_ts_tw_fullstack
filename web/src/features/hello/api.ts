import { apiClient } from '@/lib/api-client'

export async function getHello({ signal }: { signal?: AbortSignal } = {}) {
  const { data, error } = await apiClient.api.hello.get({ fetch: { signal } })
  if (error) throw new Error('获取服务端消息失败')
  return data
}
