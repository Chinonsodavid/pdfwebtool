import ToolPage from '../components/ToolPage'

export default function MergePDF() {
  return (
    <ToolPage
      title="Merge PDF"
      description="Combine multiple PDF files into one document in the order you upload them."
      endpoint="/api/pdf/merge"
      accept="application/pdf"
      multiple
      successMessage={() => 'Your merged PDF is ready to download.'}
    />
  )
}
