import { afterEach, describe, expect, spyOn, test } from 'bun:test'
import { QueryClient } from '@tanstack/react-query'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'

process.env.VITE_API_BASE_URL = 'http://localhost:3000'
const authApi = await import('../src/features/auth/api')
const { routeTree } = await import('../src/routeTree.gen')
const { getHello } = await import('../src/features/hello/api')

const authenticatedSession = {
  session: { id: 'session', userId: 'user', token: 'token', expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  user: { id: 'user', name: 'Test', email: 'test@example.com', emailVerified: true, createdAt: new Date(), updatedAt: new Date() },
}

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

function testRouter(url: string) {
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
    defaultPreload: false,
    isServer: false,
    origin: 'http://localhost',
  })
}

describe('router migration', () => {
  test('renders the standalone landing with product preview and working destinations', async () => {
    const router = testRouter('/')
    const client = new QueryClient()
    try {
      await router.load()
      const html = renderToStaticMarkup(
        createElement(QueryClientProvider, { client }, createElement(RouterProvider, { router })),
      )
      expect(html).toContain('成为下一个好产品。')
      expect(html).toContain('Orbit 产品交互演示')
      expect(html).toContain('aria-selected="true"')
      expect(html).toContain('href="#features"')
      expect(html).toContain('href="/dashboard?view=summary"')
      expect(html).toContain('href="/login"')
      expect(html).not.toContain('当前应用：')
    } finally {
      client.clear()
      router.clearCache()
    }
  })

  test('preserves valid search values and defaults invalid values', async () => {
    const session = spyOn(authApi, 'getSession').mockResolvedValue({ data: authenticatedSession, error: null })
    try {
      for (const [url, expected] of [
        ['/dashboard?view=users', 'users'],
        ['/dashboard?view=summary', 'summary'],
        ['/dashboard?view=invalid', 'summary'],
        ['/dashboard', 'summary'],
      ]) {
        const client = new QueryClient()
        const router = testRouter(url)
        try {
          await router.load()
          expect(router.state.matches.at(-1)?.search).toEqual({ view: expected })
          const html = renderToStaticMarkup(
            createElement(QueryClientProvider, { client }, createElement(RouterProvider, { router })),
          )
          expect(html).toContain(`>${expected}</span>`)
        } finally {
          client.clear()
          router.clearCache()
        }
      }
    } finally {
      session.mockRestore()
    }
  })

  test('redirects guests and preserves the target URL', async () => {
    const session = spyOn(authApi, 'getSession').mockResolvedValue({ data: null, error: null })
    try {
      const router = testRouter('/dashboard?view=users')
      await router.load()
      expect(router.state.location.pathname).toBe('/login')
      expect(router.state.location.search.returnTo).toBe('/dashboard?view=users')
    } finally {
      session.mockRestore()
    }
  })

  test('does not disguise session failures as logged-out state', async () => {
    const session = spyOn(authApi, 'getSession').mockResolvedValue({ data: null, error: { status: 503, statusText: 'Unavailable', message: 'Unavailable' } })
    try {
      const router = testRouter('/dashboard')
      await router.load()
      expect(router.state.location.pathname).toBe('/dashboard')
      expect(router.state.matches.find((match) => match.status === 'error')?.error).toMatchObject({ status: 503 })
      expect(router.state.matches.find((match) => match.status === 'error')?.routeId).toBe('/_authenticated')
    } finally {
      session.mockRestore()
    }
  })

  test('rechecks authentication after sign-out and cache invalidation', async () => {
    const session = spyOn(authApi, 'getSession').mockResolvedValue({ data: authenticatedSession, error: null })
    try {
      const router = testRouter('/dashboard')
      await router.load()
      expect(router.state.matches.at(-1)?.status).toBe('success')
      session.mockResolvedValue({ data: null, error: null })
      router.clearCache()
      await router.navigate({ to: '/login', search: {}, replace: true })
      await router.invalidate()
      await router.navigate({ to: '/dashboard', search: { view: 'summary' } })
      expect(router.state.location.pathname).toBe('/login')
      expect(router.state.matches.some((match) => 'session' in match.context)).toBe(false)
    } finally {
      session.mockRestore()
    }
  })

  test('matches unknown paths as not found', async () => {
    const router = testRouter('/missing-page')
    await router.load()
    const client = new QueryClient()
    try {
      const html = renderToStaticMarkup(
        createElement(QueryClientProvider, { client }, createElement(RouterProvider, { router })),
      )
      expect(html).toContain('页面不存在')
    } finally {
      client.clear()
    }
  })

  test('accepts only safe local return targets', async () => {
    for (const returnTo of ['/dashboard?view=users', 'https://example.com', '//example.com', '/\\\\example.com', '/\n/example.com']) {
      const router = testRouter(`/login?returnTo=${encodeURIComponent(returnTo)}`)
      await router.load()
      expect(router.state.matches.at(-1)?.search.returnTo).toBe(
        returnTo === '/dashboard?view=users' ? returnTo : undefined,
      )
    }
    const router = testRouter('/login')
    await router.load()
    expect(router.state.matches.at(-1)?.search.returnTo).toBeUndefined()
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
