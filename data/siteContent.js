export const siteInfo = {
  name: 'PDFForge',
  url: 'https://pdforge-xi.vercel.app',
  backendUrl: 'https://pdfwebtool-ls3x.onrender.com',
  contactEmail: 'support@pdforge.com',
  fileRetention: '30 minutes',
  country: 'Nigeria',
}

export const trustLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms' },
  { to: '/cookies', label: 'Cookie Policy' },
  { to: '/disclaimer', label: 'Disclaimer' },
  { to: '/copyright', label: 'Copyright' },
  { to: '/file-handling', label: 'File Handling' },
]

export const guideSummaries = [
  {
    slug: 'how-to-compress-pdf',
    title: 'How to Compress a PDF Without Losing Important Quality',
    description: 'Learn how PDF compression works, when to use screen or print quality, and how to avoid unreadable results.',
    readTime: '5 min read',
    relatedTools: ['compress', 'pdf-to-image', 'metadata'],
  },
  {
    slug: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files in the Right Order',
    description: 'A simple guide to preparing files, checking page order, and avoiding duplicate or missing pages after merging.',
    readTime: '4 min read',
    relatedTools: ['merge', 'reorder', 'page-manager'],
  },
  {
    slug: 'pdf-to-word-guide',
    title: 'PDF to Word: What Converts Well and What Does Not',
    description: 'Understand why searchable PDFs convert better than scans, and when OCR is needed before editing text.',
    readTime: '6 min read',
    relatedTools: ['pdf-to-word', 'ocr', 'extract-text'],
  },
  {
    slug: 'pdf-to-excel-guide',
    title: 'PDF to Excel: How to Get Cleaner Spreadsheet Results',
    description: 'Tips for turning table-like PDF text into usable spreadsheet rows and columns.',
    readTime: '5 min read',
    relatedTools: ['pdf-to-excel', 'extract-text', 'ocr'],
  },
  {
    slug: 'ocr-vs-text-extraction',
    title: 'OCR vs Text Extraction: Which One Should You Use?',
    description: 'Use text extraction for searchable PDFs and OCR for scanned/image-based documents.',
    readTime: '5 min read',
    relatedTools: ['extract-text', 'ocr', 'pdf-to-word'],
  },
  {
    slug: 'protect-and-unlock-pdf-safely',
    title: 'How to Protect and Unlock PDFs Safely',
    description: 'Best practices for passwords, authorized unlocking, and sharing sensitive documents.',
    readTime: '6 min read',
    relatedTools: ['protect', 'unlock', 'metadata'],
  },
  {
    slug: 'convert-images-to-pdf',
    title: 'How to Convert Images to One PDF',
    description: 'Prepare JPG, PNG, WebP, or GIF files so the final PDF is clear, correctly ordered, and easy to share.',
    readTime: '4 min read',
    relatedTools: ['image-to-pdf', 'pdf-to-image', 'merge'],
  },
  {
    slug: 'add-page-numbers-to-pdf',
    title: 'How to Add Page Numbers, Headers, and Footers to a PDF',
    description: 'Make longer documents easier to review by adding page labels in the right position.',
    readTime: '4 min read',
    relatedTools: ['page-labels', 'watermark', 'sign'],
  },
  {
    slug: 'prepare-documents-for-sharing',
    title: 'Checklist Before Sharing a PDF Online',
    description: 'A practical checklist for file size, page order, metadata, watermarks, signatures, and access control.',
    readTime: '7 min read',
    relatedTools: ['compress', 'metadata', 'protect', 'sign'],
  },
  {
    slug: 'office-files-to-pdf',
    title: 'Converting Excel and PowerPoint Files to PDF',
    description: 'When to export spreadsheets and presentations to PDF, and how to check layout before sending.',
    readTime: '5 min read',
    relatedTools: ['excel-to-pdf', 'powerpoint-to-pdf', 'pdf-to-powerpoint'],
  },
]

