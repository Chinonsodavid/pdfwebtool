import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'headerText',
    label: 'Header text',
    defaultValue: '',
    placeholder: 'Quarterly report',
  },
  {
    name: 'footerText',
    label: 'Footer text',
    defaultValue: 'Page {page} of {total}',
    placeholder: 'Page {page} of {total}',
    helpText: 'Use {page} and {total} placeholders.',
  },
  {
    name: 'headerPosition',
    label: 'Header position',
    type: 'select',
    defaultValue: 'top-center',
    options: [
      { value: 'top-left', label: 'Top left' },
      { value: 'top-center', label: 'Top center' },
      { value: 'top-right', label: 'Top right' },
    ],
  },
  {
    name: 'footerPosition',
    label: 'Footer position',
    type: 'select',
    defaultValue: 'bottom-center',
    options: [
      { value: 'bottom-left', label: 'Bottom left' },
      { value: 'bottom-center', label: 'Bottom center' },
      { value: 'bottom-right', label: 'Bottom right' },
    ],
  },
  {
    name: 'startNumber',
    label: 'Starting page number',
    type: 'number',
    defaultValue: '1',
    min: 1,
  },
  {
    name: 'fontSize',
    label: 'Font size',
    type: 'number',
    defaultValue: '11',
    min: 8,
    max: 36,
  },
  {
    name: 'color',
    label: 'Hex color',
    defaultValue: '#374151',
  },
  {
    name: 'padding',
    label: 'Padding',
    type: 'number',
    defaultValue: '20',
    min: 0,
    max: 120,
  },
]

export default function PageLabelsPDF() {
  return (
    <ToolPage
      title="Headers & Footers"
      description="Add page numbers, custom header text, and footer text to every page."
      endpoint="/api/pdf/page-labels"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'Headers and footers were added successfully.'}
    />
  )
}
