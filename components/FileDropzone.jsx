import { useEffect, useState } from 'react'
import { FileText, Image as ImageIcon, UploadCloud } from 'lucide-react'

export default function FileDropzone({ files, onChange, accept, multiple, helperText }) {
  const fileList = Array.from(files || [])
  const [previewUrls, setPreviewUrls] = useState([])

  useEffect(() => {
    const previews = fileList.slice(0, 4).map(file => ({
      key: `${file.name}-${file.size}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }))

    setPreviewUrls(previews)

    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url))
    }
  }, [files])

  return (
    <label
      className="card block p-6 border-dashed cursor-pointer transition-all hover:-translate-y-0.5"
      style={{ borderStyle: 'dashed' }}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={event => onChange(event.target.files)}
      />
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <UploadCloud size={24} />
        </div>
        <div>
          <p className="font-display font-bold" style={{ color: 'var(--text)' }}>
            {multiple ? 'Choose files' : 'Choose a file'}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {helperText}
          </p>
        </div>
      </div>

      {fileList.length > 0 ? (
        <div className="mt-5 space-y-2">
          {fileList.map(file => (
            <div key={`${file.name}-${file.size}`} className="rounded-xl px-3 py-2 text-sm" style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>
              {file.name}
            </div>
          ))}

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {previewUrls.map(preview => (
              <div key={preview.key} className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
                <div className="h-36 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(249,83,14,0.08), rgba(0,0,0,0.02))' }}>
                  {preview.type.startsWith('image/') ? (
                    <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                  ) : preview.type === 'application/pdf' ? (
                    <object data={preview.url} type="application/pdf" className="w-full h-full">
                      <div className="flex flex-col items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <FileText size={20} />
                        PDF preview
                      </div>
                    </object>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <ImageIcon size={20} />
                      Preview unavailable
                    </div>
                  )}
                </div>
                <div className="px-3 py-2 text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {preview.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </label>
  )
}
