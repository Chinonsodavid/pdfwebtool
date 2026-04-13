import ToolPage from '../components/ToolPage'

const fields = [
  { name: 'password', label: 'Current password', type: 'password', required: true },
]

export default function UnlockPDF() {
  return (
    <ToolPage
      title="Unlock PDF"
      description="Remove a known password from an encrypted PDF."
      endpoint="/api/pdf/unlock"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'The unlocked PDF is ready.'}
    />
  )
}
