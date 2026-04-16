import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import FAQAccordion from '../components/FAQAccordion'
import { guideSummaries } from '../data/siteContent'
import { toolCategories, tools } from '../utils/toolCatalog'

const featuredToolIds = ['merge', 'compress', 'pdf-to-word', 'pdf-to-excel', 'ocr', 'protect']
const featuredTools = featuredToolIds
  .map(id => tools.find(tool => tool.id === id))
  .filter(Boolean)

const categoryHighlights = toolCategories.map(category => ({
  ...category,
  tools: tools.filter(tool => tool.category === category.id),
}))

const proofPoints = [
  'Temporary files are scheduled for cleanup after processing, so the site is not used as long-term file storage.',
  'Covers everyday PDF workflows like merge, split, rotate, compress, convert, sign, OCR, spreadsheet, and presentation conversion.',
  'Helpful guides explain the limits of conversion, OCR, password tools, file safety, and sharing documents responsibly.',
]

const faqs = [
  ['Are my files stored permanently?', 'No. Uploaded and generated files are temporary and scheduled for cleanup after 30 minutes.'],
  ['Can every PDF convert perfectly?', 'No. Conversion quality depends on the original file, fonts, scan quality, layout, and whether text is selectable.'],
  ['Can I unlock any PDF?', 'No. Only unlock PDFs you own or have permission to modify, and you need the current password.'],
  ['Why are some results downloaded as ZIP files?', 'Tools that create multiple outputs, such as PDF to image or split PDF, package those files into one ZIP download.'],
]

export default function LandingPage() {
  return (
    <div className="space-y-12 sm:space-y-20 animate-fade-in">
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-center pt-2 sm:pt-4">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-display"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Sparkles size={14} />
            Practical PDF and document tools
          </div>

          <div className="space-y-4">
            <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-6xl lg:text-7xl leading-tight sm:leading-[0.95]" style={{ color: 'var(--text)' }}>
              Serious PDF tools
              <span className="block" style={{ color: 'var(--accent)' }}>
                for everyday file work.
              </span>
            </h1>
            <p className="text-base sm:text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Merge, split, compress, convert, OCR, sign, secure, label, crop, and organize documents from one focused workspace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/tools" className="btn-primary">
              Explore all tools
              <ArrowRight size={16} />
            </Link>
            <a href="#categories" className="btn-secondary justify-center sm:justify-start">
              See categories
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
              { label: `${tools.length} tools`, sub: 'PDF, image, Office, and OCR workflows' },
              { label: 'Temporary files', sub: 'cleanup scheduled after processing' },
              { label: 'Helpful guides', sub: 'clear limits and best practices' },
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
                'Upload PDFs, images, spreadsheets, or presentations.',
                'Choose a focused operation like OCR, conversion, signing, crop, or batch processing.',
                'Download the finished file or ZIP and review it before sharing.',
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
            <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: 'var(--text)' }}>
              The core document jobs people reach for first
            </h2>
          </div>
          <Link to="/tools" className="btn-secondary">Open full directory</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
          <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: 'var(--text)' }}>
            Explore the toolkit by job, not by guesswork
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {categoryHighlights.map(category => (
            <div key={category.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>{category.label}</p>
                  <h3 className="font-display font-bold text-xl sm:text-2xl mt-1" style={{ color: 'var(--text)' }}>{category.description}</h3>
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
            <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: 'var(--text)' }}>
              Built for responsible document workflows
            </h2>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: 'var(--text-muted)' }}>
              Constant PDF keeps the process clear: upload a file, run the selected tool, download the result, and review it before using it for important work.
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

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>
              <BookOpen size={16} />
              Guides
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mt-2" style={{ color: 'var(--text)' }}>
              Learn before you convert
            </h2>
            <p className="text-base mt-2 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              Short guides help you choose the right tool, understand conversion limits, and prepare files safely.
            </p>
          </div>
          <Link to="/guides" className="btn-secondary">Browse all guides</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guideSummaries.slice(0, 3).map(guide => (
            <Link key={guide.slug} to={`/guides/${guide.slug}`} className="card p-5 group transition-transform hover:-translate-y-1">
              <p className="text-xs font-display font-semibold" style={{ color: 'var(--accent)' }}>{guide.readTime}</p>
              <h3 className="font-display font-bold text-lg mt-3" style={{ color: 'var(--text)' }}>{guide.title}</h3>
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-muted)' }}>{guide.description}</p>
              <div className="mt-4 text-sm font-display font-semibold flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                Read guide
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>FAQ</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: 'var(--text)' }}>
            Common questions before using the tools
          </h2>
        </div>
        <FAQAccordion items={faqs} />
      </section>
    </div>
  )
}
