export default function ProcessingSpinner({ label = 'Processing…' }) {
  return (
    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
      <span className="inline-block w-4 h-4 rounded-full border-2 border-transparent border-t-current animate-spin" />
      {label}
    </div>
  )
}
