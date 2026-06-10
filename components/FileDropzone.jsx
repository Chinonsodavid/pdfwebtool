import { useEffect, useId, useRef, useState } from 'react'
import {
  FileText,
  Image as ImageIcon,
  Plus,
  UploadCloud,
  X,
} from 'lucide-react'

import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function FileDropzone({
  files,
  onChange,
  accept,
  multiple,
  selectLabel,
  dropLabel,
  children,
}) {
  const inputId = useId()
  const fileList = Array.from(files || [])
  const [previewUrls, setPreviewUrls] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const gridRef = useRef(null)
  const reorderRef = useRef(reorderFiles)

  useEffect(() => {
    reorderRef.current = reorderFiles
  }, [files, onChange])

  const hasFiles = fileList.length > 0

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    let activeDragIndex = null

    function handleTouchStart(e) {
      const card = e.target.closest('.file-thumb-card')
      if (!card) return

      // Ignore touches on the remove button
      if (e.target.closest('.file-thumb-remove')) return

      const index = parseInt(card.getAttribute('data-index'), 10)
      if (isNaN(index)) return

      activeDragIndex = index
      setDraggedIndex(index)
    }

    function handleTouchMove(e) {
      if (activeDragIndex === null) return

      // Block page scroll while dragging
      if (e.cancelable) {
        e.preventDefault()
      }

      const touch = e.touches[0]

      // Hide the dragged card from hit-testing so elementFromPoint
      // returns the card underneath instead of the one under our finger
      const draggedCard = grid.querySelector(
        `.file-thumb-card[data-index="${activeDragIndex}"]`
      )
      if (draggedCard) {
        draggedCard.style.pointerEvents = 'none'
      }

      const element = document.elementFromPoint(touch.clientX, touch.clientY)

      // Restore immediately
      if (draggedCard) {
        draggedCard.style.pointerEvents = ''
      }

      if (!element) return

      const targetCard = element.closest('.file-thumb-card')
      if (targetCard) {
        const targetIndex = parseInt(targetCard.getAttribute('data-index'), 10)
        if (!isNaN(targetIndex) && targetIndex !== activeDragIndex) {
          reorderRef.current(activeDragIndex, targetIndex)
          activeDragIndex = targetIndex
          setDraggedIndex(targetIndex)
        }
      }
    }

    function handleTouchEnd() {
      activeDragIndex = null
      setDraggedIndex(null)
    }

    grid.addEventListener('touchstart', handleTouchStart, { passive: true })
    grid.addEventListener('touchmove', handleTouchMove, { passive: false })
    grid.addEventListener('touchend', handleTouchEnd, { passive: true })
    grid.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      grid.removeEventListener('touchstart', handleTouchStart)
      grid.removeEventListener('touchmove', handleTouchMove)
      grid.removeEventListener('touchend', handleTouchEnd)
      grid.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [hasFiles])

  useEffect(() => {
    const previews = fileList.map((file, index) => ({
      key: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      index,
      name: file.name,
      size: file.size,
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
    if (fromIndex === toIndex) return
    const updatedFiles = [...fileList]
    const [movedFile] = updatedFiles.splice(fromIndex, 1)
    updatedFiles.splice(toIndex, 0, movedFile)
    onChange(updatedFiles)
  }

  const fileInput = (
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
  )

  /* ── State 1: Empty — full dropzone ───────────────────────────── */
  if (fileList.length === 0) {
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
        {fileInput}

        <label
          htmlFor={inputId}
          className="flex flex-col items-center text-center gap-3 cursor-pointer"
        >
          <span className="upload-select-button">
            <UploadCloud size={22} />
            {selectLabel || (multiple ? 'Select files' : 'Select file')}
          </span>

          <span className="hidden sm:inline text-sm" style={{ color: 'var(--text-muted)' }}>
            {dropLabel || (multiple ? 'or drop files here' : 'or drop file here')}
          </span>
        </label>
      </div>
    )
  }

  /* ── State 2: Files selected — compact workspace ──────────────── */
  return (
    <div
      className={isDragging ? 'upload-workspace upload-workspace-active' : 'upload-workspace'}
      onDragOver={event => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {fileInput}

      {/* ── Toolbar ── */}
      <div className="dropzone-toolbar">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={16} className="shrink-0" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
            {fileList.length} {fileList.length === 1 ? 'file' : 'files'} selected
          </span>
        </div>

        <label htmlFor={inputId} className="add-more-btn">
          <Plus size={14} />
          <span>{multiple ? 'Add more' : 'Replace'}</span>
        </label>
      </div>

      {/* ── Thumbnail grid ── */}
      <div className="file-thumb-grid" ref={gridRef}>
        {previewUrls.map(preview => (
          <div
            key={preview.key}
            data-index={preview.index}
            className={`file-thumb-card ${draggedIndex === preview.index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => setDraggedIndex(preview.index)}
            onDragOver={event => event.preventDefault()}
            onDrop={event => {
              event.stopPropagation()
              if (draggedIndex === null) return
              reorderFiles(draggedIndex, preview.index)
              setDraggedIndex(null)
            }}
            onDragEnd={() => setDraggedIndex(null)}
          >
            {/* Remove button */}
            <button
              type="button"
              aria-label={`Remove ${preview.name}`}
              className="file-thumb-remove"
              onClick={() => removeFile(preview.index)}
            >
              <X size={11} />
            </button>

            {/* Preview */}
            <div className="file-thumb-preview">
              {preview.type.startsWith('image/') ? (
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : preview.type === 'application/pdf' ? (
                <Document
                  file={preview.url}
                  loading={
                    <FileText size={28} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                  }
                >
                  <Page
                    pageNumber={1}
                    width={90}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              ) : (
                <FileText size={28} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              )}
            </div>

            {/* File info */}
            <div className="file-thumb-info">
              <span className="file-thumb-name">{preview.name}</span>
              <span className="file-thumb-size">{formatSize(preview.size)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Children area (options) ── */}
      {children && <div className="dropzone-options-area">{children}</div>}
    </div>
  )
}
