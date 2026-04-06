import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'order',
    label: 'Page order',
    placeholder: '[0,2,1,3]',
    helpText: 'Use zero-based page indexes. Leave blank to keep the current order.',
    fullWidth: true,
  },
  {
    name: 'deletePages',
    label: 'Delete pages',
    placeholder: '[4,5]',
    helpText: 'Optional zero-based indexes to remove before saving.',
    fullWidth: true,
  },
]

export default function ReorderPDF() {
  return (
    <ToolPage
      title="Reorder Pages"
      description="Rebuild a PDF with a custom page order and optional page removals."
      endpoint="/api/pdf/reorder"
      accept="application/pdf"
      fields={fields}
      buildPayload={({ formData, values }) => {
        if (values.order.trim()) formData.append('order', values.order)
        if (values.deletePages.trim()) formData.append('deletePages', values.deletePages)
      }}
      successMessage={() => 'The reordered PDF is ready.'}
    />
  )
}
