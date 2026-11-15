import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { LogOut, Loader2 } from "lucide-react";
import { authClient } from "../auth-client";

export function AccountMenu({ onNavigate }: { onNavigate: () => void }) {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const logout = useMutation({
    mutationFn: async () => {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message || "Unable to log out. Please try again.");
    },
  });

  if (isPending) return <span role="status" aria-label="Checking account" className="text-muted-foreground"><Loader2 size={16} className="animate-spin" /></span>;

  return <div className="relative flex items-center gap-3 sm:gap-5">
    {session ? <>
      <Link to="/dashboard" onClick={onNavigate} className="max-w-24 truncate text-xs text-muted-foreground hover:text-white sm:max-w-36" title={session.user.email}>{session.user.name}</Link>
      <button onClick={() => logout.mutate()} disabled={logout.isPending} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white disabled:opacity-50">{logout.isPending ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}<span>Log out</span></button>
    </> : <>
      <Link to="/login" onClick={onNavigate} className="text-xs text-muted-foreground hover:text-white">Log in</Link>
      <Link to="/register" onClick={onNavigate} className="rounded-md bg-[#f7f8f8] px-3.5 py-2 text-xs font-semibold text-[#141516] hover:bg-white">Get started <span aria-hidden="true">↗</span></Link>
    </>}
    {(error || logout.isError) && <div role="alert" className="absolute right-0 top-10 z-50 w-64 rounded-lg border border-border bg-surface p-3 text-xs leading-5">{logout.isError ? logout.error.message : "Unable to check your session."}<button className="ml-2 underline" onClick={() => { if (logout.isError) logout.reset(); else void refetch(); }}>{logout.isError ? "Dismiss" : "Retry"}</button></div>}
  </div>;
}