export const guideArticles = {
  'how-to-compress-pdf': {
    title: 'How to Compress a PDF Without Losing Important Quality',
    intro: 'PDF compression is useful when a file is too large to upload, email, or store. The goal is not always the smallest possible file. The goal is a file that stays readable while becoming easier to share.',
    sections: [
      {
        heading: 'Choose the right compression level',
        body: [
          'Use stronger compression for screen reading, receipts, internal drafts, or files that mainly need to be viewed on a phone or laptop.',
          'Use lighter compression for forms, contracts, print-ready files, or documents with detailed images that must stay sharp.',
        ],
      },
      {
        heading: 'Check text and images after compression',
        body: [
          'After compressing, open the result and zoom in on small text, signatures, tables, and logos. If those parts are still clear, the compression level is probably safe.',
          'If images become blocky or text looks faded, try a lighter setting.',
        ],
      },
      {
        heading: 'Remove unnecessary extras',
        body: [
          'Metadata, unused objects, and oversized embedded images can increase file size. Compression works best when the original PDF is already organized and does not include duplicate pages or unnecessary scans.',
        ],
      },
    ],
    faq: [
      ['Will compression always reduce file size?', 'Usually, but not always. A PDF that is already optimized may only shrink slightly.'],
      ['Can compressed PDFs still be printed?', 'Yes, but use a lighter setting if the file is meant for high-quality printing.'],
    ],
  },
  'how-to-merge-pdf-files': {
    title: 'How to Merge PDF Files in the Right Order',
    intro: 'Merging PDFs is simple, but page order matters. A good merge workflow starts before you press the button.',
    sections: [
      {
        heading: 'Prepare the files first',
        body: [
          'Rename files so their order is obvious, such as 01-cover.pdf, 02-contract.pdf, and 03-appendix.pdf.',
          'Open each file briefly to check that it is the correct version.',
        ],
      },
      {
        heading: 'Review after merging',
        body: [
          'After the final file is created, preview the first page, last page, and section boundaries. This catches most ordering mistakes quickly.',
          'If you notice a page in the wrong position, use the reorder tool instead of rebuilding everything from scratch.',
        ],
      },
    ],
    faq: [
      ['Can I merge encrypted PDFs?', 'You may need to unlock authorized protected files first.'],
      ['Can I remove pages after merging?', 'Yes. Use the reorder or page manager tools to delete or rearrange pages.'],
    ],
  },
  'pdf-to-word-guide': {
    title: 'PDF to Word: What Converts Well and What Does Not',
    intro: 'PDF and Word files are built for different purposes. A PDF preserves appearance. A Word document is meant to be edited. That difference is why conversion quality depends on the original file.',
    sections: [
      {
        heading: 'Searchable PDFs convert better',
        body: [
          'If you can select and copy text from the PDF, conversion has a much better chance of producing useful editable text.',
          'If the PDF is a scanned image, OCR is needed first to recognize the text.',
        ],
      },
      {
        heading: 'Complex layout is harder',
        body: [
          'Multi-column brochures, forms, heavy tables, and graphics-rich files may need manual cleanup after conversion.',
          'For contracts, letters, and simple reports, PDF to Word is usually more predictable.',
        ],
      },
    ],
    faq: [
      ['Will the Word file look exactly like the PDF?', 'Not always. The tool focuses on extracting editable text rather than rebuilding every layout detail.'],
      ['What should I do with scanned PDFs?', 'Run OCR first, then convert or extract the recognized text.'],
    ],
  },
  'pdf-to-excel-guide': {
    title: 'PDF to Excel: How to Get Cleaner Spreadsheet Results',
    intro: 'PDF to Excel works best when the PDF contains table-like selectable text. The cleaner the text structure, the cleaner the spreadsheet result.',
    sections: [
      {
        heading: 'Use table-like source files',
        body: [
          'Invoices, reports, lists, and exports with aligned columns tend to work better than designed brochures or screenshots.',
          'If the PDF text cannot be selected, OCR may be needed first.',
        ],
      },
      {
        heading: 'Expect some cleanup',
        body: [
          'PDFs do not store spreadsheet cells the same way Excel does. Some rows or columns may need adjustment after conversion.',
          'For best results, check merged cells, wrapped text, totals, and dates before using the spreadsheet for important work.',
        ],
      },
    ],
    faq: [
      ['Can PDF to Excel recover formulas?', 'No. It extracts visible text, not hidden spreadsheet formulas.'],
      ['Can scanned tables convert?', 'Only after OCR, and the result may need cleanup.'],
    ],
  },
  'ocr-vs-text-extraction': {
    title: 'OCR vs Text Extraction: Which One Should You Use?',
    intro: 'Text extraction and OCR both produce text, but they solve different problems.',
    sections: [
      {
        heading: 'Use text extraction for searchable PDFs',
        body: [
          'If the PDF already contains real text, extraction is faster and usually more accurate than OCR.',
          'This is common with exported reports, contracts, invoices, and documents created from Word or Google Docs.',
        ],
      },
      {
        heading: 'Use OCR for scanned PDFs',
        body: [
          'OCR reads text from images. Use it for scans, photos of documents, or PDFs where the text cannot be selected.',
          'OCR accuracy depends on image clarity, language, rotation, contrast, and page quality.',
        ],
      },
    ],
    faq: [
      ['Is OCR perfect?', 'No. Always review OCR output before using it for legal, financial, or official work.'],
      ['Is text extraction faster?', 'Yes, because it reads text already stored inside the PDF.'],
    ],
  },
  'protect-and-unlock-pdf-safely': {
    title: 'How to Protect and Unlock PDFs Safely',
    intro: 'PDF passwords help limit access, but they should be used carefully and only on documents you own or are authorized to manage.',
    sections: [
      {
        heading: 'Use strong passwords',
        body: [
          'Avoid short or obvious passwords. Use a long phrase or a password manager-generated value.',
          'Send the password through a different channel from the file when possible.',
        ],
      },
      {
        heading: 'Unlock only authorized files',
        body: [
          'Only remove protection from PDFs you own or have permission to modify.',
          'If a file belongs to someone else, ask for an unlocked version or written permission before processing it.',
        ],
      },
    ],
    faq: [
      ['Can this recover forgotten passwords?', 'No. You need the current password to unlock a protected PDF.'],
      ['Does password protection replace secure storage?', 'No. It is one layer, not a full security plan.'],
    ],
  },
  'convert-images-to-pdf': {
    title: 'How to Convert Images to One PDF',
    intro: 'Image to PDF is useful for receipts, scanned notes, IDs, forms, and picture-based documents that need to be shared as one file.',
    sections: [
      {
        heading: 'Put images in the right order',
        body: [
          'Arrange pages before conversion so the final PDF reads naturally.',
          'Use clear file names when uploading many images at once.',
        ],
      },
      {
        heading: 'Use readable image quality',
        body: [
          'Blurry or low-light photos will stay blurry in the PDF. Retake important pages with good lighting before converting.',
          'Crop out unnecessary background when possible.',
        ],
      },
    ],
    faq: [
      ['Can I combine JPG and PNG files?', 'Yes, supported image types can be combined into one PDF.'],
      ['Will the PDF text be searchable?', 'No. Use OCR if you need searchable text from image pages.'],
    ],
  },
  'add-page-numbers-to-pdf': {
    title: 'How to Add Page Numbers, Headers, and Footers to a PDF',
    intro: 'Page labels make longer documents easier to review, print, and reference.',
    sections: [
      {
        heading: 'Choose a clear position',
        body: [
          'Bottom center is common for page numbers. Headers work well for document titles or section names.',
          'Avoid placing labels over important signatures, stamps, or tables.',
        ],
      },
      {
        heading: 'Use consistent formatting',
        body: [
          'Keep font size, color, and spacing consistent across the document.',
          'For formal documents, use subtle labels that do not distract from the content.',
        ],
      },
    ],
    faq: [
      ['Can I start numbering at a different number?', 'Yes, use the start number field when the cover page or previous section changes numbering.'],
      ['Can headers and footers be added together?', 'Yes, both can be applied in one pass.'],
    ],
  },
  'prepare-documents-for-sharing': {
    title: 'Checklist Before Sharing a PDF Online',
    intro: 'Before sending a PDF to a client, team, school, or public upload form, take a few minutes to check the basics.',
    sections: [
      {
        heading: 'Check the visible document',
        body: [
          'Confirm page order, page count, signatures, dates, and attachments.',
          'Preview the result after merging, compressing, signing, or converting.',
        ],
      },
      {
        heading: 'Check privacy and access',
        body: [
          'Remove unnecessary metadata if the file will be public.',
          'Protect sensitive files with a password when appropriate, and only share files with intended recipients.',
        ],
      },
      {
        heading: 'Check file size and format',
        body: [
          'Compress files that are too large for upload limits.',
          'Use PDF for final sharing when you want consistent layout across devices.',
        ],
      },
    ],
    faq: [
      ['Should I remove metadata from every PDF?', 'It is useful for public or sensitive files, but not always necessary for internal drafts.'],
      ['Should I password-protect every file?', 'Use passwords for sensitive documents, not for files that need easy public access.'],
    ],
  },
  'office-files-to-pdf': {
    title: 'Converting Excel and PowerPoint Files to PDF',
    intro: 'PDF is often the safest final format when you want spreadsheets or presentations to look the same for everyone.',
    sections: [
      {
        heading: 'Check layout before sharing',
        body: [
          'Spreadsheets can spill onto extra pages if print areas are not set well. Review the PDF before sending it.',
          'Presentations should be checked for missing fonts, cropped images, and slide sizing.',
        ],
      },
      {
        heading: 'When PDF is the right output',
        body: [
          'Use PDF for approvals, invoices, reports, lecture slides, proposals, and documents that should not change accidentally.',
          'Keep the original Excel or PowerPoint file if the recipient needs to edit the content.',
        ],
      },
    ],
    faq: [
      ['Can PDF preserve formulas?', 'No. A PDF shows the visible result, not spreadsheet formulas.'],
      ['Can PowerPoint animations become PDF?', 'No. PDF is static, so animations and transitions are not preserved.'],
    ],
  },
}

