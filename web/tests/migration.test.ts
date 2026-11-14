import { afterEach, describe, expect, spyOn, test } from 'bun:test'
import { QueryClient } from '@tanstack/react-query'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'

process.env.VITE_API_BASE_URL = 'http://localhost:3000'
const authApi = await import('../src/features/auth/api')
const { requireSession } = await import('../src/router/loaders')
const { getHello } = await import('../src/features/hello/api')
const { DashboardPage } = await import('../src/pages/dashboard')

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

function loaderArgs() {
  return { request: new Request('http://localhost/dashboard?view=users'), params: {}, context: undefined, unstable_pattern: '/dashboard' }
}

describe('router migration', () => {
  test('preserves valid search values and defaults invalid values', () => {
    for (const [url, expected] of [
      ['/dashboard?view=users', 'users'],
      ['/dashboard?view=summary', 'summary'],
      ['/dashboard?view=invalid', 'summary'],
      ['/dashboard', 'summary'],
    ]) {
      const client = new QueryClient()
      try {
        const html = renderToStaticMarkup(
          createElement(QueryClientProvider, { client },
            createElement(MemoryRouter, { initialEntries: [url] }, createElement(DashboardPage)),
          ),
        )
        expect(html).toContain(`>${expected}</span>`)
      } finally {
        client.clear()
      }
    }
  })

  test('redirects guests and preserves the target URL', async () => {
    const session = spyOn(authApi, 'getSession').mockResolvedValue({ data: null, error: null })
    try {
      await requireSession(loaderArgs())
      throw new Error('Expected redirect')
    } catch (error) {
      expect(error).toBeInstanceOf(Response)
      const response = error as Response
      expect(response.status).toBe(302)
      expect(response.headers.get('location')).toBe('/login?returnTo=%2Fdashboard%3Fview%3Dusers')
    } finally {
      session.mockRestore()
    }
  })

  test('does not disguise session failures as logged-out state', async () => {
    const session = spyOn(authApi, 'getSession').mockResolvedValue({ data: null, error: { status: 503, statusText: 'Unavailable', message: 'Unavailable' } })
    try {
      await expect(requireSession(loaderArgs())).rejects.toMatchObject({ status: 503 })
    } finally {
      session.mockRestore()
    }
  })
})

describe('query integration', () => {
  test('reads the existing hello endpoint through Eden', async () => {
    let requestedUrl = ''
    globalThis.fetch = (async (input: string | URL | Request) => {
      requestedUrl = String(input)
      return Response.json({ message: 'Hello from Elysia!', timestamp: '2026-11-15' })
    }) as typeof fetch
    expect((await getHello())?.message).toBe('Hello from Elysia!')
    expect(requestedUrl).toEndWith('/api/hello')
  })

  test('throws on HTTP failure so Query can report an error', async () => {
    globalThis.fetch = (async () => Response.json({ message: 'Unavailable' }, { status: 503 })) as typeof fetch
    await expect(getHello()).rejects.toThrow('获取服务端消息失败')
  })

  test('reuses fresh cached data and removes it on clear', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } })
    let calls = 0
    const options = { queryKey: ['example'], queryFn: async () => ++calls }
    expect(await client.fetchQuery(options)).toBe(1)
    expect(await client.fetchQuery(options)).toBe(1)
    await client.cancelQueries()
    client.clear()
    expect(client.getQueryData(['example'])).toBeUndefined()
  })
})
