import ToolPage from '../components/ToolPage'

export default function WordToPDF() {
  return (
    <ToolPage
      title="Word to PDF"
      description="Convert DOCX or DOC documents into PDF with LibreOffice."
      endpoint="/api/pdf/word-to-pdf"
      accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
      successMessage={() => 'Your Word document PDF is ready.'}
    />
  )
}
