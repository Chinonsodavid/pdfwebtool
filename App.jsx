import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import ImageToPDF from './pages/ImageToPDF'
import PDFToImage from './pages/PDFToImage'
import PDFToWord from './pages/PDFToWord'
import RotatePDF from './pages/RotatePDF'
import ReorderPDF from './pages/ReorderPDF'
import WatermarkPDF from './pages/WatermarkPDF'
import EditPDF from './pages/EditPDF'
import ProtectPDF from './pages/ProtectPDF'
import UnlockPDF from './pages/UnlockPDF'
import ExtractTextPDF from './pages/ExtractTextPDF'
import PageLabelsPDF from './pages/PageLabelsPDF'
import CropPDF from './pages/CropPDF'
import ExtractPagesPDF from './pages/ExtractPagesPDF'
import OCRPDF from './pages/OCRPDF'
import SignPDF from './pages/SignPDF'
import MetadataPDF from './pages/MetadataPDF'
import PageManagerPDF from './pages/PageManagerPDF'
import BatchPDF from './pages/BatchPDF'

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tools" element={<Dashboard />} />
          <Route path="/merge" element={<MergePDF />} />
          <Route path="/split" element={<SplitPDF />} />
          <Route path="/compress" element={<CompressPDF />} />
          <Route path="/image-to-pdf" element={<ImageToPDF />} />
          <Route path="/pdf-to-image" element={<PDFToImage />} />
          <Route path="/pdf-to-word" element={<PDFToWord />} />
          <Route path="/rotate" element={<RotatePDF />} />
          <Route path="/reorder" element={<ReorderPDF />} />
          <Route path="/watermark" element={<WatermarkPDF />} />
          <Route path="/edit" element={<EditPDF />} />
          <Route path="/protect" element={<ProtectPDF />} />
          <Route path="/unlock" element={<UnlockPDF />} />
          <Route path="/extract-text" element={<ExtractTextPDF />} />
          <Route path="/page-labels" element={<PageLabelsPDF />} />
          <Route path="/crop" element={<CropPDF />} />
          <Route path="/extract-pages" element={<ExtractPagesPDF />} />
          <Route path="/ocr" element={<OCRPDF />} />
          <Route path="/sign" element={<SignPDF />} />
          <Route path="/metadata" element={<MetadataPDF />} />
          <Route path="/page-manager" element={<PageManagerPDF />} />
          <Route path="/batch" element={<BatchPDF />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}
