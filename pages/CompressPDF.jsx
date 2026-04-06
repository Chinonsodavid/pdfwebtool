import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'level',
    label: 'Compression level',
    type: 'select',
    defaultValue: 'medium',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
]

export default function CompressPDF() {
  return (
    <ToolPage
      title="Compress PDF"
      description="Reduce PDF size by optimizing saved objects and stripping metadata."
      endpoint="/api/pdf/compress"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `Reduced file size from ${data.originalSize} bytes to ${data.newSize} bytes (${data.reduction}% change).`}
    />
  )
}
