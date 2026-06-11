import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { trustPages } from '../data/trustPages'
import { siteInfo } from '../data/siteContent'

export default function InfoPage({ pageKey }) {
  const page = trustPages[pageKey]

  if (!page) {
    return (
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>Page not found</p>
        <h1 className="page-title">This page is not available</h1>
        <Link to="/" className="btn-primary">Return home</Link>
      </div>
    )
  }

  return (
    <article id={pageKey} className="max-w-4xl space-y-8 animate-fade-in">
      <header className="space-y-4">
        <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>
          {page.eyebrow}
        </p>
        <h1 className="page-title text-4xl md:text-5xl">{page.title}</h1>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {page.intro}
        </p>
      </header>

      <div className="space-y-5">
        {page.sections.map(section => (
          <section key={section.heading} className="card p-6 space-y-3">
            <h2 className="section-title text-2xl">{section.heading}</h2>
            {section.body.map(paragraph => (
              <p key={paragraph} className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <section className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="section-title">Need help?</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Contact {siteInfo.name} at {siteInfo.contactEmail}.
          </p>
        </div>
        <Link to="/contact" className="btn-secondary">
          Contact
          <ArrowRight size={16} />
        </Link>
      </section>
    </article>
  )
}
