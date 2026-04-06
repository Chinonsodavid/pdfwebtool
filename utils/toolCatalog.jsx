import {
  Layers,
  Scissors,
  Minimize2,
  ImagePlus,
  GalleryThumbnails,
  RotateCw,
  LayoutGrid,
  Stamp,
  Lock,
  Unlock,
  FileText,
  Hash,
  Crop,
  FileOutput,
  ScanSearch,
  Signature,
  BadgeInfo,
  FilePlus2,
  Boxes,
} from 'lucide-react'

export const toolCategories = [
  {
    id: 'organize',
    label: 'Organize',
    description: 'Clean up page order, split large files, and rebuild documents.',
  },
  {
    id: 'convert',
    label: 'Convert',
    description: 'Move between PDF, image, and text workflows without leaving the browser.',
  },
  {
    id: 'edit',
    label: 'Edit',
    description: 'Add visible document polish like labels, crops, signatures, and watermarks.',
  },
  {
    id: 'secure',
    label: 'Secure',
    description: 'Control access, update metadata, and prepare documents for distribution.',
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
    color: '#10b981', bg: '#f0fdf4', category: 'convert',
  },
  {
    id: 'pdf-to-image', path: '/pdf-to-image', icon: GalleryThumbnails, label: 'PDF to Image',
    desc: 'Export PDF pages as PNG or JPG',
    color: '#f59e0b', bg: '#fffbeb', category: 'convert',
  },
  {
    id: 'extract-text', path: '/extract-text', icon: FileText, label: 'PDF to Text',
    desc: 'Extract searchable text into a TXT file',
    color: '#0f766e', bg: '#ecfeff', category: 'convert',
  },
  {
    id: 'ocr', path: '/ocr', icon: ScanSearch, label: 'OCR PDF',
    desc: 'Recognize text from scanned or image PDFs',
    color: '#059669', bg: '#ecfdf5', category: 'convert',
  },
  {
    id: 'compress', path: '/compress', icon: Minimize2, label: 'Compress PDF',
    desc: 'Reduce file size with quality options',
    color: '#0ea5e9', bg: '#f0f9ff', category: 'edit',
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
