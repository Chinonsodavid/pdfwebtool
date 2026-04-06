import ToolPage from '../components/ToolPage'

const fields = [
  { name: 'title', label: 'Title', defaultValue: '' },
  { name: 'author', label: 'Author', defaultValue: '' },
  { name: 'subject', label: 'Subject', defaultValue: '' },
  {
    name: 'keywords',
    label: 'Keywords',
    defaultValue: '',
    placeholder: 'invoice, signed, client-a',
    fullWidth: true,
  },
  { name: 'producer', label: 'Producer', defaultValue: '' },
  { name: 'creator', label: 'Creator', defaultValue: '' },
  { name: 'language', label: 'Language', defaultValue: 'en-US' },
  {
    name: 'clearExisting',
    label: 'Clear existing metadata first',
    type: 'checkbox',
    checkboxLabel: 'Remove old metadata before applying these values',
    defaultValue: false,
    fullWidth: true,
  },
]

export default function MetadataPDF() {
  return (
    <ToolPage
      title="Edit Metadata"
      description="Update title, author, subject, language, and keywords inside the PDF metadata."
      endpoint="/api/pdf/metadata"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'The metadata was updated successfully.'}
    />
  )
}
