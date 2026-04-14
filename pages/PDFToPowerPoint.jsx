import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'pages',
    label: 'Pages',
    defaultValue: 'all',
    placeholder: 'all or 1,3,5',
    helpText: 'Creates one PowerPoint slide per rendered PDF page.',
  },
]

export default function PDFToPowerPoint() {
  return (
    <ToolPage
      title="PDF to PowerPoint"
      description="Turn PDF pages into a PowerPoint deck with one page image per slide."
      endpoint="/api/pdf/pdf-to-powerpoint"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `Converted ${data.pages} page${data.pages === 1 ? '' : 's'} into PowerPoint slides.`}
    />
  )
}
