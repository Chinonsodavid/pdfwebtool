import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react'
import FAQAccordion from '../components/FAQAccordion'
import { guideSummaries } from '../data/siteContent'
import { toolGroups, tools } from '../utils/toolCatalog'

const popularToolIds = ['merge', 'compress', 'pdf-to-word', 'word-to-pdf', 'edit', 'sign', 'protect', 'ocr']
const popularTools = popularToolIds.map(id => tools.find(tool => tool.id === id)).filter(Boolean)

const faqs = [
  ['Are my files stored permanently?', 'No. Uploaded and generated files are temporary and scheduled for cleanup after 30 minutes.'],
  ['Can every PDF convert perfectly?', 'No. Conversion quality depends on the original file, fonts, scan quality, layout, and whether text is selectable.'],
  ['Can I unlock any PDF?', 'No. Only unlock PDFs you own or have permission to modify, and you need the current password.'],
  ['Why are some results downloaded as ZIP files?', 'Tools that create multiple outputs, such as PDF to image or split PDF, package those files into one ZIP download.'],
]

export default function LandingPage() {
  const [activeGroup, setActiveGroup] = useState('all')
  const activeTools = activeGroup === 'popular'
    ? popularTools
    : activeGroup === 'all'
      ? tools
      : tools.filter(tool => tool.category === activeGroup)
  const visibleTools = activeTools

  return (
    <div className="animate-fade-in">
      <section className="mx-auto max-w-5xl py-10 text-center sm:py-16">
        <h1 className="hero-display-title text-4xl leading-tight sm:text-6xl" style={{ color: 'var(--text)' }}>
          Free Online PDF Tools for Fast Document Editing & Conversion
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-muted)' }}>
          The complete PDF workstation built for schools, offices, and freelancers. Effortlessly merge, split, compress, or convert your documents with secure OCR and e-signing. Access every essential tool in one focused, high speed workspace
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[{ id: 'all', label: 'All PDF Tools' }, { id: 'popular', label: 'Popular' }, ...toolGroups].map(group => (
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
      </section>

      <section id="tools" className="open-section py-8 sm:py-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>
              {activeGroup === 'all' ? 'All PDF Tools' : activeGroup === 'popular' ? 'Popular Tools' : toolGroups.find(group => group.id === activeGroup)?.label}
            </p>
            <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text)' }}>
              Choose a tool and get started
            </h2>
          </div>
          <Link to="/tools" className="btn-secondary">
            See more
            <ArrowRight size={16} />
          </Link>
        </div>

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
            No tools match that search yet.
          </div>
        ) : null}
      </section>

      <section className="open-section grid gap-6 py-10 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>
            <ShieldCheck size={16} />
            File handling
          </div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text)' }}>
            Built for everyday document work
          </h2>
          <p className="max-w-3xl text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Files are processed by the backend for the selected task and temporary uploads and results are scheduled for cleanup after processing.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {['HTTPS upload flow', 'Temporary file cleanup', 'No account required for basic tools'].map(item => (
            <div key={item} className="trust-row">
              <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="open-section grid gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>
            <BookOpen size={16} />
            Guides
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text)' }}>
            Learn before you convert
          </h2>
          <p className="mt-2 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Short guides explain compression, OCR, conversion limits, file safety, and cleaner document sharing.
          </p>
          <Link to="/guides" className="btn-secondary mt-5">
            Browse guides
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {guideSummaries.slice(0, 3).map(guide => (
            <Link key={guide.slug} to={`/guides/${guide.slug}`} className="article-link-card group">
              <span className="text-xs font-display font-semibold" style={{ color: 'var(--accent)' }}>{guide.readTime}</span>
              <span className="mt-3 block font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{guide.title}</span>
              <span className="mt-2 block text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{guide.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="open-section py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>FAQ</p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text)' }}>
            Common questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
    </div>
  )
}
