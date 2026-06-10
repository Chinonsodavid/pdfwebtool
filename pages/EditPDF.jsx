import { useEffect, useRef, useState } from 'react'
import { AlertCircle, FileImage, Highlighter, ImagePlus, MousePointer2, Search, Square, Type, UploadCloud } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf.js'
import ProcessingSpinner from '../components/ProcessingSpinner'
import ResultCard from '../components/ResultCard'
import { api, withApiBase } from '../utils/api'

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerPort = new Worker(
    new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url),
    { type: 'module' },
  )
}

const textColors = ['#111827', '#dc2626', '#2563eb', '#059669', '#f9530e']

function createLayer(type, page, x, y, extra = {}) {
  const id = `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  if (type === 'text') {
    return {
      id,
      type,
      page,
      x,
      y,
      width: 220,
      height: 34,
      text: 'New text',
      fontSize: 18,
      color: '#111827',
      opacity: 1,
      bold: false,
      ...extra,
    }
  }

  if (type === 'image') {
    return {
      id,
      type,
      page,
      x,
      y,
      width: 180,
      height: 110,
      opacity: 1,
      ...extra,
    }
  }

  return {
    id,
    type,
    page,
    x,
    y,
    width: 170,
    height: 56,
    fillColor: type === 'whiteout' ? '#FFFFFF' : '#FFF4ED',
    borderColor: '#F9530E',
    showBorder: type !== 'whiteout',
    opacity: type === 'whiteout' ? 1 : 0.9,
    ...extra,
  }
}

export default function EditPDF() {
  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const interactionRef = useRef(null)
  const [file, setFile] = useState(null)
  const [pdfUrl, setPdfUrl] = useState('')
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [pageSize, setPageSize] = useState({ width: 0, height: 0, scale: 1, viewWidth: 0, viewHeight: 0 })
  const [textBoxes, setTextBoxes] = useState([])
  const [showDetectedText, setShowDetectedText] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [layers, setLayers] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [activeTool, setActiveTool] = useState('select')
  const [pendingImageIndex, setPendingImageIndex] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [isRendering, setIsRendering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!file) return undefined
    const url = URL.createObjectURL(file)
    setPdfUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    if (!pdfUrl) {
      setPdfDoc(null)
      setPageCount(0)
      return undefined
    }

    let cancelled = false
    const loadingTask = pdfjsLib.getDocument(pdfUrl)
    loadingTask.promise
      .then(doc => {
        if (cancelled) return
        setPdfDoc(doc)
        setPageCount(doc.numPages)
        setPageNumber(1)
        setZoom(1)
        setTextBoxes([])
        setShowDetectedText(false)
        setLayers([])
        setSelectedId('')
        setResult(null)
      })
      .catch(loadError => setError(loadError.message || 'Could not open this PDF.'))

    return () => {
      cancelled = true
      loadingTask.destroy()
    }
  }, [pdfUrl])

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return undefined

    let cancelled = false
    setIsRendering(true)
    pdfDoc.getPage(pageNumber)
      .then(page => {
        if (cancelled) return null
        const baseViewport = page.getViewport({ scale: 1 })
        const availableWidth = Math.min(stageRef.current?.clientWidth || 820, 860) - 24
        const scale = Math.max(0.6, Math.min(1.6, availableWidth / baseViewport.width)) * zoom
        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const pixelRatio = window.devicePixelRatio || 1

        canvas.width = Math.floor(viewport.width * pixelRatio)
        canvas.height = Math.floor(viewport.height * pixelRatio)
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

        setPageSize({
          width: baseViewport.width,
          height: baseViewport.height,
          scale,
          viewWidth: viewport.width,
          viewHeight: viewport.height,
        })

        const renderPromise = page.render({ canvasContext: context, viewport }).promise
        return Promise.all([renderPromise, page.getTextContent(), Promise.resolve({ viewport, scale, pageHeight: baseViewport.height })])
          .then(([, textContent, metrics]) => {
            if (cancelled) return
            const boxes = textContent.items
              .map((item, index) => {
                const text = typeof item.str === 'string' ? item.str.trim() : ''
                if (!text) return null
                const transform = pdfjsLib.Util.transform(metrics.viewport.transform, item.transform)
                const height = Math.max(Math.hypot(transform[2], transform[3]), 8 * metrics.scale)
                const width = Math.max((item.width || text.length * 6) * metrics.scale, 8)
                const left = transform[4]
                const top = transform[5] - height
                return {
                  id: `${pageNumber}-${index}`,
                  text,
                  left,
                  top,
                  width,
                  height: height * 1.15,
                  x: left / metrics.scale,
                  y: metrics.pageHeight - ((top + (height * 1.15)) / metrics.scale),
                  pdfWidth: width / metrics.scale,
                  pdfHeight: (height * 1.15) / metrics.scale,
                  fontSize: Math.max(8, Math.round(height / metrics.scale)),
                }
              })
              .filter(Boolean)
            setTextBoxes(boxes)
          })
      })
      .catch(renderError => {
        if (!cancelled) setError(renderError.message || 'Could not render this page.')
      })
      .finally(() => {
        if (!cancelled) setIsRendering(false)
      })

    return () => {
      cancelled = true
    }
  }, [pdfDoc, pageNumber, zoom])

  useEffect(() => {
    function handleMove(event) {
      const interaction = interactionRef.current
      if (!interaction) return

      const dx = (event.clientX - interaction.startClientX) / pageSize.scale
      const dy = (event.clientY - interaction.startClientY) / pageSize.scale

      setLayers(current => current.map(layer => {
        if (layer.id !== interaction.id) return layer
        if (interaction.mode === 'resize') {
          return {
            ...layer,
            width: Math.max(24, interaction.startWidth + dx),
            height: Math.max(18, interaction.startHeight + dy),
            y: Math.max(0, Math.min(pageSize.height - 18, interaction.startY - dy)),
          }
        }

        return {
          ...layer,
          x: Math.max(0, Math.min(pageSize.width - layer.width, interaction.startX + dx)),
          y: Math.max(0, Math.min(pageSize.height - layer.height, interaction.startY - dy)),
        }
      }))
    }

    function handleUp() {
      interactionRef.current = null
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [pageSize])

  function setSelectedPdf(nextFile) {
    if (!nextFile) return
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url))
    setFile(nextFile)
    setError('')
    setImageFiles([])
    setImagePreviews([])
    setPendingImageIndex(null)
    setActiveTool('select')
  }

  function handleFileChange(event) {
    setSelectedPdf(event.target.files?.[0])
    event.target.value = ''
  }

  function handlePdfDrop(event) {
    event.preventDefault()
    setIsDraggingFile(false)
    setSelectedPdf(Array.from(event.dataTransfer.files || []).find(nextFile => nextFile.type === 'application/pdf'))
  }

  function getPointFromEvent(event, width = 180, height = 56) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / pageSize.scale
    const y = pageSize.height - ((event.clientY - rect.top) / pageSize.scale) - height
    return {
      x: Math.max(0, Math.min(pageSize.width - width, x)),
      y: Math.max(0, Math.min(pageSize.height - height, y)),
    }
  }

  function addLayerAt(event) {
    if (!pdfDoc || activeTool === 'select') return
    event.preventDefault()

    if (activeTool === 'edit-text') return

    if (activeTool === 'image') {
      if (pendingImageIndex === null) return
      const preview = imagePreviews[pendingImageIndex]
      const width = 180
      const height = preview ? Math.max(40, width / preview.ratio) : 110
      const point = getPointFromEvent(event, width, height)
      const nextLayer = createLayer('image', pageNumber, point.x, point.y, {
        width,
        height,
        imageIndex: pendingImageIndex,
        previewUrl: preview?.url,
      })
      setLayers(current => [...current, nextLayer])
      setSelectedId(nextLayer.id)
      setActiveTool('select')
      setPendingImageIndex(null)
      return
    }

    const point = getPointFromEvent(event, activeTool === 'text' ? 220 : 170, activeTool === 'text' ? 34 : 56)
    const nextLayer = createLayer(activeTool, pageNumber, point.x, point.y)
    setLayers(current => [...current, nextLayer])
    setSelectedId(nextLayer.id)
    setActiveTool('select')
  }

  function addImage(event) {
    const nextFile = event.target.files?.[0]
    if (!nextFile) return
    const index = imageFiles.length
    const url = URL.createObjectURL(nextFile)
    const image = new Image()
    image.onload = () => {
      setImagePreviews(current => [...current, { url, ratio: image.width / image.height }])
    }
    image.src = url
    setImageFiles(current => [...current, nextFile])
    setPendingImageIndex(index)
    setActiveTool('image')
    event.target.value = ''
  }

  function updateLayer(id, updates) {
    setLayers(current => current.map(layer => (layer.id === id ? { ...layer, ...updates } : layer)))
  }

  function deleteSelected() {
    setLayers(current => current.filter(layer => layer.id !== selectedId))
    setSelectedId('')
  }

  function replaceDetectedText(box) {
    const padding = 2
    const whiteout = createLayer('whiteout', pageNumber, Math.max(0, box.x - padding), Math.max(0, box.y - padding), {
      width: box.pdfWidth + (padding * 2),
      height: box.pdfHeight + (padding * 2),
      fillColor: '#FFFFFF',
      showBorder: false,
      opacity: 1,
    })
    const replacement = createLayer('text', pageNumber, box.x, box.y + Math.max(1, box.pdfHeight * 0.12), {
      width: Math.max(80, box.pdfWidth),
      height: Math.max(20, box.pdfHeight),
      text: box.text,
      fontSize: box.fontSize,
      color: '#111827',
    })

    setLayers(current => [...current, whiteout, replacement])
    setSelectedId(replacement.id)
    setActiveTool('select')
    setShowDetectedText(false)
  }

  async function exportPdf() {
    setError('')
    setResult(null)
    if (!file) {
      setError('Choose a PDF first.')
      return
    }
    if (!layers.length) {
      setError('Add at least one edit before exporting.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    imageFiles.forEach(imageFile => formData.append('editImages', imageFile))
    formData.append('edits', JSON.stringify(layers.map(layer => ({
      type: layer.type,
      page: layer.page,
      x: layer.x,
      y: layer.y,
      width: layer.width,
      height: layer.height,
      text: layer.text,
      fontSize: layer.fontSize,
      color: layer.color,
      bold: layer.bold,
      opacity: layer.opacity,
      imageIndex: layer.imageIndex,
      fillColor: layer.fillColor,
      borderColor: layer.borderColor,
      showBorder: layer.showBorder,
    }))))

    setIsSubmitting(true)
    try {
      const { data } = await api.post('/api/pdf/edit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult({
        title: 'Edit PDF complete',
        description: 'Your edited PDF is ready to download.',
        downloadUrl: withApiBase(data.url),
      })
    } catch (submitError) {
      setError(submitError.response?.data?.error || submitError.message || 'Edit failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedLayer = layers.find(layer => layer.id === selectedId)
  const visibleLayers = layers.filter(layer => layer.page === pageNumber)

  if (!file) {
    return (
      <div className="animate-fade-in">
        <section className="mx-auto max-w-4xl space-y-6 py-4 text-center sm:py-8">
          <div className="space-y-3">
            <h1 className="hero-display-title text-4xl leading-tight sm:text-5xl" style={{ color: 'var(--text)' }}>
              Edit PDF
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'var(--text-muted)' }}>
              Add text, images, highlights, whiteout blocks, or click detected PDF text to replace it, then export the finished document.
            </p>
            <p className="mx-auto max-w-2xl text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              Files are processed over HTTPS and temporary uploads and results are scheduled for cleanup after 30 minutes.
            </p>
          </div>

          <div
            className={isDraggingFile ? 'upload-dropzone upload-dropzone-active' : 'upload-dropzone'}
            onDragOver={event => {
              event.preventDefault()
              setIsDraggingFile(true)
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={handlePdfDrop}
          >
            <input id="edit-pdf-upload" className="sr-only" type="file" accept="application/pdf" onChange={handleFileChange} />
            <label htmlFor="edit-pdf-upload" className="flex cursor-pointer flex-col items-center gap-3 text-center">
              <span className="upload-select-button">
                <UploadCloud size={22} />
                Select PDF file
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                or drop PDF here
              </span>
            </label>
          </div>

          {error ? (
            <div className="rounded-xl px-4 py-3 text-sm flex items-start gap-2 text-left" style={{ background: 'rgba(239,68,68,0.08)', color: '#b91c1c' }}>
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            PDF editor
          </p>
          <h1 className="page-title">Edit PDF</h1>
          <p className="text-base max-w-3xl" style={{ color: 'var(--text-muted)' }}>
            Add text, images, highlights, whiteout blocks, or click detected PDF text to replace it, then export the finished document.
          </p>
        </div>
        <button className="btn-primary" type="button" onClick={exportPdf} disabled={isSubmitting || !file}>
          {isSubmitting ? 'Exporting...' : 'Export edited PDF'}
        </button>
      </div>

      <div className="grid xl:grid-cols-[260px_1fr_300px] gap-5 items-start">
        <aside className="card p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              PDF file
            </label>
            <input className="input-field" type="file" accept="application/pdf" onChange={handleFileChange} />
            {file ? (
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{file.name}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { tool: 'select', label: 'Select', icon: MousePointer2 },
              { tool: 'edit-text', label: 'Edit text', icon: Search },
              { tool: 'text', label: 'Text', icon: Type },
              { tool: 'rect', label: 'Shape', icon: Square },
              { tool: 'whiteout', label: 'Whiteout', icon: Highlighter },
            ].map(item => (
              <button
                key={item.tool}
                type="button"
                className={activeTool === item.tool ? 'btn-primary justify-center px-3' : 'btn-secondary justify-center px-3'}
                onClick={() => {
                  setActiveTool(item.tool)
                  if (item.tool === 'edit-text') setShowDetectedText(true)
                }}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
            <input
              type="checkbox"
              checked={showDetectedText}
              onChange={event => setShowDetectedText(event.target.checked)}
            />
            Show detected text
          </label>

          <label className="btn-secondary justify-center cursor-pointer">
            <ImagePlus size={15} />
            Add image
            <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={addImage} />
          </label>

          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
            {activeTool === 'select'
              ? 'Select a layer to move, resize, edit, or delete it.'
              : activeTool === 'edit-text'
                ? 'Click a detected text box to cover it and add editable replacement text.'
              : activeTool === 'image'
                ? 'Click the PDF page to place the selected image.'
                : 'Click the PDF page to place the selected tool.'}
          </div>

          {pageCount ? (
            <div className="flex items-center gap-2">
              <button className="btn-secondary px-3" type="button" disabled={pageNumber <= 1} onClick={() => setPageNumber(current => current - 1)}>
                Prev
              </button>
              <div className="text-sm flex-1 text-center" style={{ color: 'var(--text-muted)' }}>
                Page {pageNumber} / {pageCount}
              </div>
              <button className="btn-secondary px-3" type="button" disabled={pageNumber >= pageCount} onClick={() => setPageNumber(current => current + 1)}>
                Next
              </button>
            </div>
          ) : null}

          {pageCount ? (
            <div className="space-y-2">
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Zoom {Math.round(zoom * 100)}%
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className="btn-secondary justify-center px-2" type="button" onClick={() => setZoom(current => Math.max(0.75, Number((current - 0.15).toFixed(2))))}>
                  -
                </button>
                <button className="btn-secondary justify-center px-2" type="button" onClick={() => setZoom(1)}>
                  100%
                </button>
                <button className="btn-secondary justify-center px-2" type="button" onClick={() => setZoom(current => Math.min(2.25, Number((current + 0.15).toFixed(2))))}>
                  +
                </button>
              </div>
            </div>
          ) : null}
        </aside>

        <main ref={stageRef} className="min-h-[520px] overflow-auto rounded-lg border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
          {!file ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center text-center gap-3" style={{ color: 'var(--text-muted)' }}>
              <FileImage size={34} />
              <div>
                <p className="font-display font-bold" style={{ color: 'var(--text)' }}>Choose a PDF to start editing</p>
                <p className="text-sm mt-1">Then add text, images, shapes, or whiteout blocks on the page.</p>
              </div>
            </div>
          ) : (
            <div
              className="relative mx-auto shadow-lg"
              style={{ width: pageSize.viewWidth || 1, height: pageSize.viewHeight || 1, background: '#fff' }}
              onClick={addLayerAt}
            >
              <canvas ref={canvasRef} className="block" />
              {(showDetectedText || activeTool === 'edit-text') ? textBoxes.map(box => (
                <button
                  key={box.id}
                  type="button"
                  className="absolute text-left"
                  style={{
                    left: box.left,
                    top: box.top,
                    width: box.width,
                    height: box.height,
                    border: activeTool === 'edit-text' ? '1px dashed var(--accent)' : '1px dashed rgba(37,99,235,0.45)',
                    background: activeTool === 'edit-text' ? 'rgba(249,83,14,0.08)' : 'rgba(37,99,235,0.05)',
                    color: 'transparent',
                    cursor: activeTool === 'edit-text' ? 'text' : 'default',
                  }}
                  title={box.text}
                  onClick={event => {
                    event.stopPropagation()
                    if (activeTool === 'edit-text') replaceDetectedText(box)
                  }}
                >
                  {box.text}
                </button>
              )) : null}
              {visibleLayers.map(layer => {
                const left = layer.x * pageSize.scale
                const top = (pageSize.height - layer.y - layer.height) * pageSize.scale
                const width = layer.width * pageSize.scale
                const height = layer.height * pageSize.scale
                const isSelected = layer.id === selectedId

                return (
                  <div
                    key={layer.id}
                    role="button"
                    tabIndex={0}
                    className="absolute border text-left"
                    style={{
                      left,
                      top,
                      width,
                      height,
                      borderColor: isSelected ? 'var(--accent)' : 'rgba(37,99,235,0.45)',
                      background: layer.type === 'rect' || layer.type === 'whiteout' ? layer.fillColor : 'transparent',
                      opacity: layer.opacity,
                      cursor: 'move',
                    }}
                    onClick={event => {
                      event.stopPropagation()
                      setSelectedId(layer.id)
                      setActiveTool('select')
                    }}
                    onPointerDown={event => {
                      event.stopPropagation()
                      setSelectedId(layer.id)
                      interactionRef.current = {
                        id: layer.id,
                        mode: 'move',
                        startClientX: event.clientX,
                        startClientY: event.clientY,
                        startX: layer.x,
                        startY: layer.y,
                        startWidth: layer.width,
                        startHeight: layer.height,
                      }
                    }}
                  >
                    {layer.type === 'text' ? (
                      <div
                        className="w-full h-full overflow-hidden px-1"
                        style={{
                          color: layer.color,
                          fontSize: `${layer.fontSize * pageSize.scale}px`,
                          fontWeight: layer.bold ? 700 : 400,
                          lineHeight: 1.2,
                        }}
                      >
                        {layer.text}
                      </div>
                    ) : null}
                    {layer.type === 'image' ? (
                      <img src={layer.previewUrl} alt="" className="w-full h-full object-fill pointer-events-none" />
                    ) : null}
                    {isSelected ? (
                      <span
                        className="absolute w-3 h-3 rounded-full"
                        style={{ right: -6, bottom: -6, background: 'var(--accent)', cursor: 'nwse-resize' }}
                        onPointerDown={event => {
                          event.stopPropagation()
                          interactionRef.current = {
                            id: layer.id,
                            mode: 'resize',
                            startClientX: event.clientX,
                            startClientY: event.clientY,
                            startX: layer.x,
                            startY: layer.y,
                            startWidth: layer.width,
                            startHeight: layer.height,
                          }
                        }}
                      />
                    ) : null}
                  </div>
                )
              })}
              {isRendering ? (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.65)' }}>
                  <ProcessingSpinner />
                </div>
              ) : null}
            </div>
          )}
        </main>

        <aside className="space-y-4">
          <div className="card p-4 space-y-4">
            <h2 className="section-title">Selected layer</h2>
            {selectedLayer ? (
              <div className="space-y-3">
                {selectedLayer.type === 'text' ? (
                  <>
                    <textarea className="input-field min-h-24" value={selectedLayer.text} onChange={event => updateLayer(selectedId, { text: event.target.value })} />
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input-field" type="number" min="6" max="160" value={selectedLayer.fontSize} onChange={event => updateLayer(selectedId, { fontSize: Number(event.target.value) })} />
                      <button className={selectedLayer.bold ? 'btn-primary justify-center' : 'btn-secondary justify-center'} type="button" onClick={() => updateLayer(selectedId, { bold: !selectedLayer.bold })}>
                        Bold
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {textColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          aria-label={color}
                          className="w-8 h-8 rounded-md border"
                          style={{ background: color, borderColor: selectedLayer.color === color ? 'var(--accent)' : 'var(--border)' }}
                          onClick={() => updateLayer(selectedId, { color })}
                        />
                      ))}
                    </div>
                  </>
                ) : null}

                {selectedLayer.type === 'rect' || selectedLayer.type === 'whiteout' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                      Fill
                      <input className="input-field h-10 p-1" type="color" value={selectedLayer.fillColor} onChange={event => updateLayer(selectedId, { fillColor: event.target.value })} />
                    </label>
                    <label className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                      Border
                      <input className="input-field h-10 p-1" type="color" value={selectedLayer.borderColor} onChange={event => updateLayer(selectedId, { borderColor: event.target.value })} />
                    </label>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                    Width
                    <input className="input-field" type="number" min="1" value={Math.round(selectedLayer.width)} onChange={event => updateLayer(selectedId, { width: Number(event.target.value) })} />
                  </label>
                  <label className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                    Height
                    <input className="input-field" type="number" min="1" value={Math.round(selectedLayer.height)} onChange={event => updateLayer(selectedId, { height: Number(event.target.value) })} />
                  </label>
                </div>

                <label className="text-xs space-y-1 block" style={{ color: 'var(--text-muted)' }}>
                  Opacity
                  <input className="w-full" type="range" min="0.05" max="1" step="0.05" value={selectedLayer.opacity} onChange={event => updateLayer(selectedId, { opacity: Number(event.target.value) })} />
                </label>

                <button className="btn-secondary w-full justify-center" type="button" onClick={deleteSelected}>
                  Delete layer
                </button>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Select a layer on the page to edit its text, size, color, or opacity.
              </p>
            )}
          </div>

          {error ? (
            <div className="rounded-lg px-4 py-3 text-sm flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.08)', color: '#b91c1c' }}>
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {isSubmitting ? <ProcessingSpinner /> : null}
          {result ? <ResultCard {...result} /> : null}
        </aside>
      </div>
    </div>
  )
}
