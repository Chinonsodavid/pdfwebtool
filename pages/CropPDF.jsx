import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'pages',
    label: 'Pages',
    defaultValue: 'all',
    placeholder: 'all or 1-3,5',
  },
  {
    name: 'top',
    label: 'Top margin',
    type: 'number',
    defaultValue: '24',
    min: 0,
  },
  {
    name: 'right',
    label: 'Right margin',
    type: 'number',
    defaultValue: '24',
    min: 0,
  },
  {
    name: 'bottom',
    label: 'Bottom margin',
    type: 'number',
    defaultValue: '24',
    min: 0,
  },
  {
    name: 'left',
    label: 'Left margin',
    type: 'number',
    defaultValue: '24',
    min: 0,
  },
]

export default function CropPDF() {
  return (
    <ToolPage
      title="Crop PDF"
      description="Trim equal or custom margins from selected pages."
      endpoint="/api/pdf/crop"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'The cropped PDF is ready.'}
    />
  )
}
