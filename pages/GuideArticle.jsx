import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { guideArticles, guideSummaries } from '../data/siteContent'
import { tools } from '../utils/toolCatalog'

function relatedTools(ids = []) {
  return ids.map(id => tools.find(tool => tool.id === id)).filter(Boolean)
}

export default function GuideArticle() {
  const { slug } = useParams()
  const article = guideArticles[slug]
  const summary = guideSummaries.find(item => item.slug === slug)
  const toolsForArticle = relatedTools(summary?.relatedTools)

  if (!article) {
    return (
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>Guide not found</p>
        <h1 className="page-title">This guide is not available</h1>
        <Link to="/guides" className="btn-primary">Browse guides</Link>
      </div>
    )
  }

  return (
    <article className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start animate-fade-in">
      <div className="max-w-3xl space-y-8">
        <header className="space-y-4">
          <Link to="/guides" className="text-sm font-display font-semibold" style={{ color: 'var(--accent)' }}>
            Guides
          </Link>
          <h1 className="page-title text-4xl md:text-5xl">{article.title}</h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {article.intro}
          </p>
        </header>

        {article.sections.map(section => (
          <section key={section.heading} className="space-y-3">
            <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
              {section.heading}
            </h2>
            {section.body.map(paragraph => (
              <p key={paragraph} className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section className="card p-6 space-y-4">
          <h2 className="section-title text-2xl">Questions</h2>
          {article.faq.map(([question, answer]) => (
            <div key={question} className="space-y-1">
              <h3 className="font-display font-bold" style={{ color: 'var(--text)' }}>{question}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{answer}</p>
            </div>
          ))}
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="card p-5 space-y-3">
          <h2 className="section-title">Related tools</h2>
          {toolsForArticle.map(tool => (
            <Link key={tool.id} to={tool.path} className="flex items-center justify-between gap-3 rounded-md p-3 transition-colors" style={{ background: 'var(--bg-subtle)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{tool.label}</span>
              <ArrowRight size={15} style={{ color: tool.color }} />
            </Link>
          ))}
        </div>
      </aside>
    </article>
  )
}
