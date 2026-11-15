import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Check, ChevronDown, ChevronRight, Circle, CircleDashed, Command, Inbox, Layers, LayoutGrid, List, MoreHorizontal, Orbit, Search, Settings2, X } from "lucide-react";
import { demoIssuesOptions, type IssueStatus } from "../demo-data";

const filters = ["All issues", "In progress", "Todo", "Done"] as const;
type Filter = (typeof filters)[number];

function StatusIcon({ status }: { status: IssueStatus }) {
  return status === "Done" ? <Check size={14} className="text-muted-foreground" /> : status === "In progress" ? <CircleDashed size={14} className="text-[#828fff]" /> : <Circle size={14} className="text-muted-foreground" />;
}

export function ProductPreview({ expanded = false }: { expanded?: boolean }) {
  const [filter, setFilter] = useState<Filter>("All issues");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data: issues = [], isPending, isError, refetch } = useQuery(demoIssuesOptions);
  const visible = issues.filter((issue) => (filter === "All issues" || issue.status === filter) && `${issue.id} ${issue.title}`.toLowerCase().includes(search.toLowerCase()));
  const selected = issues.find((issue) => issue.id === selectedId);
  useEffect(() => {
    if (selectedId) dialogRef.current?.showModal();
  }, [selectedId]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#34343a] bg-surface text-left ${expanded ? "min-h-[540px]" : ""}`}>
      <div className="flex min-h-[440px] sm:min-h-[470px]">
        <aside className="hidden w-[194px] shrink-0 border-r border-border bg-[#0c0d0e] p-4 md:block">
          <div className="mb-7 flex items-center gap-2 text-xs font-medium"><span className="rounded bg-primary p-1"><Orbit size={13} /></span> Orbit workspace <ChevronDown size={12} className="ml-auto text-muted-foreground" /></div>
          <div className="space-y-1 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2 rounded-md px-2 py-2"><Inbox size={14} /> Inbox <span className="ml-auto">3</span></div>
            <div className="flex items-center gap-2 rounded-md px-2 py-2"><Layers size={14} /> My issues</div>
            <p className="pb-2 pt-6 text-[10px]">Workspace</p>
            <div className="flex items-center gap-2 rounded-md px-2 py-2"><LayoutGrid size={14} /> Overview</div>
            <div className="flex items-center gap-2 rounded-md px-2 py-2"><Layers size={14} /> Projects</div>
            <p className="pb-2 pt-6 text-[10px]">Your teams</p>
            <div className="flex items-center gap-2 rounded-md px-2 py-2 text-white"><span className="flex h-4 w-4 items-center justify-center rounded bg-primary/30 text-[10px] text-[#a3abf4]">O</span> Orbit <ChevronDown size={12} className="ml-auto" /></div>
            <div className="ml-3 flex items-center gap-2 rounded-md bg-[#1c1d20] px-3 py-2 text-white"><CircleDashed size={13} /> Issues</div>
            <div className="ml-3 flex items-center gap-2 px-3 py-2"><Layers size={13} /> Cycles</div>
          </div>
          <div className="mt-16 flex items-center gap-2 text-[10px] text-muted-foreground"><Command size={12} /> A space for your best work</div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex h-12 items-center gap-2 border-b border-border px-4 text-[11px] sm:px-6"><span className="text-muted-foreground">Orbit</span><ChevronRight size={12} className="text-muted-foreground" /><span>Issues</span><span className="ml-auto flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[9px] text-muted-foreground"><span className="h-1 w-1 rounded-full bg-[#828fff]" /> DEMO WORKSPACE</span></div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-medium"><Layers size={16} /> Your next big thing <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground">{issues.length}</span></div>
            <span className="flex items-center gap-2 text-muted-foreground"><List size={15} /><Settings2 size={14} /></span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div role="group" aria-label="Filter issues by status" className="flex gap-1">{filters.map((item) => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)} className={`rounded px-2 py-1.5 text-[10px] transition-colors sm:px-2.5 ${filter === item ? "bg-[#252629] text-white" : "text-muted-foreground hover:bg-accent hover:text-white"}`}>{item}</button>)}</div>
            <label className="flex items-center gap-2 text-muted-foreground"><Search size={13} /><input aria-label="Search issues" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search issues…" className="w-28 bg-transparent py-1 text-[11px] outline-none placeholder:text-[#62666d] sm:w-32" /></label>
          </div>
          <div className="flex items-center gap-2 border-b border-border bg-[#141516] px-4 py-2 text-[10px] sm:px-6"><ChevronDown size={12} /><CircleDashed size={12} className="text-[#828fff]" />{filter === "All issues" ? "Current cycle" : filter}<span className="text-muted-foreground">{visible.length}</span><span className="ml-auto text-muted-foreground">Jun 10 – 24</span></div>
          {isPending && <p role="status" className="p-6 text-xs text-muted-foreground">Loading demo issues…</p>}
          {isError && <div role="alert" className="p-6 text-sm">Unable to load the demo. <button onClick={() => void refetch()} className="underline">Try again</button></div>}
          {!isPending && !isError && visible.length === 0 && <p role="status" className="p-8 text-center text-xs text-muted-foreground">No issues match your search.</p>}
          <div aria-live="polite">{visible.map((issue) => <button key={issue.id} onClick={() => setSelectedId(issue.id)} className="flex w-full items-center gap-3 border-b border-border/70 px-4 py-3.5 text-left text-[11px] transition-colors hover:bg-accent sm:px-6">
            <span aria-hidden="true" className="hidden h-3 items-end gap-0.5 sm:flex">{[1, 2, 3].map((bar) => <span key={bar} style={{ height: `${bar * 3 + 2}px` }} className={`w-0.5 rounded-sm ${bar <= issue.priority ? "bg-[#8a8f98]" : "bg-[#34343a]"}`} />)}</span>
            <span className="hidden w-14 shrink-0 font-mono text-[9px] text-muted-foreground sm:block">{issue.id}</span><StatusIcon status={issue.status} /><span className="min-w-0 flex-1 truncate">{issue.title}</span><span className="hidden rounded-full border border-border px-2 py-0.5 text-[9px] text-muted-foreground lg:block">{issue.label}</span><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#34343a] bg-[#252629] text-[7px] text-[#c6c8cf]">{issue.assignee}</span>
          </button>)}</div>
          <div className="flex items-center justify-between px-4 py-5 text-[10px] text-muted-foreground sm:px-6"><span className="flex items-center gap-1.5"><Check size={12} /> All changes saved locally</span><span className="flex items-center gap-1.5">Made for momentum <ArrowUpRight size={11} /></span></div>
        </div>
      </div>
      {selected && <dialog ref={dialogRef} role="dialog" aria-labelledby="issue-title" onCancel={() => setSelectedId(null)} className="fixed inset-0 m-auto w-[calc(100%-40px)] max-w-md rounded-xl border border-border bg-surface p-6 text-secondary-foreground backdrop:bg-canvas/90">
          <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground"><span>{selected.id} / Demo issue</span><button autoFocus aria-label="Close issue details" onClick={() => setSelectedId(null)}><X size={18} /></button></div>
          <h3 id="issue-title" className="mb-4 text-xl font-medium">{selected.title}</h3><p className="mb-6 text-sm leading-6 text-muted-foreground">A small, intentional step toward a better product. This is sample workspace data; no account or backend is required.</p>
          <div className="flex flex-wrap gap-3 text-xs"><span className="flex items-center gap-2 rounded border border-border px-3 py-2"><StatusIcon status={selected.status} />{selected.status}</span><span className="rounded border border-border px-3 py-2">{selected.label}</span><span className="rounded border border-border px-3 py-2">Assigned to {selected.assignee}</span></div>
          <button className="button-secondary mt-6 w-full" onClick={() => setSelectedId(null)}>Back to issues</button>
      </dialog>}
      <div className="pointer-events-none absolute right-4 top-3 text-muted-foreground/30" aria-hidden="true"><MoreHorizontal size={12} /></div>
    </div>
  );
}
