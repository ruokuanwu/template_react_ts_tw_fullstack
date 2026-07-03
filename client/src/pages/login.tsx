import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginPage() {
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
