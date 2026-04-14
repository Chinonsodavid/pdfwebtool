import ToolPage from '../components/ToolPage'

export default function PowerPointToPDF() {
  return (
    <ToolPage
      title="PowerPoint to PDF"
      description="Convert PPTX or PPT presentations into PDF with LibreOffice."
      endpoint="/api/pdf/powerpoint-to-pdf"
      accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
      successMessage={() => 'Your presentation PDF is ready.'}
    />
  )
}
