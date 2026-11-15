import { useRef, useState, type FormEvent } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Brand } from '@/features/landing/components/brand'
import { refreshSession, signIn, signUp } from '../api'
import { safeReturnTo } from '../navigation'
import { authErrorMessage, loginSchema, registerSchema } from '../validation'
import '../auth.css'

export function AuthPage({ mode, returnTo }: { mode: 'login' | 'register'; returnTo?: string }) {
  const registering = mode === 'register'
  const router = useRouter()
  const queryClient = useQueryClient()
  const submitting = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    const parsed = (registering ? registerSchema : loginSchema).safeParse(values)
    setServerError('')
    setNotice('')
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) nextErrors[String(issue.path[0])] ??= issue.message
      setErrors(nextErrors)
      form.querySelector<HTMLInputElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus()
      return
    }
    setErrors({})
    submitting.current = true
    setIsSubmitting(true)
    try {
      const { email, password } = parsed.data
      const result = registering
        ? await signUp({ email, password, name: 'name' in parsed.data && typeof parsed.data.name === 'string' ? parsed.data.name : '' })
        : await signIn({ email, password })
      if (result.error) {
        setServerError(authErrorMessage(result.error))
        return
      }
      const session = await refreshSession()
      if (session.error) throw new Error('session unavailable')
      if (!session.data) {
        if (registering) setNotice('账户申请已提交。若需要验证邮箱，请检查收件箱完成验证后登录。')
        else setServerError('未能确认登录状态，请重新登录')
        return
      }
      await queryClient.cancelQueries()
      queryClient.clear()
      router.clearCache()
      await router.navigate({ href: safeReturnTo(returnTo) ?? '/dashboard', replace: true })
      await router.invalidate()
    } catch {
      setServerError('连接失败或会话暂不可用，请稍后重试')
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  function field(name: string, label: string, type: string, autoComplete: string, placeholder: string) {
    const password = type === 'password'
    return (
      <div className="auth-field">
        <label htmlFor={`auth-${name}`}>{label}</label>
        <div className="auth-input-wrap">
          <input id={`auth-${name}`} name={name} type={password && showPassword ? 'text' : type}
            autoComplete={autoComplete} placeholder={placeholder} required disabled={isSubmitting}
            aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `auth-${name}-error` : name === 'password' && registering ? 'auth-password-help' : undefined}
            onChange={() => { setErrors((current) => ({ ...current, [name]: '' })); setServerError('') }} />
          {name === 'password' && <button className="auth-password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? '隐藏密码' : '显示密码'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>}
        </div>
        {errors[name] && <p className="auth-field-error" id={`auth-${name}-error`}><AlertCircle size={13} />{errors[name]}</p>}
        {name === 'password' && registering && <p className="auth-help" id="auth-password-help">使用 8–128 个字符，建议混合字母、数字与符号。</p>}
      </div>
    )
  }

  return (
    <div className="orbit-auth">
      <header className="auth-header"><Link to="/" aria-label="Orbit 首页"><Brand /></Link><Link to="/" className="auth-back"><ArrowLeft size={14} />返回首页</Link></header>
      <main className="auth-main" id="main-content">
        <section className="auth-panel" aria-labelledby="auth-title">
          <p className="auth-eyebrow">专注创造，从这里开始</p>
          <h1 id="auth-title">{registering ? '创建 Orbit 账户' : '欢迎回到 Orbit'}</h1>
          <p className="auth-description">{registering ? '留出空间，给你的下一个好想法。' : '连接想法，继续推进值得创造的事情。'}</p>
          <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
            {registering && field('name', '显示名称', 'text', 'nickname', '你希望如何被称呼')}
            {field('email', '邮箱', 'email', 'email', 'you@example.com')}
            {field('password', '密码', 'password', registering ? 'new-password' : 'current-password', registering ? '创建一个安全的密码' : '输入你的密码')}
            {registering && field('confirmPassword', '确认密码', 'password', 'new-password', '再次输入密码')}
            {serverError && <div className="auth-message auth-error" role="alert"><AlertCircle size={16} /><span>{serverError}</span></div>}
            {notice && <div className="auth-message" role="status">{notice}</div>}
            <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 size={16} className="auth-spinner" />{registering ? '创建中…' : '登录中…'}</> : <>{registering ? '创建账户' : '登录'}<ArrowRight size={16} /></>}</button>
          </form>
          <p className="auth-switch">{registering ? '已有账户？' : '还没有账户？'}<Link to={registering ? '/login' : '/register'} search={{ returnTo }} disabled={isSubmitting}>{registering ? '登录' : '创建账户'}</Link></p>
        </section>
      </main>
      <footer className="auth-footer">Orbit · 少一些繁杂，多一些创造。</footer>
    </div>
  )
}
