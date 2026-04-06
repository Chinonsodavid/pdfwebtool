import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'mode',
    label: 'Split mode',
    type: 'select',
    defaultValue: 'ranges',
    options: [
      { value: 'ranges', label: 'Use page ranges' },
      { value: 'all', label: 'Split every page' },
    ],
  },
  {
    name: 'ranges',
    label: 'Page ranges',
    placeholder: '1-3,5,8-10',
    helpText: 'Ignored when split mode is set to every page.',
  },
]

export default function SplitPDF() {
  return (
    <ToolPage
      title="Split PDF"
      description="Extract chosen pages or split every page into its own PDF inside a ZIP file."
      endpoint="/api/pdf/split"
      accept="application/pdf"
      fields={fields}
      successMessage={data => `Created ${data.parts} split PDF file${data.parts === 1 ? '' : 's'} in a ZIP archive.`}
    />
  )
}
