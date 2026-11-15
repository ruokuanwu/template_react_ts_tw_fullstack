export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="orbit-brand"><span className="orbit-mark" aria-hidden="true"><span /></span>{!compact && 'orbit'}</span>
}

