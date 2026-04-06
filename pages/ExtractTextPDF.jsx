import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'pages',
    label: 'Pages',
    defaultValue: 'all',
    placeholder: 'all or 1-3,5',
  },
]

export default function ExtractTextPDF() {
  return (
    <ToolPage
      title="PDF to Text"
      description="Extract selectable text from a PDF into a plain text file."
      endpoint="/api/pdf/extract-text"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `Extracted text from ${data.pages} page${data.pages === 1 ? '' : 's'}.`}
    />
  )
}
