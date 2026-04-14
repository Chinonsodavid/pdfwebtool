import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'pages',
    label: 'Pages',
    defaultValue: 'all',
    placeholder: 'all or 1,3,5',
    helpText: 'Builds an Excel sheet from extractable table-like PDF text.',
  },
]

export default function PDFToExcel() {
  return (
    <ToolPage
      title="PDF to Excel"
      description="Convert extractable table-like PDF text into an XLSX spreadsheet."
      endpoint="/api/pdf/pdf-to-excel"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `Converted ${data.pages} page${data.pages === 1 ? '' : 's'} into ${data.rows} spreadsheet row${data.rows === 1 ? '' : 's'}.`}
    />
  )
}
