import ToolPage from '../components/ToolPage'

const fields = [
  { name: 'text', label: 'Watermark text', defaultValue: 'CONFIDENTIAL' },
  { name: 'fontSize', label: 'Font size', type: 'number', defaultValue: '48', min: 8, max: 200 },
  { name: 'opacity', label: 'Opacity', type: 'number', defaultValue: '0.3', min: 0.05, max: 1, step: 0.05 },
  {
    name: 'position',
    label: 'Position',
    type: 'select',
    defaultValue: 'center',
    options: [
      { value: 'center', label: 'Center' },
      { value: 'diagonal', label: 'Diagonal' },
      { value: 'top-left', label: 'Top left' },
      { value: 'top-right', label: 'Top right' },
      { value: 'bottom-left', label: 'Bottom left' },
      { value: 'bottom-right', label: 'Bottom right' },
    ],
  },
  { name: 'color', label: 'Hex color', defaultValue: '#FF0000' },
]

export default function WatermarkPDF() {
  return (
    <ToolPage
      title="Watermark PDF"
      description="Stamp every page with text, color, opacity, and placement options."
      endpoint="/api/pdf/watermark"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'The watermarked PDF is ready.'}
    />
  )
}
