import { useEffect, useRef, useState } from "react";
import { getRouteApi, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight, ChevronUp, LayoutDashboard, Loader2, LogOut, Menu, Orbit, Settings, UserRound, X } from "lucide-react";
import { authClient } from "@/features/auth/auth-client";
import { ThemeContext, type Theme } from "@/features/settings/theme-context";

function readTheme(): { theme: Theme; error: string | null } {
  try {
    return { theme: localStorage.getItem("orbit-dashboard-theme") === "light" ? "light" : "dark", error: null };
  } catch (error) {
    console.error("Unable to read dashboard theme preference", error);
    return { theme: "dark", error: "Your browser blocked saved preferences. Theme changes will only apply to this visit." };
  }
}

export function DashboardLayout() {
  const { authenticatedSession: session } = getRouteApi("/dashboard").useRouteContext();
  const navigate = useNavigate();
  const [preference, setPreference] = useState(readTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logout = useMutation({
    mutationFn: async () => {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message || "Unable to log out. Please try again.");
    },
    onSuccess: async () => { await navigate({ to: "/login" }); },
  });

  useEffect(() => {
    function syncTheme(event: StorageEvent) {
      if (event.key === "orbit-dashboard-theme" || event.key === null) setPreference(readTheme());
    }
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setMenuOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenuOpen(false); triggerRef.current?.focus(); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [menuOpen]);

  function setTheme(theme: Theme) {
    let error: string | null = null;
    try { localStorage.setItem("orbit-dashboard-theme", theme); }
    catch (cause) {
      console.error("Unable to save dashboard theme preference", cause);
      error = "Theme applied, but your browser blocked saving it. It may reset after a refresh.";
    }
    setPreference({ theme, error });
  }

  const closeNavigation = () => { setMenuOpen(false); setSidebarOpen(false); };
  return (
    <ThemeContext.Provider value={{ theme: preference.theme, setTheme, storageError: preference.error }}>
      <div data-dashboard-theme={preference.theme} className="dashboard-theme min-h-dvh bg-canvas text-secondary-foreground">
        <a href="#dashboard-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:p-3 focus:text-white">Skip to content</a>
        {sidebarOpen && <button aria-label="Close navigation overlay" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/50 md:hidden" />}
        <aside id="dashboard-sidebar" aria-label="Workspace sidebar" onKeyDown={(event) => { if (event.key === "Escape") setSidebarOpen(false); }} className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-surface p-4 transition-transform md:visible md:translate-x-0 ${sidebarOpen ? "visible translate-x-0" : "invisible -translate-x-full"}`}>
          <div className="mb-9 flex h-11 items-center justify-between px-2"><Link to="/dashboard" onClick={closeNavigation} className="flex items-center gap-2.5 text-xl font-semibold tracking-tight"><Orbit size={27} className="text-primary" /> orbit<span className="ml-2 rounded border border-border px-1.5 py-0.5 text-[9px] font-normal tracking-wide text-muted-foreground">WORKSPACE</span></Link><button aria-label="Close navigation" className="text-muted-foreground md:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
          <p className="mb-3 px-3 text-[10px] font-medium tracking-widest text-muted-foreground">YOUR WORKSPACE</p>
          <nav aria-label="Workspace navigation" className="space-y-1">
            <Link to="/dashboard" activeOptions={{ exact: true }} onClick={closeNavigation} className="dashboard-nav" activeProps={{ className: "dashboard-nav-active" }}><LayoutDashboard size={17} /> Overview</Link>
          </nav>
          <div className="mt-8 rounded-xl border border-border bg-muted p-4"><Orbit size={21} className="mb-3 text-primary" /><p className="text-xs font-medium">A little more momentum.</p><p className="mt-2 text-[11px] leading-5 text-muted-foreground">Make space for your next big idea. Start with one small step.</p><Link to="/demo" className="mt-4 inline-flex items-center gap-1 text-[11px] text-primary">Explore the demo <ArrowUpRight size={12} /></Link></div>
          <div ref={menuRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false); }} className="relative mt-auto border-t border-border pt-4">
            {menuOpen && <div id="dashboard-account-menu" className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-border bg-surface p-2 shadow-lg"><div className="border-b border-border px-3 py-3"><p className="truncate text-xs font-medium">{session.user.name}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">{session.user.email}</p></div><Link to="/dashboard/settings" onClick={closeNavigation} className="dashboard-nav mt-1"><Settings size={15} /> Settings</Link><button onClick={() => logout.mutate()} disabled={logout.isPending} className="dashboard-nav w-full disabled:opacity-50">{logout.isPending ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />} Log out</button>{logout.isError && <p role="alert" className="px-3 py-2 text-xs text-destructive">{logout.error.message}</p>}</div>}
            <button ref={triggerRef} aria-label="Open account menu" aria-expanded={menuOpen} aria-controls="dashboard-account-menu" onClick={() => setMenuOpen(!menuOpen)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-accent"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-primary"><UserRound size={18} /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{session.user.name}</span><span className="mt-1 block truncate text-[10px] text-muted-foreground">Personal account</span></span><ChevronUp size={14} className="text-muted-foreground" /></button>
          </div>
        </aside>
        <div className="min-w-0 md:pl-60">
          <header className="flex h-16 items-center justify-between border-b border-border px-5 sm:px-8"><div className="flex items-center gap-3"><button aria-label="Open navigation" aria-expanded={sidebarOpen} aria-controls="dashboard-sidebar" className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button><span className="text-xs text-muted-foreground">Workspace <span className="mx-2 text-border">/</span> Personal</span></div><Link to="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">Back to website <ArrowUpRight size={13} /></Link></header>
          <main id="dashboard-content" tabIndex={-1} className="mx-auto max-w-[1280px] p-5 outline-none sm:p-8 lg:p-12"><Outlet /></main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
