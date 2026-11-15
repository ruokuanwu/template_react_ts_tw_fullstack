import { describe, expect, test } from 'bun:test'
import { authErrorMessage, loginSchema, registerSchema } from '../src/features/auth/validation'
process.env.VITE_API_BASE_URL = 'http://localhost:3000'
const { safeReturnTo } = await import('../src/features/auth/navigation')

const credentials = { name: ' Creator ', email: ' creator@example.com ', password: ' secure password ', confirmPassword: ' secure password ' }

describe('authentication validation', () => {
  test('normalizes name and email without trimming passwords', () => {
    expect(registerSchema.parse(credentials)).toEqual({ ...credentials, name: 'Creator', email: 'creator@example.com' })
    expect(loginSchema.parse({ email: credentials.email, password: 'x' })).toEqual({ email: 'creator@example.com', password: 'x' })
  })

  test('requires matching passwords and registration limits', () => {
    for (const changes of [{ name: ' ' }, { email: 'invalid' }, { password: 'short', confirmPassword: 'short' }, { confirmPassword: 'different' }, { password: 'a'.repeat(129) }]) {
      expect(registerSchema.safeParse({ ...credentials, ...changes }).success).toBe(false)
    }
    expect(loginSchema.safeParse({ email: 'creator@example.com', password: '' }).success).toBe(false)
  })

  test('rejects external, malformed and recursive authentication destinations', () => {
    for (const target of ['https://example.com', '//example.com', '/\\example.com', '/\n/example.com', '/login', '/register?returnTo=/login', '/login/', undefined]) {
      expect(safeReturnTo(target)).toBeUndefined()
    }
    expect(safeReturnTo('/dashboard?view=users#section')).toBe('/dashboard?view=users#section')
  })

  test('maps authentication errors without exposing arbitrary server messages', () => {
    expect(authErrorMessage({ code: 'INVALID_EMAIL_OR_PASSWORD' })).toBe('邮箱或密码不正确')
    expect(authErrorMessage({ status: 429 })).toContain('频繁')
    expect(authErrorMessage({ code: 'EMAIL_NOT_VERIFIED' })).toContain('验证')
    expect(authErrorMessage({ code: 'UNKNOWN' })).toBe('暂时无法完成操作，请稍后重试')
  })
})
