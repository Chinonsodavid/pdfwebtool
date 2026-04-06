import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'pages',
    label: 'Pages to extract',
    placeholder: '1,3,5',
    helpText: 'Each selected page becomes its own PDF inside a ZIP file.',
    defaultValue: '1',
  },
]

export default function ExtractPagesPDF() {
  return (
    <ToolPage
      title="Extract Pages"
      description="Pull chosen pages out into separate single-page PDFs packed into a ZIP."
      endpoint="/api/pdf/extract-pages"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `Extracted ${data.pages} page${data.pages === 1 ? '' : 's'} into a ZIP archive.`}
    />
  )
}
