import { z } from 'zod'

/**
 * 集中校验与导出前端运行时环境变量。
 * 仅暴露以 VITE_ 前缀开头的变量（Vite 约定），避免泄露敏感信息。
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000'),
  VITE_APP_NAME: z.string().default('Vite React shadcn Template'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('环境变量校验失败：', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

/**
 * 应用级配置。
 * 集中导出运行时环境变量与全局静态常量，全应用只暴露这一个配置对象。
 */
export const CONFIG = {
  name: parsed.data.VITE_APP_NAME,
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
