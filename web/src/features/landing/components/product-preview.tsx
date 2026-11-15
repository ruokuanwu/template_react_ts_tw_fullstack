import { useState } from 'react'
import { Box, ChevronDown, ChevronRight, Circle, CircleCheck, CircleDashed, Command, Ellipsis, Flag, Inbox, Layers, LayoutGrid, Plus, Search, Settings2, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Brand } from '@/features/landing/components/brand'

const views = ['Overview', 'In progress', 'Completed'] as const
type PreviewView = typeof views[number]
const issues = [
  { id: 'ORB-142', title: 'A more thoughtful onboarding experience', done: false, label: 'Design', initials: 'JL' },
  { id: 'ORB-141', title: 'Build the command menu', done: false, label: 'Feature', initials: 'AK' },
  { id: 'ORB-140', title: 'Refine workspace navigation', done: false, label: 'Design', initials: 'SC' },
  { id: 'ORB-139', title: 'Connect your favorite tools', done: true, label: 'Integration', initials: 'JL' },
  { id: 'ORB-138', title: 'Make every interaction feel instant', done: true, label: 'Performance', initials: 'AK' },
]

export function ProductPreview() {
  const [view, setView] = useState<PreviewView>('Overview')
  const [query, setQuery] = useState('')
  const visibleIssues = issues.filter((issue) =>
    (view === 'Overview' || (view === 'Completed' ? issue.done : !issue.done))
    && issue.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="orbit-product" aria-label="Orbit 产品交互演示">
      <aside className="preview-sidebar" aria-label="演示工作区">
        <div className="preview-workspace"><Brand compact /><strong>Acme Studio</strong><ChevronDown size={12} /><span className="preview-avatar">JD</span></div>
        <div className="preview-sidebar-item"><Inbox size={14} />Inbox<span>4</span></div>
        <div className="preview-sidebar-item"><CircleDashed size={14} />My issues</div>
        <p className="preview-sidebar-label">Workspace</p>
        <div className="preview-sidebar-item"><Layers size={14} />Projects</div>
        <div className="preview-sidebar-item"><LayoutGrid size={14} />Views</div>
        <div className="preview-sidebar-item"><Ellipsis size={14} />More</div>
        <p className="preview-sidebar-label">Your teams <Plus size={12} /></p>
        <div className="preview-sidebar-item preview-team"><span className="team-icon"><Box size={12} /></span>Product<ChevronDown size={12} /></div>
        <div className="preview-sidebar-item preview-nested preview-selected"><CircleDashed size={14} />Issues</div>
        <div className="preview-sidebar-item preview-nested"><Target size={14} />Cycles</div>
        <div className="preview-sidebar-item preview-nested"><Layers size={14} />Projects</div>
        <div className="preview-sidebar-bottom"><span className="preview-avatar">JD</span>Jamie Davis<Settings2 size={14} /></div>
      </aside>
      <div className="preview-main">
        <div className="preview-breadcrumb"><span className="team-icon"><Box size={12} /></span>Product<ChevronRight size={12} /><span>Workspace refresh</span><span className="preview-breadcrumb-right"><span className="preview-avatar">JL</span><span className="preview-avatar">AK</span><Ellipsis size={16} /></span></div>
        <div className="preview-project-heading"><div className="preview-project-icon"><Box size={24} strokeWidth={1.4} /></div><h2>Workspace refresh</h2><p>A little less friction. A lot more flow.</p></div>
        <div className="preview-tabs" role="tablist" aria-label="演示任务状态">
          {views.map((item) => <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => setView(item)} className={cn('preview-tab', view === item && 'preview-tab-active')}>{item === 'Overview' && <LayoutGrid size={12} />}{item}</button>)}
          <span className="preview-demo-label">Interactive demo</span>
        </div>
        <div className="preview-content" role="tabpanel" aria-label={view}>
          <div className="preview-summary"><div><span className="preview-caption">Project status</span><p><span className="status-dot" />In progress<ChevronDown size={11} /></p></div><div><span className="preview-caption">Lead</span><p><span className="preview-avatar">JL</span>Jamie Lee</p></div><div><span className="preview-caption">Target date</span><p><Flag size={12} />Nov 28</p></div><div className="preview-progress"><span className="preview-caption">Progress <b>40%</b></span><span className="preview-progress-track"><span /></span></div></div>
          <div className="preview-issues-toolbar"><span><CircleDashed size={13} />{view === 'Overview' ? 'All issues' : view}<span className="preview-count">{visibleIssues.length}</span></span><label className="preview-search"><Search size={12} /><input aria-label="搜索演示任务" placeholder="Search issues…" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
          <div className="preview-issues">
            {visibleIssues.map((issue) => <div className="preview-issue" key={issue.id}><span className="preview-priority" aria-hidden="true">{issue.done ? '−' : '▂▄▆'}</span><span className="preview-issue-id">{issue.id}</span>{issue.done ? <CircleCheck size={14} className="issue-done" /> : <CircleDashed size={14} className="issue-active" />}<span className="preview-issue-title">{issue.title}</span><span className="preview-tag">{issue.label}</span><span className="preview-avatar">{issue.initials}</span></div>)}
            {visibleIssues.length === 0 && <p className="preview-empty">No matching issues. Try another search.</p>}
          </div>
          <div className="preview-activity"><span className="preview-avatar">JL</span><div><strong>Jamie Lee</strong> shared a project update<span>Everything is coming together. Ready for the next chapter.</span></div><span className="preview-activity-time">2h ago</span></div>
        </div>
        <div className="preview-statusbar"><span><Circle size={7} fill="currentColor" />All changes saved</span><span><Command size={10} /> Built for your flow</span></div>
      </div>
    </div>
  )
}

