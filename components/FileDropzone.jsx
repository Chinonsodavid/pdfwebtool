import { useEffect, useId, useState } from 'react'
import {
  FileText,
  GripVertical,
  Image as ImageIcon,
  UploadCloud,
  X,
} from 'lucide-react'

import { Document, Page, pdfjs } from 'react-pdf'

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerPort = new Worker(
    new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url),
    { type: 'module' },
  )
}

export default function FileDropzone({
  files,
  onChange,
  accept,
  multiple,
  selectLabel,
  dropLabel,
}) {
  const inputId = useId()
  const fileList = Array.from(files || [])
  const [previewUrls, setPreviewUrls] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  useEffect(() => {
    const previews = fileList.map((file, index) => ({
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

    if (droppedFiles.length > 0) {
      onChange(multiple ? [...fileList, ...droppedFiles] : droppedFiles.slice(0, 1))
    }
  }

  function reorderFiles(fromIndex, toIndex) {
    const updatedFiles = [...fileList]
    const [movedFile] = updatedFiles.splice(fromIndex, 1)
    updatedFiles.splice(toIndex, 0, movedFile)
    onChange(updatedFiles)
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
          const selectedFiles = Array.from(event.target.files || [])

          onChange(
            multiple
              ? [...fileList, ...selectedFiles]
              : selectedFiles.slice(0, 1),
          )

          event.target.value = ''
        }}
      />

      <label
        htmlFor={inputId}
        className="flex flex-col items-center text-center gap-3 cursor-pointer"
      >
        <span className="upload-select-button">
          <UploadCloud size={22} />
          {selectLabel || (multiple ? 'Select files' : 'Select file')}
        </span>

        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {dropLabel || (multiple ? 'or drop files here' : 'or drop file here')}
        </span>
      </label>

      {fileList.length > 0 ? (
        <div className="mx-auto mt-6 max-w-4xl space-y-3">
          {fileList.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="selected-file-row"
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={event => event.preventDefault()}
              onDrop={() => {
                if (draggedIndex === null) return
                reorderFiles(draggedIndex, index)
                setDraggedIndex(null)
              }}
            >
              <GripVertical
                size={16}
                className="cursor-grab active:cursor-grabbing shrink-0"
                style={{ color: 'var(--text-muted)' }}
              />

              <FileText size={16} style={{ color: 'var(--accent)' }} />

              <span className="min-w-0 flex-1 truncate">
                {index + 1}. {file.name}
              </span>

              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700"
                onClick={() => removeFile(index)}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            {previewUrls.map(preview => (
              <div
                key={preview.key}
                className="relative overflow-hidden rounded-md border bg-white"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-card)',
                }}
              >
                <button
                  type="button"
                  aria-label={`Remove ${preview.name}`}
                  className="absolute right-2 top-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                  onClick={() => removeFile(preview.index)}
                >
                  <X size={13} />
                </button>

                <div
                  className="flex items-center justify-center overflow-hidden bg-white p-2"
                  style={{ minHeight: '240px' }}
                >
                  {preview.type.startsWith('image/') ? (
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full h-full object-cover"
                    />
                  ) : preview.type === 'application/pdf' ? (
                    <Document
                      file={preview.url}
                      loading={
                        <div
                          className="flex flex-col items-center gap-2 text-sm"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <FileText size={20} />
                          Loading preview...
                        </div>
                      }
                    >
                      <Page
                        pageNumber={1}
                        width={260}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                  ) : (
                    <div
                      className="flex flex-col items-center gap-2 text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ImageIcon size={20} />
                      Preview unavailable
                    </div>
                  )}
                </div>

                <div
                  className="border-t px-3 py-3 text-xs truncate"
                  style={{
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border)',
                  }}
                >
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
