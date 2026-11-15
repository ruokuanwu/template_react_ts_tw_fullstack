import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Box, Check,
  ChevronDown, ChevronRight, Circle, CircleCheck, CircleDashed,
  Command, Ellipsis, Flag, GitBranch, Inbox, Layers, LayoutGrid,
  Menu, Plus, Search, Settings2, Sparkles, Target, X, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import './landing-page.css'

const views = ['Overview', 'In progress', 'Completed'] as const
type PreviewView = typeof views[number]
const issues = [
  { id: 'ORB-142', title: 'A more thoughtful onboarding experience', done: false, label: 'Design', initials: 'JL' },
  { id: 'ORB-141', title: 'Build the command menu', done: false, label: 'Feature', initials: 'AK' },
  { id: 'ORB-140', title: 'Refine workspace navigation', done: false, label: 'Design', initials: 'SC' },
  { id: 'ORB-139', title: 'Connect your favorite tools', done: true, label: 'Integration', initials: 'JL' },
  { id: 'ORB-138', title: 'Make every interaction feel instant', done: true, label: 'Performance', initials: 'AK' },
]

function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="orbit-brand"><span className="orbit-mark" aria-hidden="true"><span /></span>{!compact && 'orbit'}</span>
}

function ProductPreview() {
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

const features = [
  { number: '01', icon: Zap, title: '想法，快一步落地。', description: '从随手记录到清晰的任务，让灵感不再消失在对话里。', kind: 'capture' },
  { number: '02', icon: Target, title: '每一步，都有方向。', description: '用项目连接目标与日常，让整个团队朝同一个方向前进。', kind: 'plan' },
  { number: '03', icon: GitBranch, title: '协作，自然而然。', description: '把讨论、决策与进展放在一起，少一点切换，多一点专注。', kind: 'collaborate' },
]

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="orbit-landing" id="top">
      <a className="orbit-skip-link" href="#main-content">跳转到主要内容</a>
      <header className="orbit-header"><div className="orbit-container orbit-header-inner">
        <a href="#top" aria-label="Orbit 首页"><Brand /></a>
        <nav className="orbit-desktop-nav" aria-label="主导航"><a href="#product">产品</a><a href="#features">功能</a><a href="#workflow">工作方式</a></nav>
        <div className="orbit-header-actions"><Link to="/login" search={{}} className="orbit-login">登录</Link><Link to="/dashboard" search={{ view: 'summary' }} className="orbit-button orbit-button-small orbit-button-light">开始使用<ArrowUpRight size={13} /></Link><button className="orbit-menu-button" type="button" aria-label={menuOpen ? '关闭导航' : '打开导航'} aria-expanded={menuOpen} aria-controls="orbit-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
      </div>{menuOpen && <nav id="orbit-mobile-menu" className="orbit-mobile-nav" aria-label="移动导航">{[['产品', '#product'], ['功能', '#features'], ['工作方式', '#workflow']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={14} /></a>)}<Link to="/login" search={{}}>登录<ArrowRight size={14} /></Link></nav>}</header>
      <main id="main-content">
        <section className="orbit-hero orbit-container" aria-labelledby="hero-title">
          <a href="#product" className="orbit-announcement"><span className="announcement-dot" />为更好的创造而设计<span className="announcement-divider" /><span>认识 Orbit</span><ArrowRight size={13} /></a>
          <h1 id="hero-title">让好想法，<br /><span>成为下一个好产品。</span></h1>
          <p className="orbit-hero-description">连接想法、项目与每一次推进。<br />为认真打造产品的团队，创造更专注的工作方式。</p>
          <div className="orbit-hero-actions"><Link to="/dashboard" search={{ view: 'summary' }} className="orbit-button orbit-button-primary">开始使用 Orbit<ArrowRight size={15} /></Link><a href="#product" className="orbit-text-link">探索产品<ChevronRight size={15} /></a></div>
          <p className="orbit-hero-note"><span />少一些繁杂。多一些创造。</p>
          <div className="orbit-product-stage" id="product"><div className="orbit-stage-caption"><span><span className="caption-square" />YOUR NEXT GREAT THING STARTS HERE</span><span>01 / PRODUCT</span></div><ProductPreview /></div>
        </section>
        <section className="orbit-principles orbit-container" aria-label="产品理念"><p>不是更多工具。<br /><strong>是更好的工作节奏。</strong></p><div><span><Zap size={18} />为速度而生</span><span><Layers size={18} />让复杂变简单</span><span><AudioLines size={18} />与团队同频</span><span><Command size={18} />细节恰到好处</span></div></section>
        <section className="orbit-features orbit-container" id="features" aria-labelledby="features-title"><div className="orbit-section-heading"><div><p className="orbit-eyebrow"><span />从想法，到交付</p><h2 id="features-title">好的工作，<br />本就应该顺畅发生。</h2></div><p>不必在工具之间来回切换。<br />用一个清晰的空间，承载团队的下一个大想法。</p></div><div className="orbit-feature-grid">{features.map(({ number, icon: Icon, title, description, kind }) => <article className="orbit-feature-card" key={number}><div className="feature-illustration" aria-hidden="true">{kind === 'capture' ? <div className="mini-command"><span><Plus size={13} />Create a new issue<kbd>C</kbd></span><strong>Every great product starts with an idea<span className="mini-cursor" /></strong><div><span className="mini-label"><CircleDashed size={10} />Backlog</span><span className="mini-label">Product</span><span className="mini-create"><ArrowUpRight size={12} /></span></div></div> : kind === 'plan' ? <div className="mini-roadmap"><span>Product roadmap<ChevronDown size={10} /></span><div className="mini-months"><span>OCT</span><span>NOV</span><span>DEC</span></div><div className="mini-roadmap-bar"><Box size={11} />Workspace refresh</div><div className="mini-roadmap-bar second"><Sparkles size={11} />A new chapter</div><span className="mini-today" /></div> : <div className="mini-discussion"><div><span className="preview-avatar">JL</span><span><strong>Jamie Lee</strong><small>Just now</small></span><Check size={12} /></div><p>Small details. A big difference.<br />Looking good for the next release.</p><span className="mini-reaction"><Check size={10} />2</span><span className="mini-discussion-line" /></div>}</div><div className="feature-card-body"><span className="feature-number">{number}<Icon size={16} /></span><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
        <section className="orbit-workflow orbit-container" id="workflow" aria-labelledby="workflow-title"><div className="workflow-copy"><p className="orbit-eyebrow"><span />少一点管理，多一点创造</p><h2 id="workflow-title">让工具退后。<br /><span>让创造向前。</span></h2><p>好的工具，不应该成为工作的主角。<br />它安静地连接每一个细节，让团队把注意力<br className="desktop-break" />留给真正重要的事情。</p><a href="#product" className="orbit-text-link">体验更专注的工作方式<ArrowRight size={14} /></a></div><div className="workflow-panel"><div className="workflow-panel-top"><span><span className="status-dot" />一个清晰的工作日</span><Ellipsis size={18} /></div>{[{ icon: CircleDashed, title: '捕捉一个想法', detail: '给灵感一个开始的地方', shortcut: 'C' }, { icon: Layers, title: '规划下一步', detail: '把目标拆成看得见的进展', shortcut: 'P' }, { icon: CircleCheck, title: '交付值得骄傲的作品', detail: '一起把好的事情做出来', shortcut: '↵' }].map(({ icon: Icon, title, detail, shortcut }, index) => <div className="workflow-step" key={title}><span className="workflow-step-icon"><Icon size={18} /></span><div><strong>{title}</strong><p>{detail}</p></div><kbd>{shortcut}</kbd>{index < 2 && <span className="workflow-connector" />}</div>)}<div className="workflow-panel-bottom"><Check size={12} />Everything in its right place.</div></div></section>
        <section className="orbit-closing orbit-container"><span className="closing-mark"><Brand compact /></span><p className="orbit-eyebrow">留出空间，给下一个好想法。</p><h2>更好的产品，<br className="mobile-break" />从这里开始。</h2><Link to="/dashboard" search={{ view: 'summary' }} className="orbit-button orbit-button-light">开始使用 Orbit<ArrowRight size={15} /></Link><a href="#top" className="orbit-back-top">回到顶部<ArrowDown size={12} /></a></section>
      </main>
      <footer className="orbit-footer orbit-container"><a href="#top" aria-label="Orbit 首页"><Brand /></a><span>为创造者，留出更多创造的空间。</span><nav aria-label="页脚导航"><a href="#product">产品</a><a href="#features">功能</a><Link to="/login" search={{}}>登录<ArrowUpRight size={12} /></Link></nav><small>© {new Date().getFullYear()} Orbit</small></footer>
    </div>
  )
}
