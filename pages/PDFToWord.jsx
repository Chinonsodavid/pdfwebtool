import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'pages',
    label: 'Pages',
    defaultValue: 'all',
    placeholder: 'all or 1,3,5',
    helpText: 'Creates an editable Word document from extractable PDF text.',
  },
]

export default function PDFToWord() {
  return (
    <ToolPage
      title="PDF to Word"
      description="Convert extractable PDF text into an editable DOCX document."
      endpoint="/api/pdf/pdf-to-word"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `Converted ${data.pages} page${data.pages === 1 ? '' : 's'} into a Word document.`}
    />
  )
}
