import { Navigate, useLocation } from 'react-router-dom'
import { SeoLandingProvider } from '../components/SeoLandingContext'
import { getSeoLandingByPath } from '../data/seoLandingPages'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import MergePDF from './MergePDF'
import SplitPDF from './SplitPDF'
import CompressPDF from './CompressPDF'
import ImageToPDF from './ImageToPDF'
import PDFToImage from './PDFToImage'
import WordToPDF from './WordToPDF'
import PDFToWord from './PDFToWord'
import PDFToExcel from './PDFToExcel'
import ExcelToPDF from './ExcelToPDF'
import PowerPointToPDF from './PowerPointToPDF'
import PDFToPowerPoint from './PDFToPowerPoint'
import EditPDF from './EditPDF'
import SignPDF from './SignPDF'
import UnlockPDF from './UnlockPDF'

const toolComponents = {
  merge: MergePDF,
  split: SplitPDF,
  compress: CompressPDF,
  'image-to-pdf': ImageToPDF,
  'pdf-to-image': PDFToImage,
  'word-to-pdf': WordToPDF,
  'pdf-to-word': PDFToWord,
  'pdf-to-excel': PDFToExcel,
  'excel-to-pdf': ExcelToPDF,
  'powerpoint-to-pdf': PowerPointToPDF,
  'pdf-to-powerpoint': PDFToPowerPoint,
  edit: EditPDF,
  sign: SignPDF,
  unlock: UnlockPDF,
}

export default function SeoToolLanding() {
  const location = useLocation()
  const landing = getSeoLandingByPath(location.pathname)
  const ToolComponent = landing ? toolComponents[landing.toolId] : null

  useDocumentMeta({
    title: landing?.title,
    description: landing?.metaDescription || landing?.description,
    canonicalPath: landing?.canonicalPath,
  })

  if (!landing || !ToolComponent) {
    return <Navigate to="/tools" replace />
  }

  return (
    <SeoLandingProvider value={landing}>
      <ToolComponent />
    </SeoLandingProvider>
  )
}
