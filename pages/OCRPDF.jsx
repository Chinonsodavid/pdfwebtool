import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'pages',
    label: 'Pages',
    defaultValue: '1',
    placeholder: '1 or 1-3',
    helpText: 'OCR is slower than normal text extraction, so testing a page range first is a good idea.',
  },
  {
    name: 'language',
    label: 'Language',
    defaultValue: 'eng',
    placeholder: 'eng',
    helpText: 'Uses Tesseract language codes. English is available by default.',
  },
]

export default function OCRPDF() {
  return (
    <ToolPage
      title="OCR PDF"
      description="Recognize text from scanned or image-heavy PDF pages and download it as a text file."
      endpoint="/api/pdf/ocr"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `OCR finished for ${data.pages} page${data.pages === 1 ? '' : 's'}.`}
    />
  )
}
