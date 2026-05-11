import {
  Layers,
  Scissors,
  Minimize2,
  ImagePlus,
  GalleryThumbnails,
  FileSpreadsheet,
  Presentation,
  RotateCw,
  LayoutGrid,
  Stamp,
  Lock,
  Unlock,
  FileText,
  FileType2,
  Hash,
  Crop,
  FileOutput,
  ScanSearch,
  Signature,
  BadgeInfo,
  FilePenLine,
  FilePlus2,
  Boxes,
} from 'lucide-react'

export const toolCategories = [
  {
    id: 'organize',
    label: 'Organize PDF',
    description: 'Clean up page order, split large files, and rebuild documents.',
  },
  {
    id: 'optimize',
    label: 'Optimize PDF',
    description: 'Reduce file size and prepare scanned documents for cleaner use.',
  },
  {
    id: 'convert-to',
    label: 'Convert to PDF',
    description: 'Turn images, Word files, spreadsheets, and presentations into PDFs.',
  },
  {
    id: 'convert-from',
    label: 'Convert from PDF',
    description: 'Export PDF content into images, Office files, text, and spreadsheets.',
  },
  {
    id: 'edit',
    label: 'Edit PDF',
    description: 'Add visible document polish like labels, crops, signatures, and watermarks.',
  },
  {
    id: 'secure',
    label: 'PDF Security',
    description: 'Control access, update metadata, and prepare documents for distribution.',
  },
  {
    id: 'extract',
    label: 'OCR & Extract',
    description: 'Read text from searchable, scanned, or image-based PDFs.',
  },
]

