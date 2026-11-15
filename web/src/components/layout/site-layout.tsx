import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, Orbit, X } from "lucide-react";
import { AccountMenu } from "@/features/auth/components/account-menu";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur-md">
      <div className="page-container flex h-16 items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 text-xl font-semibold tracking-tight" aria-label="Orbit home">
          <Orbit size={25} className="text-[#828fff]" strokeWidth={1.6} /> orbit
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[13px] text-muted-foreground md:flex">
          <a href="/#product" className="hover:text-white">Product</a>
          <a href="/#workflow" className="hover:text-white">Why Orbit</a>
          <a href="/#pricing" className="hover:text-white">Pricing</a>
          <a href="/#questions" className="hover:text-white">Resources</a>
        </nav>
        <div className="flex items-center gap-5">
          <AccountMenu onNavigate={() => setOpen(false)} />
          <button className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {open && <nav id="mobile-nav" aria-label="Mobile navigation" className="page-container flex flex-col gap-5 border-t border-border py-6 text-sm md:hidden">
        {[['Product', 'product'], ['Why Orbit', 'workflow'], ['Pricing', 'pricing'], ['Resources', 'questions']].map(([label, hash]) => <a key={hash} href={`/#${hash}`} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="page-container flex flex-col justify-between gap-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <Link to="/" className="flex items-center gap-2 text-base font-medium text-white"><Orbit size={21} /> orbit <span className="ml-4 text-xs font-normal text-muted-foreground">A little less friction. A lot more progress.</span></Link>
        <div className="flex items-center gap-6"><span>© {new Date().getFullYear()} Orbit</span><a href="/#questions" className="flex items-center gap-1 hover:text-white">Built with intention <ArrowUpRight size={13} /></a></div>
      </div>
    </footer>
  );
}
