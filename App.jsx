import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import { LanguageProvider } from './hooks/useLanguage'
import Layout from './components/Layout'
import PageLoader from './components/PageLoader'
import { lazy, Suspense, useEffect } from 'react'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Guides = lazy(() => import('./pages/Guides'))
const GuideArticle = lazy(() => import('./pages/GuideArticle'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const InfoPage = lazy(() => import('./pages/InfoPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const SeoToolLanding = lazy(() => import('./pages/SeoToolLanding'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

const MergePDF = lazy(() => import('./pages/MergePDF'))
const SplitPDF = lazy(() => import('./pages/SplitPDF'))
const CompressPDF = lazy(() => import('./pages/CompressPDF'))
const ImageToPDF = lazy(() => import('./pages/ImageToPDF'))
const PDFToImage = lazy(() => import('./pages/PDFToImage'))
const WordToPDF = lazy(() => import('./pages/WordToPDF'))
const PDFToWord = lazy(() => import('./pages/PDFToWord'))
const PDFToExcel = lazy(() => import('./pages/PDFToExcel'))
const ExcelToPDF = lazy(() => import('./pages/ExcelToPDF'))
const PowerPointToPDF = lazy(() => import('./pages/PowerPointToPDF'))
const PDFToPowerPoint = lazy(() => import('./pages/PDFToPowerPoint'))
const RotatePDF = lazy(() => import('./pages/RotatePDF'))
const ReorderPDF = lazy(() => import('./pages/ReorderPDF'))
const WatermarkPDF = lazy(() => import('./pages/WatermarkPDF'))
const EditPDF = lazy(() => import('./pages/EditPDF'))
const ProtectPDF = lazy(() => import('./pages/ProtectPDF'))
const UnlockPDF = lazy(() => import('./pages/UnlockPDF'))
const ExtractTextPDF = lazy(() => import('./pages/ExtractTextPDF'))
const PageLabelsPDF = lazy(() => import('./pages/PageLabelsPDF'))
const CropPDF = lazy(() => import('./pages/CropPDF'))
const ExtractPagesPDF = lazy(() => import('./pages/ExtractPagesPDF'))
const OCRPDF = lazy(() => import('./pages/OCRPDF'))
const SignPDF = lazy(() => import('./pages/SignPDF'))
const MetadataPDF = lazy(() => import('./pages/MetadataPDF'))
const PageManagerPDF = lazy(() => import('./pages/PageManagerPDF'))
const BatchPDF = lazy(() => import('./pages/BatchPDF'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const id = hash.slice(1);
      let attempts = 0;
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempts < 15) {
          attempts++;
          setTimeout(scrollToElement, 80);
        }
      };
      scrollToElement();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ScrollToHash />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="*"
              element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>

                      <Route path="/" element={<LandingPage />} />
                      <Route path="/tools" element={<Dashboard />} />
                      <Route path="/guides" element={<Guides />} />
                      <Route path="/guides/:slug" element={<GuideArticle />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/faq" element={<FaqPage />} />
                      <Route path="/about" element={<InfoPage pageKey="about" />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy" element={<InfoPage pageKey="privacy" />} />
                      <Route path="/terms" element={<InfoPage pageKey="terms" />} />
                      <Route path="/cookies" element={<InfoPage pageKey="cookies" />} />
                      <Route path="/disclaimer" element={<InfoPage pageKey="disclaimer" />} />
                      <Route path="/copyright" element={<InfoPage pageKey="copyright" />} />
                      <Route path="/file-handling" element={<InfoPage pageKey="file-handling" />} />

                      <Route path="/merge" element={<MergePDF />} />
                      <Route path="/split" element={<SplitPDF />} />
                      <Route path="/compress" element={<CompressPDF />} />
                      <Route path="/image-to-pdf" element={<ImageToPDF />} />
                      <Route path="/pdf-to-image" element={<PDFToImage />} />
                      <Route path="/word-to-pdf" element={<WordToPDF />} />
                      <Route path="/pdf-to-word" element={<PDFToWord />} />
                      <Route path="/pdf-to-excel" element={<PDFToExcel />} />
                      <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
                      <Route path="/powerpoint-to-pdf" element={<PowerPointToPDF />} />
                      <Route path="/pdf-to-powerpoint" element={<PDFToPowerPoint />} />
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
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/convert/:slug" element={<SeoToolLanding />} />
                      <Route path="/tools/:slug" element={<SeoToolLanding />} />
                      <Route path="/compress/:slug" element={<SeoToolLanding />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  )
}
