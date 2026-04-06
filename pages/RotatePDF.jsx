import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'pages',
    label: 'Pages',
    defaultValue: 'all',
    placeholder: 'all or 1,3,5',
  },
  {
    name: 'angle',
    label: 'Rotation',
    type: 'select',
    defaultValue: '90',
    options: [
      { value: '90', label: '90°' },
      { value: '180', label: '180°' },
      { value: '270', label: '270°' },
    ],
  },
]

export default function RotatePDF() {
  return (
    <ToolPage
      title="Rotate PDF"
      description="Rotate all pages or a selected list of pages by 90°, 180°, or 270°."
      endpoint="/api/pdf/rotate"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'The rotated PDF is ready.'}
    />
  )
}
