import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { guideSummaries } from '../data/siteContent'
import { tools } from '../utils/toolCatalog'

function toolLabel(id) {
  return tools.find(tool => tool.id === id)?.label || id
}

export default function Guides() {
  return (
    <div className="space-y-10 animate-fade-in">
      <header className="max-w-4xl space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-display"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <BookOpen size={14} />
          PDF guides
        </div>
        <h1 className="page-title text-4xl md:text-5xl">Practical document guides</h1>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Learn how to prepare, convert, compress, secure, and share PDF files with fewer mistakes.
        </p>
      </header>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {guideSummaries.map(guide => (
          <Link key={guide.slug} to={`/guides/${guide.slug}`} className="card p-6 group transition-transform hover:-translate-y-1">
            <p className="text-xs font-display font-semibold" style={{ color: 'var(--accent)' }}>
              {guide.readTime}
            </p>
            <h2 className="font-display font-bold text-xl mt-3" style={{ color: 'var(--text)' }}>
              {guide.title}
            </h2>
            <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
              {guide.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {guide.relatedTools.slice(0, 3).map(id => (
                <span key={id} className="px-2.5 py-1 rounded-md text-xs" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                  {toolLabel(id)}
                </span>
              ))}
            </div>
            <div className="mt-5 text-sm font-display font-semibold flex items-center gap-2" style={{ color: 'var(--accent)' }}>
              Read guide
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
