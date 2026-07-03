import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { UserSummary } from '../types'

interface UserCardProps {
  user: UserSummary
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">用户卡片占位</CardContent>
    </Card>
  )
}
