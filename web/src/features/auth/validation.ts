import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('请输入有效的邮箱地址')),
  password: z.string().min(1, '请输入密码'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(1, '请输入显示名称').max(100, '显示名称不能超过 100 个字符'),
  email: z.string().trim().pipe(z.email('请输入有效的邮箱地址')),
  password: z.string().min(8, '密码至少需要 8 个字符').max(128, '密码不能超过 128 个字符'),
  confirmPassword: z.string().min(1, '请再次输入密码'),
}).refine((value) => value.password === value.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

export function authErrorMessage(error: { code?: string; status?: number }) {
  if (error.status === 429) return '操作过于频繁，请稍后再试'
  switch (error.code) {
    case 'INVALID_EMAIL_OR_PASSWORD':
    case 'INVALID_PASSWORD': return '邮箱或密码不正确'
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL': return '无法使用此邮箱创建账户，请尝试登录或使用其他邮箱'
    case 'EMAIL_NOT_VERIFIED': return '请先完成邮箱验证，再登录'
    case 'PASSWORD_TOO_SHORT': return '密码至少需要 8 个字符'
    case 'PASSWORD_TOO_LONG': return '密码不能超过 128 个字符'
    default: return '暂时无法完成操作，请稍后重试'
  }
}
