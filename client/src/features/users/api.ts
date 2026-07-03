import type { UserSummary } from './types'

export async function listUsers(): Promise<UserSummary[]> {
  return Promise.resolve([
    { id: '1', name: 'Demo User', email: 'demo@example.com' },
  ])
}
