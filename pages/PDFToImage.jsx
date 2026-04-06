import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'format',
    label: 'Output format',
    type: 'select',
    defaultValue: 'png',
    options: [
      { value: 'png', label: 'PNG' },
      { value: 'jpg', label: 'JPG' },
    ],
  },
  {
    name: 'pages',
    label: 'Pages',
    defaultValue: 'all',
    placeholder: 'all or 1,3,5',
  },
]

export default function PDFToImage() {
  return (
    <ToolPage
      title="PDF to Image"
      description="Export selected PDF pages as images inside a ZIP archive."
      endpoint="/api/pdf/pdf-to-image"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `Rendered ${data.pages} page${data.pages === 1 ? '' : 's'} into a ZIP archive.`}
    />
  )
}
