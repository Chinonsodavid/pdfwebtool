import { Download, Eye, FileCheck2 } from 'lucide-react'

export default function ResultCard({ title, description, downloadUrl }) {
  const previewable = /\.(pdf|png|jpe?g|webp|gif|txt)$/i.test(downloadUrl || '')
  const previewUrl = previewable ? downloadUrl.replace('/downloads/', '/preview/') : ''

  return (
    <div className="card p-5 space-y-4 animate-slide-up">
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
    </div>
  )
}
