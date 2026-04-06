import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'signerName',
    label: 'Signer name',
    defaultValue: 'Approved',
  },
  {
    name: 'note',
    label: 'Note',
    defaultValue: '',
    placeholder: 'John Doe • 2026-04-06',
  },
  {
    name: 'page',
    label: 'Page',
    type: 'number',
    defaultValue: '1',
    min: 1,
  },
  {
    name: 'position',
    label: 'Position',
    type: 'select',
    defaultValue: 'bottom-right',
    options: [
      { value: 'bottom-left', label: 'Bottom left' },
      { value: 'bottom-center', label: 'Bottom center' },
      { value: 'bottom-right', label: 'Bottom right' },
      { value: 'top-left', label: 'Top left' },
      { value: 'top-center', label: 'Top center' },
      { value: 'top-right', label: 'Top right' },
      { value: 'center', label: 'Center' },
    ],
  },
  {
    name: 'signatureImage',
    label: 'Optional signature image',
    type: 'file',
    accept: 'image/png,image/jpeg,image/webp,image/gif',
    helpText: 'If provided, the image is used instead of typed signature text.',
    fullWidth: true,
  },
  {
    name: 'imageWidth',
    label: 'Image width',
    type: 'number',
    defaultValue: '140',
    min: 40,
    max: 400,
  },
]

export default function SignPDF() {
  return (
    <ToolPage
      title="Sign PDF"
      description="Add a typed signature or place a signature image on a chosen page."
      endpoint="/api/pdf/sign"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'The signed PDF is ready.'}
    />
  )
}
