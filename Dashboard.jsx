import { Link } from 'react-router-dom'
import { toolCategories, tools } from './utils/toolCatalog'

export default function Dashboard() {
  const groupedTools = toolCategories.map(category => ({
    ...category,
    tools: tools.filter(tool => tool.category === category.id),
  }))

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-display"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          Tool Directory
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-3">
            <h1 className="page-title text-4xl md:text-5xl leading-tight">
              Browse all 19 PDF tools
            </h1>
            <p className="text-base max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Organize, convert, secure, and refine documents with local processing, live file previews, OCR, and batch workflows.
            </p>
          </div>
          <Link to="/" className="btn-secondary">
            Back to landing page
          </Link>
        </div>
      </div>

      {groupedTools.map((category, groupIndex) => (
        <section key={category.id} id={category.id} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>
                {category.label}
              </p>
              <h2 className="section-title">{category.description}</h2>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {category.tools.length} tools
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.tools.map((tool, toolIndex) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="card group p-5 flex flex-col gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-1"
                style={{ animationDelay: `${(groupIndex * 4 + toolIndex) * 40}ms`, '--hover-shadow': '0 8px 30px rgba(0,0,0,0.1)' }}
                onMouseEnter={event => { event.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)' }}
                onMouseLeave={event => { event.currentTarget.style.boxShadow = 'var(--shadow)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ background: tool.bg, color: tool.color }}>
                  <tool.icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{tool.label}</h3>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold font-display transition-colors" style={{ color: tool.color }}>
                  Open tool
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="border-t pt-8" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: '19 Tools', sub: 'Expanded PDF operations' },
            { label: '100% Private', sub: 'Runs on your server' },
            { label: 'Preview ready', sub: 'See uploads before processing' },
            { label: 'Auto cleanup', sub: 'Files deleted in 30 min' },
          ].map(f => (
            <div key={f.label}>
              <p className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>{f.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
