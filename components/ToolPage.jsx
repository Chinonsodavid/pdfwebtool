import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import FileDropzone from './FileDropzone'
import ProcessingSpinner from './ProcessingSpinner'
import ResultCard from './ResultCard'
import { api, withApiBase } from '../utils/api'

function TextField({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return (
      <textarea
        className="input-field min-h-28 resize-y"
        value={value}
        placeholder={field.placeholder}
        required={field.required}
        onChange={event => onChange(field.name, event.target.value)}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <select className="select-field" value={value} onChange={event => onChange(field.name, event.target.value)}>
        {field.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="inline-flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={event => onChange(field.name, event.target.checked)}
        />
        <span>{field.checkboxLabel || field.label}</span>
      </label>
    )
  }

  if (field.type === 'file') {
    const fileNames = Array.isArray(value)
      ? value.map(file => file.name).join(', ')
      : value?.name

    return (
      <div className="space-y-2">
        <input
          className="input-field"
          type="file"
          accept={field.accept}
          multiple={field.multiple}
          onChange={event => onChange(field.name, field.multiple ? Array.from(event.target.files || []) : event.target.files?.[0] || null)}
        />
        {fileNames ? (
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {fileNames}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <input
      className="input-field"
      type={field.type || 'text'}
      min={field.min}
      max={field.max}
      step={field.step}
      value={value}
      placeholder={field.placeholder}
      required={field.required}
      onChange={event => onChange(field.name, event.target.value)}
    />
  )
}

export default function ToolPage({
  title,
  description,
  endpoint,
  accept,
  multiple = false,
  fields = [],
  buildPayload,
  successMessage,
}) {
  const [files, setFiles] = useState([])
  const [values, setValues] = useState(
    Object.fromEntries(fields.map(field => [field.name, field.defaultValue ?? (field.type === 'checkbox' ? false : field.type === 'file' ? (field.multiple ? [] : null) : '')])),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function updateValue(name, value) {
    setValues(current => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!files.length) {
      setError(multiple ? 'Choose at least one file before continuing.' : 'Choose a file before continuing.')
      return
    }

    const formData = new FormData()
    const selectedFiles = Array.from(files)

    if (multiple) {
      selectedFiles.forEach(file => formData.append('files', file))
    } else {
      formData.append('file', selectedFiles[0])
    }

    if (buildPayload) {
      buildPayload({ formData, values, files: selectedFiles })
    } else {
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length && value[0] instanceof File) {
          value.forEach(file => formData.append(key, file))
        } else if (value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'boolean') {
          formData.append(key, String(value))
        } else if (value !== '' && value !== undefined && value !== null) {
          formData.append(key, value)
        }
      })
    }

    setIsSubmitting(true)

    try {
      const { data } = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setResult({
        title: `${title} complete`,
        description: successMessage?.(data) || 'Your processed file is ready to download.',
        downloadUrl: withApiBase(data.url),
      })
    } catch (submitError) {
      setError(submitError.response?.data?.error || submitError.message || 'Request failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start animate-fade-in">
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            PDF tool
          </p>
          <h1 className="page-title">{title}</h1>
          <p className="text-base max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        </div>

        <form className="card p-6 space-y-6" onSubmit={handleSubmit}>
          <FileDropzone
            files={files}
            onChange={nextFiles => setFiles(Array.from(nextFiles || []))}
            accept={accept}
            multiple={multiple}
            helperText={multiple ? 'Upload one or more files. The tool will process them in the order shown.' : 'Upload one file to continue.'}
          />

          {fields.length ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map(field => (
                <label key={field.name} className={field.fullWidth ? 'sm:col-span-2 space-y-2' : 'space-y-2'}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {field.label}
                  </span>
                  <TextField field={field} value={values[field.name]} onChange={updateValue} />
                  {field.helpText ? (
                    <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                      {field.helpText}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing…' : title}
            </button>
            {isSubmitting ? <ProcessingSpinner /> : null}
          </div>

          {error ? (
            <div className="rounded-xl px-4 py-3 text-sm flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.08)', color: '#b91c1c' }}>
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
        </form>
      </section>

      <aside className="space-y-5 lg:sticky lg:top-24">
        <div className="card p-5 space-y-3">
          <h2 className="section-title">How it works</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Files are uploaded to your local server, processed there, and cleaned up automatically after 30 minutes.
          </p>
        </div>

        {result ? <ResultCard {...result} /> : null}
      </aside>
    </div>
  )
}
