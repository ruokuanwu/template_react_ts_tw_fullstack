import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Check, ChevronRight, CircleCheck, CircleDashed, Command, Ellipsis, Layers, Zap } from 'lucide-react'
import { Brand } from '@/features/landing/components/brand'
import { FeatureSection } from '@/features/landing/components/feature-section'
import { LandingHeader } from '@/features/landing/components/landing-header'
import { ProductPreview } from '@/features/landing/components/product-preview'
import '@/features/landing/landing.css'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="orbit-landing" id="top">
      <a className="orbit-skip-link" href="#main-content">跳转到主要内容</a>
      <LandingHeader />
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
        <FeatureSection />
        <section className="orbit-workflow orbit-container" id="workflow" aria-labelledby="workflow-title"><div className="workflow-copy"><p className="orbit-eyebrow"><span />少一点管理，多一点创造</p><h2 id="workflow-title">让工具退后。<br /><span>让创造向前。</span></h2><p>好的工具，不应该成为工作的主角。<br />它安静地连接每一个细节，让团队把注意力<br className="desktop-break" />留给真正重要的事情。</p><a href="#product" className="orbit-text-link">体验更专注的工作方式<ArrowRight size={14} /></a></div><div className="workflow-panel"><div className="workflow-panel-top"><span><span className="status-dot" />一个清晰的工作日</span><Ellipsis size={18} /></div>{[{ icon: CircleDashed, title: '捕捉一个想法', detail: '给灵感一个开始的地方', shortcut: 'C' }, { icon: Layers, title: '规划下一步', detail: '把目标拆成看得见的进展', shortcut: 'P' }, { icon: CircleCheck, title: '交付值得骄傲的作品', detail: '一起把好的事情做出来', shortcut: '↵' }].map(({ icon: Icon, title, detail, shortcut }, index) => <div className="workflow-step" key={title}><span className="workflow-step-icon"><Icon size={18} /></span><div><strong>{title}</strong><p>{detail}</p></div><kbd>{shortcut}</kbd>{index < 2 && <span className="workflow-connector" />}</div>)}<div className="workflow-panel-bottom"><Check size={12} />Everything in its right place.</div></div></section>
        <section className="orbit-closing orbit-container"><span className="closing-mark"><Brand compact /></span><p className="orbit-eyebrow">留出空间，给下一个好想法。</p><h2>更好的产品，<br className="mobile-break" />从这里开始。</h2><Link to="/dashboard" search={{ view: 'summary' }} className="orbit-button orbit-button-light">开始使用 Orbit<ArrowRight size={15} /></Link><a href="#top" className="orbit-back-top">回到顶部<ArrowDown size={12} /></a></section>
      </main>
      <footer className="orbit-footer orbit-container"><a href="#top" aria-label="Orbit 首页"><Brand /></a><span>为创造者，留出更多创造的空间。</span><nav aria-label="页脚导航"><a href="#product">产品</a><a href="#features">功能</a><Link to="/login" search={{}}>登录<ArrowUpRight size={12} /></Link></nav><small>© {new Date().getFullYear()} Orbit</small></footer>
    </div>
  )
}
