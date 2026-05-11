import { useEffect, useId, useState } from 'react'
import { FileText, Image as ImageIcon, UploadCloud, X } from 'lucide-react'

export default function FileDropzone({ files, onChange, accept, multiple, selectLabel, dropLabel }) {
  const inputId = useId()
  const fileList = Array.from(files || [])
  const [previewUrls, setPreviewUrls] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const previews = fileList.slice(0, 4).map((file, index) => ({
      key: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      index,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }))

    setPreviewUrls(previews)

    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url))
    }
  }, [files])

  function removeFile(indexToRemove) {
    onChange(fileList.filter((_, index) => index !== indexToRemove))
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(event.dataTransfer.files || [])
    onChange(multiple ? droppedFiles : droppedFiles.slice(0, 1))
  }

  return (
    <div
      className={isDragging ? 'upload-dropzone upload-dropzone-active' : 'upload-dropzone'}
      onDragOver={event => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={event => {
          onChange(event.target.files)
          event.target.value = ''
        }}
      />
      <label htmlFor={inputId} className="flex flex-col items-center text-center gap-3 cursor-pointer">
        <span className="upload-select-button">
          <UploadCloud size={22} />
          {selectLabel || (multiple ? 'Select files' : 'Select file')}
        </span>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {dropLabel || (multiple ? 'or drop files here' : 'or drop file here')}
        </span>
      </label>

      {fileList.length > 0 ? (
        <div className="mx-auto mt-6 max-w-2xl space-y-2">
          {fileList.map((file, index) => (
            <div key={`${file.name}-${file.size}-${file.lastModified}-${index}`} className="selected-file-row">
              <FileText size={16} style={{ color: 'var(--accent)' }} />
              <span className="min-w-0 flex-1 truncate">
                {file.name}
              </span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => removeFile(index)}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {previewUrls.map(preview => (
              <div key={preview.key} className="relative overflow-hidden rounded-md border" style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
                <button
                  type="button"
                  aria-label={`Remove ${preview.name}`}
                  className="absolute right-2 top-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={() => removeFile(preview.index)}
                >
                  <X size={13} />
                </button>
                <div className="h-32 sm:h-36 flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
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
    </div>
  )
}