export const tools = [
  {
    id: 'merge', path: '/merge', icon: Layers, label: 'Merge PDF',
    desc: 'Combine multiple PDFs into one document',
    color: '#f9530e', bg: '#fff4ed', category: 'organize',
  },
  {
    id: 'split', path: '/split', icon: Scissors, label: 'Split PDF',
    desc: 'Extract pages or split by range',
    color: '#8b5cf6', bg: '#f5f3ff', category: 'organize',
  },
  {
    id: 'reorder', path: '/reorder', icon: LayoutGrid, label: 'Reorder Pages',
    desc: 'Delete or rearrange PDF pages',
    color: '#6366f1', bg: '#eef2ff', category: 'organize',
  },
  {
    id: 'extract-pages', path: '/extract-pages', icon: FileOutput, label: 'Extract Pages',
    desc: 'Save chosen pages as separate PDFs in a ZIP',
    color: '#1d4ed8', bg: '#eff6ff', category: 'organize',
  },
  {
    id: 'page-manager', path: '/page-manager', icon: FilePlus2, label: 'Add / Remove Pages',
    desc: 'Insert blank pages or another PDF and remove pages',
    color: '#4338ca', bg: '#eef2ff', category: 'organize',
  },
  {
    id: 'image-to-pdf', path: '/image-to-pdf', icon: ImagePlus, label: 'Image to PDF',
    desc: 'Convert JPG, PNG images to PDF',
    color: '#10b981', bg: '#f0fdf4', category: 'convert-to',
  },
  {
    id: 'pdf-to-image', path: '/pdf-to-image', icon: GalleryThumbnails, label: 'PDF to Image',
    desc: 'Export PDF pages as PNG or JPG',
    color: '#f59e0b', bg: '#fffbeb', category: 'convert-from',
  },
  {
    id: 'word-to-pdf', path: '/word-to-pdf', icon: FileType2, label: 'Word to PDF',
    desc: 'Convert DOCX or DOC documents into PDF',
    color: '#2563eb', bg: '#eff6ff', category: 'convert-to',
  },
  {
    id: 'pdf-to-word', path: '/pdf-to-word', icon: FileType2, label: 'PDF to Word',
    desc: 'Convert extractable PDF text into DOCX',
    color: '#2563eb', bg: '#eff6ff', category: 'convert-from',
  },
  {
    id: 'pdf-to-excel', path: '/pdf-to-excel', icon: FileSpreadsheet, label: 'PDF to Excel',
    desc: 'Convert table-like PDF text into XLSX',
    color: '#16a34a', bg: '#f0fdf4', category: 'convert-from',
  },
  {
    id: 'excel-to-pdf', path: '/excel-to-pdf', icon: FileSpreadsheet, label: 'Excel to PDF',
    desc: 'Convert spreadsheets into PDF',
    color: '#15803d', bg: '#f0fdf4', category: 'convert-to',
  },
  {
    id: 'powerpoint-to-pdf', path: '/powerpoint-to-pdf', icon: Presentation, label: 'PowerPoint to PDF',
    desc: 'Convert presentations into PDF',
    color: '#dc2626', bg: '#fef2f2', category: 'convert-to',
  },
  {
    id: 'pdf-to-powerpoint', path: '/pdf-to-powerpoint', icon: Presentation, label: 'PDF to PowerPoint',
    desc: 'Turn PDF pages into slides',
    color: '#b91c1c', bg: '#fef2f2', category: 'convert-from',
  },
  {
    id: 'extract-text', path: '/extract-text', icon: FileText, label: 'PDF to Text',
    desc: 'Extract searchable text into a TXT file',
    color: '#0f766e', bg: '#ecfeff', category: 'extract',
  },
  {
    id: 'ocr', path: '/ocr', icon: ScanSearch, label: 'OCR PDF',
    desc: 'Recognize text from scanned or image PDFs',
    color: '#059669', bg: '#ecfdf5', category: 'extract',
  },
  {
    id: 'compress', path: '/compress', icon: Minimize2, label: 'Compress PDF',
    desc: 'Reduce file size with quality options',
    color: '#0ea5e9', bg: '#f0f9ff', category: 'optimize',
  },
  {
    id: 'rotate', path: '/rotate', icon: RotateCw, label: 'Rotate PDF',
    desc: 'Rotate pages to any angle',
    color: '#ec4899', bg: '#fdf2f8', category: 'edit',
  },
  {
    id: 'watermark', path: '/watermark', icon: Stamp, label: 'Watermark',
    desc: 'Add custom text watermark to PDF',
    color: '#14b8a6', bg: '#f0fdfa', category: 'edit',
  },
  {
    id: 'edit', path: '/edit', icon: FilePenLine, label: 'Edit PDF',
    desc: 'Replace detected text and add overlays',
    color: '#0891b2', bg: '#ecfeff', category: 'edit',
  },
  {
    id: 'page-labels', path: '/page-labels', icon: Hash, label: 'Headers & Footers',
    desc: 'Add page numbers, headers, and footers',
    color: '#7c3aed', bg: '#f5f3ff', category: 'edit',
  },
  {
    id: 'crop', path: '/crop', icon: Crop, label: 'Crop PDF',
    desc: 'Trim margins from selected pages',
    color: '#ea580c', bg: '#fff7ed', category: 'edit',
  },
  {
    id: 'sign', path: '/sign', icon: Signature, label: 'Sign PDF',
    desc: 'Place a typed or image-based signature',
    color: '#be123c', bg: '#fff1f2', category: 'edit',
  },
  {
    id: 'protect', path: '/protect', icon: Lock, label: 'Protect PDF',
    desc: 'Password-protect your PDF file',
    color: '#ef4444', bg: '#fef2f2', category: 'secure',
  },
  {
    id: 'unlock', path: '/unlock', icon: Unlock, label: 'Unlock PDF',
    desc: 'Remove password from a PDF',
    color: '#84cc16', bg: '#f7fee7', category: 'secure',
  },
  {
    id: 'metadata', path: '/metadata', icon: BadgeInfo, label: 'Edit Metadata',
    desc: 'Update title, author, keywords, and more',
    color: '#475569', bg: '#f8fafc', category: 'secure',
  },
  {
    id: 'batch', path: '/batch', icon: Boxes, label: 'Batch Processing',
    desc: 'Apply one action across many PDF files at once',
    color: '#b45309', bg: '#fffbeb', category: 'secure',
  },
]

export const primaryNavTools = ['merge', 'split', 'compress'].map(id => tools.find(tool => tool.id === id)).filter(Boolean)

export const toolGroups = toolCategories.map(category => ({
  ...category,
  tools: tools.filter(tool => tool.category === category.id),
})).filter(group => group.tools.length)
