import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const loginSearchSchema = z.object({
  returnTo: z.string().refine((value) => {
    if (!value.startsWith('/') || value.includes('\\') || [...value].some((char) => char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127)) return false
    return new URL(value, 'https://app.local').origin === 'https://app.local'
  }).optional().catch(undefined),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  component: LoginPage,
})

function LoginPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>这是一个页面占位，后续可接入真实认证逻辑。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">邮箱输入框占位</div>
        <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">密码输入框占位</div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">登录</Button>
      </CardFooter>
    </Card>
  )
}