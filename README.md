# PDFForge

Self-hosted PDF tools built with React, Vite, Tailwind CSS, and Express.

## Features

- Dashboard with file previews before processing
- Merge multiple PDFs
- Split PDFs by range or by page
- Compress PDFs
- Convert images to PDF
- Convert PDFs to PNG or JPG
- Convert PDFs with extractable text to DOCX
- Rotate pages
- Reorder or delete pages
- Add text watermarks
- Edit PDFs with a visual page preview, detected text replacement, text/image overlays, shapes, and whiteout blocks
- Protect PDFs with passwords
- Unlock protected PDFs
- Extract PDF text into TXT
- Add headers, footers, and page numbers
- Crop selected pages
- Extract selected pages into separate PDFs
- OCR scanned PDFs into TXT
- Sign PDFs with text or an image
- Edit PDF metadata
- Insert blank pages or another PDF
- Batch-process many PDFs at once
- Inspect PDF page counts and sizes

## Project Layout

```text
.
├── App.jsx
├── components/
├── hooks/
├── index.css
├── index.html
├── main.jsx
├── pages/
├── pdf.js
├── postcss.config.js
├── scripts/
│   └── smoke-test.mjs
├── server.js
├── tailwind.config.js
├── utils/
├── vite.config.js
└── package.json
```

## Requirements

- Node.js 18+
- npm 9+

Tested locally here with Node `v22.17.1` and npm `10.9.2`.

## Install

```bash
npm install
```

## Run

Backend:

```bash
npm run dev:server
```

Frontend:

```bash
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Build And Preview

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

## Smoke Test

This project includes an end-to-end smoke test that:

- starts the API on a temporary port
- generates sample PDFs and images
- exercises every API route
- verifies download URLs
- checks invalid upload handling
- covers OCR and page-management flows

Run it with:

```bash
npm run smoke
```

## Environment

Optional backend environment variables:

- `PORT` - API port, default `3001`
- `HOST` - bind host, default `127.0.0.1`
- `FRONTEND_ORIGIN` - comma-separated allowed origins for CORS

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pdf/merge` | Merge multiple PDFs |
| POST | `/api/pdf/split` | Split by range or every page |
| POST | `/api/pdf/compress` | Compress a PDF |
| POST | `/api/pdf/image-to-pdf` | Convert images to PDF |
| POST | `/api/pdf/pdf-to-image` | Convert PDF pages to images in a ZIP |
| POST | `/api/pdf/pdf-to-word` | Convert extractable PDF text into a DOCX |
| POST | `/api/pdf/rotate` | Rotate selected pages |
| POST | `/api/pdf/reorder` | Reorder or delete pages |
| POST | `/api/pdf/watermark` | Add a text watermark |
| POST | `/api/pdf/edit` | Add visual edit layers, including detected text replacements, images, shapes, and whiteout blocks |
| POST | `/api/pdf/protect` | Password-protect a PDF |
| POST | `/api/pdf/unlock` | Remove a PDF password |
| POST | `/api/pdf/extract-text` | Extract text to a TXT file |
| POST | `/api/pdf/page-labels` | Add headers, footers, and page numbers |
| POST | `/api/pdf/crop` | Crop selected pages |
| POST | `/api/pdf/extract-pages` | Export selected pages as separate PDFs in a ZIP |
| POST | `/api/pdf/ocr` | OCR scanned pages to a TXT file |
| POST | `/api/pdf/sign` | Add a text or image signature |
| POST | `/api/pdf/metadata` | Edit PDF metadata |
| POST | `/api/pdf/page-manager` | Insert or remove pages |
| POST | `/api/pdf/batch` | Apply one action to many PDFs |
| POST | `/api/pdf/info` | Return page count and page sizes |
| GET | `/preview/:filename` | Preview a generated PDF, image, or TXT file inline |
| GET | `/downloads/:filename` | Download a generated file |
| GET | `/health` | Health check |

## Notes

- Uploaded files are stored in `uploads/` and cleaned up after 30 minutes.
- PDF-only routes reject non-PDF uploads with a `400` response.
- PDF rendering and text extraction prefer Poppler when available, then fall back to PDF.js.
- Compression prefers Ghostscript, unlock/protect uses QPDF, and OCR prefers native Tesseract with a `tesseract.js` fallback.
