import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="max-w-3xl space-y-6 animate-fade-in">
      <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>404</p>
      <h1 className="page-title text-4xl md:text-5xl">Page not found</h1>
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        The page you opened may have moved, or the link may be incomplete. Use the tools directory or guides to keep going.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/tools" className="btn-primary">
          Open tools
          <ArrowRight size={16} />
        </Link>
        <Link to="/guides" className="btn-secondary">
          Browse guides
        </Link>
      </div>
    </section>
  )
}
