import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { Brand } from '@/features/landing/components/brand'

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="orbit-header"><div className="orbit-container orbit-header-inner">
        <a href="#top" aria-label="Orbit 首页"><Brand /></a>
        <nav className="orbit-desktop-nav" aria-label="主导航"><a href="#product">产品</a><a href="#features">功能</a><a href="#workflow">工作方式</a></nav>
        <div className="orbit-header-actions"><Link to="/login" search={{}} className="orbit-login">登录</Link><Link to="/dashboard" search={{ view: 'summary' }} className="orbit-button orbit-button-small orbit-button-light">开始使用<ArrowUpRight size={13} /></Link><button className="orbit-menu-button" type="button" aria-label={menuOpen ? '关闭导航' : '打开导航'} aria-expanded={menuOpen} aria-controls="orbit-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
      </div>{menuOpen && <nav id="orbit-mobile-menu" className="orbit-mobile-nav" aria-label="移动导航">{[['产品', '#product'], ['功能', '#features'], ['工作方式', '#workflow']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={14} /></a>)}<Link to="/login" search={{}}>登录<ArrowRight size={14} /></Link></nav>}</header>
  )
}
