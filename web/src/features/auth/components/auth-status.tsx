import { LogOut, UserRound } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { signOut } from "../api";
import { useAuth } from "../hooks/use-auth";

export function AuthStatus() {
  const navigate = useNavigate();
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
    await signOut();
    await navigate({ to: "/login" });
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
        title="退出登录"
      >
        <LogOut className="size-4" />
        <span className="sr-only">退出登录</span>
      </Button>
    </div>
  );
}
