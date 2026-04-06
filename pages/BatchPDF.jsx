import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'action',
    label: 'Batch action',
    type: 'select',
    defaultValue: 'compress',
    options: [
      { value: 'compress', label: 'Compress' },
      { value: 'rotate', label: 'Rotate' },
      { value: 'watermark', label: 'Watermark' },
      { value: 'page-labels', label: 'Headers & footers' },
    ],
  },
  {
    name: 'level',
    label: 'Compression level',
    type: 'select',
    defaultValue: 'medium',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
  {
    name: 'angle',
    label: 'Rotation',
    type: 'select',
    defaultValue: '90',
    options: [
      { value: '90', label: '90°' },
      { value: '180', label: '180°' },
      { value: '270', label: '270°' },
    ],
  },
  {
    name: 'text',
    label: 'Watermark text',
    defaultValue: 'CONFIDENTIAL',
  },
  {
    name: 'footerText',
    label: 'Footer text',
    defaultValue: 'Page {page} of {total}',
    helpText: 'Used when the action is set to headers & footers.',
    fullWidth: true,
  },
]

export default function BatchPDF() {
  return (
    <ToolPage
      title="Batch Processing"
      description="Upload many PDFs and apply the same operation to all of them in one ZIP download."
      endpoint="/api/pdf/batch"
      accept="application/pdf"
      multiple
      fields={fields}
      successMessage={data => `Processed ${data.files} PDF file${data.files === 1 ? '' : 's'} in one batch ZIP.`}
    />
  )
}
