import { ArrowUpRight, Box, Check, ChevronDown, CircleDashed, GitBranch, Plus, Sparkles, Target, Zap } from 'lucide-react'

const features = [
  { number: '01', icon: Zap, title: '想法，快一步落地。', description: '从随手记录到清晰的任务，让灵感不再消失在对话里。', kind: 'capture' },
  { number: '02', icon: Target, title: '每一步，都有方向。', description: '用项目连接目标与日常，让整个团队朝同一个方向前进。', kind: 'plan' },
  { number: '03', icon: GitBranch, title: '协作，自然而然。', description: '把讨论、决策与进展放在一起，少一点切换，多一点专注。', kind: 'collaborate' },
]

export function FeatureSection() {
  return (
    <section className="orbit-features orbit-container" id="features" aria-labelledby="features-title"><div className="orbit-section-heading"><div><p className="orbit-eyebrow"><span />从想法，到交付</p><h2 id="features-title">好的工作，<br />本就应该顺畅发生。</h2></div><p>不必在工具之间来回切换。<br />用一个清晰的空间，承载团队的下一个大想法。</p></div><div className="orbit-feature-grid">{features.map(({ number, icon: Icon, title, description, kind }) => <article className="orbit-feature-card" key={number}><div className="feature-illustration" aria-hidden="true">{kind === 'capture' ? <div className="mini-command"><span><Plus size={13} />Create a new issue<kbd>C</kbd></span><strong>Every great product starts with an idea<span className="mini-cursor" /></strong><div><span className="mini-label"><CircleDashed size={10} />Backlog</span><span className="mini-label">Product</span><span className="mini-create"><ArrowUpRight size={12} /></span></div></div> : kind === 'plan' ? <div className="mini-roadmap"><span>Product roadmap<ChevronDown size={10} /></span><div className="mini-months"><span>OCT</span><span>NOV</span><span>DEC</span></div><div className="mini-roadmap-bar"><Box size={11} />Workspace refresh</div><div className="mini-roadmap-bar second"><Sparkles size={11} />A new chapter</div><span className="mini-today" /></div> : <div className="mini-discussion"><div><span className="preview-avatar">JL</span><span><strong>Jamie Lee</strong><small>Just now</small></span><Check size={12} /></div><p>Small details. A big difference.<br />Looking good for the next release.</p><span className="mini-reaction"><Check size={10} />2</span><span className="mini-discussion-line" /></div>}</div><div className="feature-card-body"><span className="feature-number">{number}<Icon size={16} /></span><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
  )
}