export const toolHelp = {
  merge: {
    intro: 'Combine related documents into one PDF while keeping page order under control.',
    steps: ['Upload two or more PDFs.', 'Review the upload order.', 'Run the merge and preview the result before sharing.'],
    tips: ['Rename files before upload if order matters.', 'Check section breaks after merging.'],
    faq: [['Can I merge protected PDFs?', 'Unlock authorized protected files first, then merge them.']],
  },
  split: {
    intro: 'Separate a PDF into individual pages or custom page ranges.',
    steps: ['Upload a PDF.', 'Choose all pages or enter ranges such as 1-3,5.', 'Download the ZIP of split files.'],
    tips: ['Use ranges when you need chapters or sections.', 'Use all pages when each page should become its own file.'],
    faq: [['What happens to the original file?', 'It is only used for processing and is cleaned up automatically.']],
  },
  compress: {
    intro: 'Reduce PDF size for email, upload portals, and faster sharing.',
    steps: ['Upload your PDF.', 'Choose a compression level.', 'Open the result to check readability.'],
    tips: ['Use stronger compression for screen-only documents.', 'Use lighter compression for print or detailed images.'],
    faq: [['Will every PDF shrink?', 'Not always. Already optimized PDFs may only get slightly smaller.']],
  },
  'image-to-pdf': {
    intro: 'Turn images into a single PDF that is easier to send and archive.',
    steps: ['Upload JPG, PNG, WebP, or GIF images.', 'Keep the upload order as the page order.', 'Download the finished PDF.'],
    tips: ['Use clear, well-lit images.', 'Crop photos before upload when possible.'],
    faq: [['Will image text become selectable?', 'No. Use OCR if you need searchable text.']],
  },
  'pdf-to-image': {
    intro: 'Export PDF pages as PNG or JPG images for previews, thumbnails, or visual sharing.',
    steps: ['Upload a PDF.', 'Choose PNG or JPG.', 'Select all pages or a page range.'],
    tips: ['Use PNG for crisp text.', 'Use JPG for smaller photographic output.'],
    faq: [['Why is output a ZIP?', 'Multiple pages create multiple images, so they are packaged together.']],
  },
  'pdf-to-word': {
    intro: 'Create an editable Word document from extractable PDF text.',
    steps: ['Upload a searchable PDF.', 'Choose pages.', 'Download the DOCX and review formatting.'],
    tips: ['Scanned PDFs need OCR first.', 'Complex layouts may need manual cleanup.'],
    faq: [['Will it match the PDF exactly?', 'It prioritizes editable text over perfect visual reconstruction.']],
  },
  'pdf-to-excel': {
    intro: 'Convert table-like PDF text into spreadsheet rows and columns.',
    steps: ['Upload a searchable PDF.', 'Choose the pages with tables.', 'Download the XLSX and review columns.'],
    tips: ['Works best with aligned text tables.', 'Scanned tables need OCR first and may need cleanup.'],
    faq: [['Will formulas be restored?', 'No. The output contains visible extracted text, not original formulas.']],
  },
  'excel-to-pdf': {
    intro: 'Convert spreadsheets to PDF for consistent sharing and review.',
    steps: ['Upload XLSX, XLS, or CSV.', 'Run the conversion.', 'Open the PDF and check page breaks.'],
    tips: ['Set print areas in the spreadsheet before uploading when layout matters.', 'Wide sheets may span multiple pages.'],
    faq: [['Does the PDF keep formulas?', 'No. It shows the visible spreadsheet values.']],
  },
  'powerpoint-to-pdf': {
    intro: 'Convert slides into a static PDF for easy sharing.',
    steps: ['Upload PPTX or PPT.', 'Run the conversion.', 'Preview the PDF before sending.'],
    tips: ['Check custom fonts and images after conversion.', 'Animations become static in PDF.'],
    faq: [['Will transitions remain?', 'No. PDF slides are static pages.']],
  },
  'pdf-to-powerpoint': {
    intro: 'Turn PDF pages into a PowerPoint deck with one page image per slide.',
    steps: ['Upload a PDF.', 'Choose pages.', 'Download the PPTX deck.'],
    tips: ['This is best for presenting existing PDF pages.', 'Text is not rebuilt as editable PowerPoint text.'],
    faq: [['Can I edit the text in PowerPoint?', 'The pages are inserted as images, so text is not directly editable.']],
  },
  reorder: {
    intro: 'Rearrange or remove pages from a PDF without rebuilding the document from scratch.',
    steps: ['Upload a PDF.', 'Set the page order or remove unwanted pages.', 'Download the reordered PDF.'],
    tips: ['Preview page thumbnails before changing order.', 'Keep a copy of the original file for reference.'],
    faq: [['Can I delete pages too?', 'Yes. Remove pages during the reorder process when they are not needed.']],
  },
  'extract-pages': {
    intro: 'Export selected pages from a larger PDF as separate PDF files.',
    steps: ['Upload the PDF.', 'Enter the pages to extract.', 'Download the ZIP of selected pages.'],
    tips: ['Use this for appendices, signed pages, invoices, or selected report sections.', 'Check page numbers before processing.'],
    faq: [['Why is the result a ZIP?', 'Each extracted page is a separate PDF, so the files are packaged together.']],
  },
  'page-manager': {
    intro: 'Insert blank pages or another PDF, and remove pages from an existing document.',
    steps: ['Upload the main PDF.', 'Choose pages to remove or insert.', 'Download the updated PDF.'],
    tips: ['Useful for adding cover pages, appendices, or separator pages.', 'Review the final page count after processing.'],
    faq: [['Can I insert another PDF?', 'Yes. Upload an insert file and choose where it should be placed.']],
  },
  'extract-text': {
    intro: 'Extract selectable PDF text into a plain TXT file.',
    steps: ['Upload a searchable PDF.', 'Choose all pages or a range.', 'Download the extracted text.'],
    tips: ['Use OCR for scanned pages.', 'Plain text output is useful for search, review, and copying content.'],
    faq: [['Will formatting be preserved?', 'Only basic text structure is preserved. Complex layouts may not appear exactly the same.']],
  },
  rotate: {
    intro: 'Rotate selected pages so scanned or sideways documents read correctly.',
    steps: ['Upload a PDF.', 'Choose pages and rotation angle.', 'Download the corrected PDF.'],
    tips: ['Use 90 or 270 degrees for sideways pages.', 'Use 180 degrees for upside-down pages.'],
    faq: [['Can I rotate only one page?', 'Yes. Enter a specific page number instead of all pages.']],
  },
  watermark: {
    intro: 'Add a visible text watermark to mark drafts, confidential files, or review copies.',
    steps: ['Upload a PDF.', 'Enter watermark text and placement.', 'Download the watermarked PDF.'],
    tips: ['Use subtle opacity for readable documents.', 'Avoid covering signatures or important tables.'],
    faq: [['Does this remove existing watermarks?', 'No. It adds a new visible watermark layer.']],
  },
  edit: {
    intro: 'Add practical visible edits such as text, images, shapes, and whiteout blocks.',
    steps: ['Upload a PDF.', 'Add edit layers on the selected pages.', 'Preview and download the edited PDF.'],
    tips: ['Use whiteout for covering visible content before adding replacement text.', 'This tool does not rewrite every internal PDF text stream.'],
    faq: [['Is this like full Acrobat editing?', 'It is a practical visual editor for overlays and whiteout, not a full internal text-stream editor.']],
  },
  'page-labels': {
    intro: 'Add headers, footers, and page numbers to make longer PDFs easier to read and reference.',
    steps: ['Upload a PDF.', 'Set header, footer, page number, and position options.', 'Download the labeled PDF.'],
    tips: ['Use bottom center for simple page numbers.', 'Keep labels away from stamps or signatures.'],
    faq: [['Can I start from a custom number?', 'Yes. Use the start number field when numbering continues from another document.']],
  },
  crop: {
    intro: 'Trim margins from PDF pages to focus the visible page area.',
    steps: ['Upload a PDF.', 'Enter margins to remove.', 'Download the cropped PDF.'],
    tips: ['Start with small margins.', 'Preview the result to make sure no important content was removed.'],
    faq: [['Can crop be undone?', 'Download a new copy from the original file if you need different margins.']],
  },
  sign: {
    intro: 'Place a typed signature or signature image on a PDF page.',
    steps: ['Upload the PDF.', 'Choose typed text or an image signature.', 'Position and download the signed PDF.'],
    tips: ['Use a clean transparent signature image when possible.', 'Review placement before sending official documents.'],
    faq: [['Is this a digital certificate signature?', 'No. It places a visible signature, not a cryptographic certificate signature.']],
  },
  metadata: {
    intro: 'Update document metadata such as title, author, subject, keywords, and language.',
    steps: ['Upload a PDF.', 'Enter the metadata fields to update.', 'Download the cleaned or updated file.'],
    tips: ['Remove unnecessary metadata before public sharing.', 'Use clear titles for searchable document archives.'],
    faq: [['Does metadata change visible page text?', 'No. It changes document information stored in the PDF file.']],
  },
  batch: {
    intro: 'Apply one supported action across multiple PDF files in a single batch.',
    steps: ['Upload several PDFs.', 'Choose the batch action and options.', 'Download the ZIP of processed files.'],
    tips: ['Batch small groups first when processing large files.', 'Use consistent settings for files that need the same treatment.'],
    faq: [['Why is the output a ZIP?', 'Batch processing creates one result per file, so they are packaged together.']],
  },
  ocr: {
    intro: 'Recognize text from scanned or image-based PDFs.',
    steps: ['Upload a scanned PDF.', 'Choose pages and language.', 'Download the recognized text file.'],
    tips: ['Clear scans produce better OCR.', 'Rotate pages correctly before OCR when needed.'],
    faq: [['Is OCR guaranteed accurate?', 'No. Always review important OCR results manually.']],
  },
  protect: {
    intro: 'Add password protection to PDFs you need to share more carefully.',
    steps: ['Upload a PDF.', 'Enter an open password.', 'Download the protected file.'],
    tips: ['Use long, unique passwords.', 'Send the password separately from the PDF.'],
    faq: [['Can this stop every kind of copying?', 'No. PDF protection is helpful, but not a complete security system.']],
  },
  unlock: {
    intro: 'Remove password protection from PDFs you own or have permission to modify.',
    steps: ['Upload the protected PDF.', 'Enter the current password.', 'Download the unlocked result.'],
    tips: ['Only unlock authorized files.', 'Keep sensitive documents stored securely after unlocking.'],
    faq: [['Can this recover a forgotten password?', 'No. The current password is required.']],
  },
}
