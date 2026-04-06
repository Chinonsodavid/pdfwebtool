import ToolPage from '../components/ToolPage'

export default function ImageToPDF() {
  return (
    <ToolPage
      title="Image to PDF"
      description="Turn JPG, PNG, WebP, or GIF images into a single PDF document."
      endpoint="/api/pdf/image-to-pdf"
      accept="image/jpeg,image/png,image/webp,image/gif"
      multiple
      buildPayload={({ formData, files }) => {
        formData.append('order', JSON.stringify(files.map((_, index) => index)))
      }}
      successMessage={() => 'Your image-based PDF is ready.'}
    />
  )
}
