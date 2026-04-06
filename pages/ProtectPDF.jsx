import ToolPage from '../components/ToolPage'

const fields = [
  { name: 'userPassword', label: 'Open password', type: 'password' },
  {
    name: 'ownerPassword',
    label: 'Owner password',
    type: 'password',
    helpText: 'Optional. Leave blank to derive one automatically.',
  },
]

export default function ProtectPDF() {
  return (
    <ToolPage
      title="Protect PDF"
      description="Add password protection and restrict editing or copying."
      endpoint="/api/pdf/protect"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'The protected PDF is ready.'}
    />
  )
}
