import ToolPage from '../components/ToolPage'

export default function ExcelToPDF() {
  return (
    <ToolPage
      title="Excel to PDF"
      description="Convert XLSX, XLS, or CSV spreadsheets into PDF with LibreOffice."
      endpoint="/api/pdf/excel-to-pdf"
      accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
      successMessage={() => 'Your spreadsheet PDF is ready.'}
    />
  )
}
