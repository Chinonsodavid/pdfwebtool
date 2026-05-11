import { Download, Eye, FileCheck2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ResultCard({ title, description, downloadUrl, nextSteps = [] }) {
  const previewable = /\.(pdf|png|jpe?g|webp|gif|txt)$/i.test(downloadUrl || '')
  const previewUrl = previewable ? downloadUrl.replace('/downloads/', '/preview/') : ''

  return (
    <div className="card p-5 space-y-4 text-left animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <FileCheck2 size={20} />
        </div>
        <div>
          <h3 className="section-title">{title}</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {previewable ? (
          <a href={previewUrl} className="btn-secondary" target="_blank" rel="noreferrer">
            <Eye size={16} />
            Preview
          </a>
        ) : null}

        <a href={downloadUrl} className="btn-primary" download>
          <Download size={16} />
          Download result
        </a>
      </div>

      {nextSteps.length ? (
        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-display font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
            Next steps
          </p>
          <div className="mt-3 grid gap-2">
            {nextSteps.map(tool => (
              <Link key={tool.id} to={tool.path} className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors" style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>
                <span>{tool.label}</span>
                <span style={{ color: tool.color }}>{tool.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
