import { LogOut, UserRound } from "lucide-react";
import { useState } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { signOut } from "../api";
import { useAuth } from "../hooks/use-auth";

export function AuthStatus() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <span className="text-sm text-muted-foreground">正在读取会话...</span>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      const { error } = await signOut();
      if (error) throw new Error('退出失败，请重试');
      await queryClient.cancelQueries();
      queryClient.clear();
      router.clearCache();
      await navigate({ to: '/login', search: {}, replace: true });
      await router.invalidate();
    } catch {
      setSignOutError('退出失败，请重试');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
        <UserRound className="size-4" />
        {user.name}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        disabled={isSigningOut}
        title="退出登录"
      >
        <LogOut className="size-4" />
        <span className="sr-only">退出登录</span>
      </Button>
      {signOutError && <span role="alert" className="text-sm text-red-600">{signOutError}</span>}
    </div>
  );
}
