import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { toolGroups, tools } from '../utils/toolCatalog'

export default function Dashboard() {
  const [activeGroup, setActiveGroup] = useState('all')
  const { t } = useLanguage()
  const activeTools = activeGroup === 'all'
    ? tools
    : tools.filter(tool => tool.category === activeGroup)
  const visibleTools = activeTools

  return (
    <div className="animate-fade-in">
      <header className="mx-auto max-w-5xl py-8 text-center sm:py-12">
        <h1 className="hero-display-title text-4xl leading-tight sm:text-6xl" style={{ color: 'var(--text)' }}>
          {t('dashboard.title', 'All PDF Tools')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-muted)' }}>
          {t('dashboard.description', 'Convert, compress, edit, organize, secure, OCR, and extract content from PDF files.')}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[{ id: 'all', label: t('dashboard.allToolsFilter', 'All Tools') }, ...toolGroups].map(group => (
            <button
              key={group.id}
              type="button"
              className={activeGroup === group.id ? 'category-pill category-pill-active' : 'category-pill'}
              onClick={() => setActiveGroup(group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>
      </header>

      <section className="open-section py-8">
        <div className="tool-directory-grid">
          {visibleTools.map(tool => (
            <Link key={tool.id} to={tool.path} className="pdf-tool-card group">
              <span className="pdf-tool-icon" style={{ background: tool.bg, color: tool.color }}>
                <tool.icon size={24} />
              </span>
              <span className="pdf-tool-title">{tool.label}</span>
              <span className="pdf-tool-desc">{tool.desc}</span>
            </Link>
          ))}
        </div>

        {!visibleTools.length ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('dashboard.noTools', 'No tools match that search yet.')}
          </div>
        ) : null}
      </section>
    </div>
  )
}
