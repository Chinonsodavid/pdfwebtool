import ToolPage from '../components/ToolPage'

const fields = [
  {
    name: 'removePages',
    label: 'Remove pages',
    defaultValue: '',
    placeholder: '2,5,7',
    helpText: 'Optional page numbers to remove from the original PDF.',
    fullWidth: true,
  },
  {
    name: 'insertFile',
    label: 'Optional PDF to insert',
    type: 'file',
    accept: 'application/pdf',
    helpText: 'Upload a second PDF to insert into the main document.',
    fullWidth: true,
  },
  {
    name: 'insertAt',
    label: 'Insert at position',
    type: 'number',
    defaultValue: '1',
    min: 1,
    helpText: '1 inserts before the first remaining page. Use the next page number to append.',
  },
  {
    name: 'blankPages',
    label: 'Blank pages to insert',
    type: 'number',
    defaultValue: '0',
    min: 0,
  },
  {
    name: 'blankWidth',
    label: 'Blank page width',
    type: 'number',
    defaultValue: '595',
    min: 100,
  },
  {
    name: 'blankHeight',
    label: 'Blank page height',
    type: 'number',
    defaultValue: '842',
    min: 100,
  },
]

export default function PageManagerPDF() {
  return (
    <ToolPage
      title="Add / Remove Pages"
      description="Remove specific pages, insert blank pages, or insert another PDF at a chosen position."
      endpoint="/api/pdf/page-manager"
      accept="application/pdf"
      fields={fields}
      successMessage={() => 'The updated PDF is ready.'}
    />
  )
}
