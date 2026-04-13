import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { toolCategories, tools } from '../utils/toolCatalog'

const featuredToolIds = ['merge', 'compress', 'sign', 'ocr', 'page-labels', 'batch']
const featuredTools = featuredToolIds
  .map(id => tools.find(tool => tool.id === id))
  .filter(Boolean)

const categoryHighlights = toolCategories.map(category => ({
  ...category,
  tools: tools.filter(tool => tool.category === category.id),
}))

const proofPoints = [
  'Inspired by the simple discovery and strong tool categorization used on sites like iLovePDF, Smallpdf, and Sejda, but adapted into a self-hosted product experience.',
  'Built for private document work, with processing on your own server and cleanup after 30 minutes.',
  'Ready for individual tasks and heavier workflows like OCR, signatures, metadata updates, and batch jobs.',
]

export default function LandingPage() {
  return (
    <div className="space-y-16 sm:space-y-20 animate-fade-in">
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center pt-4">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-display"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Sparkles size={14} />
            Self-hosted PDF workspace
          </div>

          <div className="space-y-4">
            <h1 className="font-display font-extrabold tracking-tight text-5xl sm:text-6xl lg:text-7xl leading-[0.95]" style={{ color: 'var(--text)' }}>
              Serious PDF tools
              <span className="block" style={{ color: 'var(--accent)' }}>
                without the SaaS lock-in.
              </span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Merge, split, OCR, sign, secure, label, crop, convert, and batch-process documents in one fast interface that runs on your own infrastructure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/tools" className="btn-primary">
              Explore all tools
              <ArrowRight size={16} />
            </Link>
            <a href="#categories" className="btn-secondary">
              See categories
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: `${tools.length} tools`, sub: 'from merge to OCR' },
              { label: 'Local processing', sub: 'documents stay on your machine' },
              { label: 'Preview-first UI', sub: 'see uploads before processing' },
            ].map(item => (
              <div key={item.label} className="card p-4">
                <p className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>{item.label}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 sm:p-5 overflow-hidden" style={{ background: 'linear-gradient(160deg, color-mix(in srgb, var(--bg-card) 80%, white), var(--bg-card))' }}>
          <div className="rounded-3xl p-5 sm:p-6 border" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, rgba(249,83,14,0.10), rgba(255,255,255,0.02))' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>Workflow snapshot</p>
                <h2 className="font-display font-bold text-2xl mt-1" style={{ color: 'var(--text)' }}>From upload to delivery</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}>
                <Zap size={22} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                'Upload PDFs or images with live previews.',
                'Choose a focused operation like OCR, sign, crop, or batch processing.',
                'Download the finished file or ZIP from your own server.',
              ].map((step, index) => (
                <div key={step} className="flex gap-3 items-start rounded-2xl p-4" style={{ background: 'var(--bg-card)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {proofPoints.map(point => (
          <div key={point} className="card p-5 flex gap-3">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{point}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>Featured tools</p>
            <h2 className="font-display font-bold text-3xl" style={{ color: 'var(--text)' }}>
              The core document jobs people reach for first
            </h2>
          </div>
          <Link to="/tools" className="btn-secondary">Open full directory</Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featuredTools.map(tool => (
            <Link key={tool.id} to={tool.path} className="card p-5 group transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: tool.bg, color: tool.color }}>
                <tool.icon size={22} />
              </div>
              <h3 className="font-display font-bold text-lg mt-4" style={{ color: 'var(--text)' }}>{tool.label}</h3>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
              <div className="mt-5 text-sm font-display font-semibold flex items-center gap-2" style={{ color: tool.color }}>
                Launch tool
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="categories" className="space-y-6">
        <div>
          <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>Tool categories</p>
          <h2 className="font-display font-bold text-3xl" style={{ color: 'var(--text)' }}>
            Explore the toolkit by job, not by guesswork
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {categoryHighlights.map(category => (
            <div key={category.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>{category.label}</p>
                  <h3 className="font-display font-bold text-2xl mt-1" style={{ color: 'var(--text)' }}>{category.description}</h3>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-display font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {category.tools.length} tools
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {category.tools.map(tool => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{ background: tool.bg, color: tool.color }}
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-7 sm:p-8">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>
              <ShieldCheck size={16} />
              Private by design
            </div>
            <h2 className="font-display font-bold text-3xl" style={{ color: 'var(--text)' }}>
              A landing page promise that the product can actually keep
            </h2>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: 'var(--text-muted)' }}>
              Documents are processed on your server, not routed through a third-party PDF service. That makes PDFForge a better fit for internal teams, agencies, and anyone handling sensitive files.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/tools" className="btn-primary">
              Start with the tools
            </Link>
            <Link to="/merge" className="btn-secondary">
              Try merge first
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
