const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const { promisify } = require('util');
const {
  PDFDocument,
  degrees,
  rgb,
  StandardFonts,
} = require('pdf-lib');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

const execFileAsync = promisify(execFile);
const uploadsDir = path.join(__dirname, 'uploads');
const pdfjsCMapDir = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'cmaps') + path.sep;
const pdfjsStandardFontDir = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'standard_fonts') + path.sep;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const PDF_MIME_TYPES = ['application/pdf'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const EXCEL_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
];
const WORD_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];
const POWERPOINT_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
];
const EXCEL_EXTENSIONS = ['.xlsx', '.xls', '.csv'];
const WORD_EXTENSIONS = ['.docx', '.doc'];
const POWERPOINT_EXTENSIONS = ['.pptx', '.ppt'];

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});

function createUploader(allowedMimeTypes, allowedExtensions = []) {
  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      const extension = path.extname(file.originalname || '').toLowerCase();
      if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(extension)) {
        cb(null, true);
      } else {
        const allowed = [...allowedMimeTypes, ...allowedExtensions].join(', ');
        cb(new Error(`Only ${allowed} files are allowed`));
      }
    },
  });
}

const pdfUpload = createUploader(PDF_MIME_TYPES);
const imageUpload = createUploader(IMAGE_MIME_TYPES);
const mixedUpload = createUploader([...PDF_MIME_TYPES, ...IMAGE_MIME_TYPES]);
const excelUpload = createUploader(EXCEL_MIME_TYPES, EXCEL_EXTENSIONS);
const wordUpload = createUploader(WORD_MIME_TYPES, WORD_EXTENSIONS);
const powerPointUpload = createUploader(POWERPOINT_MIME_TYPES, POWERPOINT_EXTENSIONS);

function cleanup(...filePaths) {
  filePaths.flat().forEach(filePath => {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    } catch (error) {
      // ignore cleanup failures
    }
  });
}

async function commandExists(command) {
  try {
    await execFileAsync('/bin/sh', ['-lc', `command -v ${command}`]);
    return true;
  } catch {
    return false;
  }
}

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function unique(array) {
  return Array.from(new Set(array));
}

function parsePageSelection(spec, totalPages, options = {}) {
  const { defaultAll = true } = options;

  if (!spec || spec === 'all') {
    return defaultAll ? Array.from({ length: totalPages }, (_, index) => index) : [];
  }

  const indices = [];
  const parts = String(spec)
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (/^\d+\s*-\s*\d+$/.test(part)) {
      const [start, end] = part.split('-').map(value => parseInt(value.trim(), 10));
      const step = start <= end ? 1 : -1;
      for (let page = start; step > 0 ? page <= end : page >= end; page += step) {
        if (page >= 1 && page <= totalPages) {
          indices.push(page - 1);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (page >= 1 && page <= totalPages) {
        indices.push(page - 1);
      }
    }
  }

  return unique(indices);
}

function parseSplitGroups(spec, totalPages) {
  const groups = [];
  const parts = String(spec || '')
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (/^\d+\s*-\s*\d+$/.test(part)) {
      const [start, end] = part.split('-').map(value => parseInt(value.trim(), 10));
      const step = start <= end ? 1 : -1;
      const group = [];
      for (let page = start; step > 0 ? page <= end : page >= end; page += step) {
        if (page >= 1 && page <= totalPages) {
          group.push(page - 1);
        }
      }
      if (group.length) groups.push(group);
    } else {
      const page = parseInt(part, 10);
      if (page >= 1 && page <= totalPages) {
        groups.push([page - 1]);
      }
    }
  }

  return groups;
}

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseJsonValue(value, fallback = null) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toPdfRgb(hex, fallback = '#FF0000') {
  const color = typeof hex === 'string' && /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : fallback;
  return rgb(
    parseInt(color.slice(1, 3), 16) / 255,
    parseInt(color.slice(3, 5), 16) / 255,
    parseInt(color.slice(5, 7), 16) / 255,
  );
}

function renderTemplate(template, pageNumber, totalPages) {
  return String(template || '')
    .replaceAll('{page}', String(pageNumber))
    .replaceAll('{index}', String(pageNumber))
    .replaceAll('{total}', String(totalPages));
}

function escapeXml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function columnReference(index) {
  let value = '';
  let cursor = index + 1;

  while (cursor > 0) {
    const remainder = (cursor - 1) % 26;
    value = String.fromCharCode(65 + remainder) + value;
    cursor = Math.floor((cursor - 1) / 26);
  }

  return value;
}

function rowsFromExtractedText(text) {
  const rows = [];

  String(text || '').split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (/^Page \d+$/i.test(trimmed)) {
      if (rows.length) rows.push([]);
      rows.push([trimmed]);
      return;
    }

    const cells = trimmed
      .split(/\t+| {2,}/)
      .map(cell => cell.trim())
      .filter(Boolean);
    rows.push(cells.length ? cells : [trimmed]);
  });

  return rows.length ? rows : [['No extractable table text found in this PDF.']];
}

function buildWorksheetXml(rows) {
  const maxColumns = Math.max(1, ...rows.map(row => row.length));
  const dimension = `A1:${columnReference(maxColumns - 1)}${Math.max(rows.length, 1)}`;
  const sheetData = rows.map((row, rowIndex) => {
    const rowNumber = rowIndex + 1;
    const cells = row.map((cell, columnIndex) => {
      const cellRef = `${columnReference(columnIndex)}${rowNumber}`;
      return `<c r="${cellRef}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(cell)}</t></is></c>`;
    }).join('');
    return `<row r="${rowNumber}">${cells}</row>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="${dimension}"/>
  <sheetViews>
    <sheetView workbookViewId="0"/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>${sheetData}</sheetData>
</worksheet>`;
}

function buildWordDocumentXml(text) {
  const paragraphs = String(text || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const safeParagraphs = paragraphs.length ? paragraphs : ['No extractable text found in this PDF.'];
  const body = safeParagraphs.map(line => (
    `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`
  )).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function getAnchoredPosition(page, boxWidth, boxHeight, position = 'bottom-right', padding = 24) {
  const { width, height } = page.getSize();

  switch (position) {
    case 'top-left':
      return { x: padding, y: height - boxHeight - padding };
    case 'top-center':
      return { x: (width - boxWidth) / 2, y: height - boxHeight - padding };
    case 'top-right':
      return { x: width - boxWidth - padding, y: height - boxHeight - padding };
    case 'center':
      return { x: (width - boxWidth) / 2, y: (height - boxHeight) / 2 };
    case 'bottom-left':
      return { x: padding, y: padding };
    case 'bottom-center':
      return { x: (width - boxWidth) / 2, y: padding };
    case 'bottom-right':
    default:
      return { x: width - boxWidth - padding, y: padding };
  }
}

function saveOutput(prefix, extension, bytes) {
  const filename = `${prefix}-${uuidv4()}.${extension}`;
  const outputPath = path.join(uploadsDir, filename);
  fs.writeFileSync(outputPath, bytes);
  return { filename, outputPath, url: `/downloads/${filename}` };
}

async function writeZip(prefix, entries) {
  const filename = `${prefix}-${uuidv4()}.zip`;
  const zipPath = path.join(uploadsDir, filename);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.pipe(output);

  for (const entry of entries) {
    archive.append(entry.data, { name: entry.name });
  }

  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.finalize();
  });

  return { filename, outputPath: zipPath, url: `/downloads/${filename}` };
}

async function writeDocx(prefix, text) {
  const filename = `${prefix}-${uuidv4()}.docx`;
  const outputPath = path.join(uploadsDir, filename);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.pipe(output);

  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`, { name: '[Content_Types].xml' });
  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`, { name: '_rels/.rels' });
  archive.append(buildWordDocumentXml(text), { name: 'word/document.xml' });
  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Converted PDF text</dc:title>
  <dc:creator>ConstantPDF</dc:creator>
  <cp:lastModifiedBy>ConstantPDF</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`, { name: 'docProps/core.xml' });
  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>ConstantPDF</Application>
</Properties>`, { name: 'docProps/app.xml' });

  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.finalize();
  });

  return { filename, outputPath, url: `/downloads/${filename}` };
}

async function writeXlsx(prefix, rows) {
  const filename = `${prefix}-${uuidv4()}.xlsx`;
  const outputPath = path.join(uploadsDir, filename);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.pipe(output);

  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`, { name: '[Content_Types].xml' });
  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`, { name: '_rels/.rels' });
  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="PDF Text" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`, { name: 'xl/workbook.xml' });
  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`, { name: 'xl/_rels/workbook.xml.rels' });
  archive.append(buildWorksheetXml(rows), { name: 'xl/worksheets/sheet1.xml' });
  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Converted PDF table text</dc:title>
  <dc:creator>ConstantPDF</dc:creator>
  <cp:lastModifiedBy>ConstantPDF</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`, { name: 'docProps/core.xml' });
  archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>ConstantPDF</Application>
</Properties>`, { name: 'docProps/app.xml' });

  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.finalize();
  });

  return { filename, outputPath, url: `/downloads/${filename}` };
}

async function writePptxFromRenderedPages(prefix, renderedPages) {
  const PptxGenJS = require('pptxgenjs');
  const pptx = new PptxGenJS();
  const slideWidth = 13.333;
  const slideHeight = 7.5;
  const imageDir = fs.mkdtempSync(path.join(uploadsDir, 'pptx-pages-'));
  const filename = `${prefix}-${uuidv4()}.pptx`;
  const outputPath = path.join(uploadsDir, filename);

  pptx.author = 'ConstantPDF';
  pptx.company = 'ConstantPDF';
  pptx.subject = 'Converted PDF pages';
  pptx.title = 'Converted PDF pages';
  pptx.defineLayout({ name: 'PDF_FORGE_WIDE', width: slideWidth, height: slideHeight });
  pptx.layout = 'PDF_FORGE_WIDE';

  try {
    for (const page of renderedPages) {
      const imagePath = path.join(imageDir, `page-${page.pageNumber}.png`);
      fs.writeFileSync(imagePath, page.buffer);

      const imageRatio = page.width && page.height ? page.width / page.height : slideWidth / slideHeight;
      let width = slideWidth;
      let height = width / imageRatio;
      if (height > slideHeight) {
        height = slideHeight;
        width = height * imageRatio;
      }

      const slide = pptx.addSlide();
      slide.background = { color: 'FFFFFF' };
      slide.addImage({
        path: imagePath,
        x: (slideWidth - width) / 2,
        y: (slideHeight - height) / 2,
        w: width,
        h: height,
      });
    }

    await pptx.writeFile({ fileName: outputPath });
    return { filename, outputPath, url: `/downloads/${filename}` };
  } finally {
    cleanup(imageDir);
  }
}

async function findOfficeCommand() {
  for (const command of ['libreoffice', 'soffice']) {
    if (await commandExists(command)) {
      return command;
    }
  }

  return null;
}

async function convertOfficeToPdf(inputPath, prefix) {
  const officeCommand = await findOfficeCommand();
  if (!officeCommand) {
    throw new Error('Office to PDF conversion requires LibreOffice to be installed on the server.');
  }

  const outputDir = fs.mkdtempSync(path.join(uploadsDir, 'office-pdf-'));
  try {
    await execFileAsync(officeCommand, [
      '--headless',
      '--nologo',
      '--nofirststartwizard',
      '--convert-to',
      'pdf',
      '--outdir',
      outputDir,
      inputPath,
    ], { timeout: 180000, maxBuffer: 50 * 1024 * 1024 });

    const pdfFile = fs.readdirSync(outputDir).find(file => file.toLowerCase().endsWith('.pdf'));
    if (!pdfFile) {
      throw new Error('LibreOffice did not produce a PDF output.');
    }

    return saveOutput(prefix, 'pdf', fs.readFileSync(path.join(outputDir, pdfFile)));
  } finally {
    cleanup(outputDir);
  }
}

async function loadPdfFromPath(filePath, options) {
  const bytes = fs.readFileSync(filePath);
  const doc = await PDFDocument.load(bytes, options);
  return { bytes, doc };
}

async function renderPdfPagesWithPoppler(filePath, pageNumbers, format = 'png') {
  if (!filePath || !(await commandExists('pdftoppm'))) {
    return null;
  }

  const sharp = require('sharp');
  const renderDir = fs.mkdtempSync(path.join(uploadsDir, 'poppler-render-'));
  const pages = [];
  const normalizedFormat = format === 'jpeg' ? 'jpg' : format;

  try {
    for (const pageNumber of pageNumbers) {
      const outputPrefix = path.join(renderDir, `page-${pageNumber}`);
      const args = [
        '-f', String(pageNumber),
        '-l', String(pageNumber),
        '-r', '144',
        normalizedFormat === 'jpg' ? '-jpeg' : '-png',
        filePath,
        outputPrefix,
      ];
      await execFileAsync('pdftoppm', args, { timeout: 120000, maxBuffer: 20 * 1024 * 1024 });

      const suffix = normalizedFormat === 'jpg' ? 'jpg' : 'png';
      const candidates = fs.readdirSync(renderDir)
        .filter(file => file.startsWith(`page-${pageNumber}-`) && file.endsWith(`.${suffix}`))
        .sort();
      const outputPath = candidates.length
        ? path.join(renderDir, candidates[candidates.length - 1])
        : `${outputPrefix}-${pageNumber}.${suffix}`;
      let buffer = fs.readFileSync(outputPath);

      if (normalizedFormat === 'png') {
        buffer = await sharp(buffer).flatten({ background: '#ffffff' }).png().toBuffer();
      } else {
        buffer = await sharp(buffer).flatten({ background: '#ffffff' }).jpeg({ quality: 90 }).toBuffer();
      }

      const metadata = await sharp(buffer).metadata();
      pages.push({
        pageNumber,
        buffer,
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: normalizedFormat,
        renderer: 'poppler',
      });
    }

    return pages;
  } finally {
    cleanup(renderDir);
  }
}

async function renderPdfPages(pdfBytes, pageNumbers, format = 'png', filePath = null) {
  const popplerPages = await renderPdfPagesWithPoppler(filePath, pageNumbers, format).catch(() => null);
  if (popplerPages?.length) {
    return popplerPages;
  }

  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
  const { createCanvas } = require('@napi-rs/canvas');
  const sharp = require('sharp');
  const pdfDocument = await pdfjsLib.getDocument({
    data: new Uint8Array(pdfBytes),
    cMapUrl: pdfjsCMapDir,
    cMapPacked: true,
    standardFontDataUrl: pdfjsStandardFontDir,
    useSystemFonts: true,
    disableFontFace: false,
  }).promise;
  const pages = [];

  for (const pageNumber of pageNumbers) {
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    context.save();
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, viewport.width, viewport.height);
    context.restore();
    await page.render({ canvasContext: context, viewport }).promise;

    let buffer = canvas.toBuffer('image/png');
    if (format === 'png') {
      buffer = await sharp(buffer).flatten({ background: '#ffffff' }).png().toBuffer();
    }
    if (format === 'jpg' || format === 'jpeg') {
      buffer = await sharp(buffer).flatten({ background: '#ffffff' }).jpeg({ quality: 90 }).toBuffer();
    }

    pages.push({
      pageNumber,
      buffer,
      width: viewport.width,
      height: viewport.height,
      format: format === 'jpeg' ? 'jpg' : format,
      renderer: 'pdfjs',
    });
  }

  return pages;
}

async function extractTextWithPoppler(filePath, pageNumbers) {
  if (!filePath || !(await commandExists('pdftotext'))) {
    return null;
  }

  const sections = [];
  for (const pageNumber of pageNumbers) {
    const { stdout } = await execFileAsync('pdftotext', [
      '-f', String(pageNumber),
      '-l', String(pageNumber),
      '-layout',
      '-enc', 'UTF-8',
      filePath,
      '-',
    ], { timeout: 120000, maxBuffer: 20 * 1024 * 1024 });
    sections.push(`Page ${pageNumber}\n${stdout.trim()}`);
  }

  return sections.join('\n\n');
}

async function extractTextFromPdf(pdfBytes, pageNumbers, filePath = null) {
  const popplerText = await extractTextWithPoppler(filePath, pageNumbers).catch(() => null);
  if (popplerText !== null) {
    return popplerText;
  }

  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
  const pdfDocument = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
  const sections = [];

  for (const pageNumber of pageNumbers) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map(item => (typeof item.str === 'string' ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    sections.push(`Page ${pageNumber}\n${pageText}`);
  }

  return sections.join('\n\n');
}

async function recognizePdfText(pdfBytes, pageNumbers, language = 'eng', filePath = null) {
  const renderedPages = await renderPdfPages(pdfBytes, pageNumbers, 'png', filePath);
  const sections = [];
  const hasNativeTesseract = await commandExists('tesseract');
  let Tesseract = null;

  for (const page of renderedPages) {
    let text = null;
    if (hasNativeTesseract) {
      text = await recognizeImageWithNativeTesseract(page.buffer, language).catch(() => null);
    }

    if (text === null) {
      Tesseract ||= require('tesseract.js');
      const result = await Tesseract.recognize(page.buffer, language);
      text = result.data.text;
    }

    sections.push(`Page ${page.pageNumber}\n${String(text || '').trim()}`);
  }

  return sections.join('\n\n');
}

async function recognizeImageWithNativeTesseract(imageBuffer, language = 'eng') {
  const imagePath = path.join(uploadsDir, `ocr-page-${uuidv4()}.png`);
  try {
    fs.writeFileSync(imagePath, imageBuffer);
    const { stdout } = await execFileAsync('tesseract', [
      imagePath,
      'stdout',
      '-l',
      language,
    ], { timeout: 180000, maxBuffer: 20 * 1024 * 1024 });
    return stdout;
  } finally {
    cleanup(imagePath);
  }
}

function applyCompressionMetadataCleanup(doc) {
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('');
  doc.setCreator('');
}

async function compressPdfWithGhostscript(inputPath, level = 'medium') {
  if (!(await commandExists('gs'))) {
    return null;
  }

  const outputPath = path.join(uploadsDir, `ghostscript-compressed-${uuidv4()}.pdf`);
  const settings = {
    low: '/printer',
    medium: '/ebook',
    high: '/screen',
  };

  try {
    await execFileAsync('gs', [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      `-dPDFSETTINGS=${settings[level] || settings.medium}`,
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ], { timeout: 180000, maxBuffer: 20 * 1024 * 1024 });

    return fs.readFileSync(outputPath);
  } finally {
    cleanup(outputPath);
  }
}

async function unlockPdfWithQpdf(inputPath, password = '') {
  if (!(await commandExists('qpdf'))) {
    return null;
  }

  const outputPath = path.join(uploadsDir, `qpdf-unlocked-${uuidv4()}.pdf`);
  try {
    await execFileAsync('qpdf', [
      `--password=${password || ''}`,
      '--decrypt',
      inputPath,
      outputPath,
    ], { timeout: 120000, maxBuffer: 20 * 1024 * 1024 });

    return fs.readFileSync(outputPath);
  } finally {
    cleanup(outputPath);
  }
}

async function getPdfEncryptionStatus(inputPath) {
  if (!(await commandExists('qpdf'))) {
    return { available: false, encrypted: null, details: '' };
  }

  try {
    const { stdout, stderr } = await execFileAsync('qpdf', [
      '--show-encryption',
      inputPath,
    ], { timeout: 120000, maxBuffer: 20 * 1024 * 1024 });
    const details = `${stdout || ''}${stderr || ''}`;
    return {
      available: true,
      encrypted: !details.includes('File is not encrypted'),
      details,
    };
  } catch (error) {
    const details = `${error.stdout || ''}${error.stderr || ''}`;
    return {
      available: true,
      encrypted: /encrypted|password|R =/i.test(details),
      details,
    };
  }
}

async function protectPdfWithQpdf(inputPath, userPassword, ownerPassword) {
  if (!(await commandExists('qpdf'))) {
    throw new Error('PDF protection requires QPDF to be installed on the server.');
  }

  const outputPath = path.join(uploadsDir, `qpdf-protected-${uuidv4()}.pdf`);
  try {
    await execFileAsync('qpdf', [
      '--encrypt',
      `--user-password=${userPassword}`,
      `--owner-password=${ownerPassword}`,
      '--bits=256',
      '--print=full',
      '--modify=none',
      '--extract=n',
      '--annotate=n',
      '--form=n',
      '--assemble=n',
      '--',
      inputPath,
      outputPath,
    ], { timeout: 120000, maxBuffer: 20 * 1024 * 1024 });

    return fs.readFileSync(outputPath);
  } finally {
    cleanup(outputPath);
  }
}

async function createSinglePageZip(doc, pageGroups, prefix, baseName = 'page') {
  const entries = [];

  for (let index = 0; index < pageGroups.length; index += 1) {
    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(doc, pageGroups[index]);
    pages.forEach(page => newDoc.addPage(page));
    entries.push({
      name: `${baseName}-${index + 1}.pdf`,
      data: Buffer.from(await newDoc.save()),
    });
  }

  return writeZip(prefix, entries);
}

async function applyWatermark(doc, options = {}) {
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const text = options.text || 'CONFIDENTIAL';
  const fontSize = parseNumber(options.fontSize, 48);
  const opacity = parseNumber(options.opacity, 0.3);
  const position = options.position || 'center';
  const color = toPdfRgb(options.color, '#FF0000');
  const pageIndices = parsePageSelection(options.pages || 'all', doc.getPageCount());

  for (const pageIndex of pageIndices) {
    const page = doc.getPage(pageIndex);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    if (position === 'diagonal') {
      page.drawText(text, {
        x: width * 0.1,
        y: height * 0.1,
        size: fontSize,
        font,
        color,
        opacity,
        rotate: degrees(45),
      });
      continue;
    }

    const { x, y } = getAnchoredPosition(page, textWidth, textHeight, position, 20);
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color,
      opacity,
    });
  }
}

async function applyPageLabels(doc, options = {}) {
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontSize = parseNumber(options.fontSize, 11);
  const color = toPdfRgb(options.color, '#374151');
  const opacity = parseNumber(options.opacity, 1);
  const startNumber = parseInt(options.startNumber || '1', 10);
  const headerText = options.headerText || '';
  const footerText = options.footerText || 'Page {page} of {total}';
  const headerPosition = options.headerPosition || 'top-center';
  const footerPosition = options.footerPosition || 'bottom-center';
  const padding = parseNumber(options.padding, 20);
  const totalPages = doc.getPageCount();

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const page = doc.getPage(pageIndex);
    const pageNumber = startNumber + pageIndex;

    if (headerText) {
      const text = renderTemplate(headerText, pageNumber, totalPages);
      const width = font.widthOfTextAtSize(text, fontSize);
      const height = font.heightAtSize(fontSize);
      const { x, y } = getAnchoredPosition(page, width, height, headerPosition, padding);
      page.drawText(text, { x, y, font, size: fontSize, color, opacity });
    }

    if (footerText) {
      const text = renderTemplate(footerText, pageNumber, totalPages);
      const width = font.widthOfTextAtSize(text, fontSize);
      const height = font.heightAtSize(fontSize);
      const { x, y } = getAnchoredPosition(page, width, height, footerPosition, padding);
      page.drawText(text, { x, y, font, size: fontSize, color, opacity });
    }
  }
}

async function applySignature(doc, options = {}) {
  const pageCount = doc.getPageCount();
  const targetPageIndex = clamp(parseInt(options.page || String(pageCount), 10) - 1, 0, pageCount - 1);
  const page = doc.getPage(targetPageIndex);
  const position = options.position || 'bottom-right';
  const padding = parseNumber(options.padding, 24);
  const color = toPdfRgb(options.color, '#111827');
  const opacity = parseNumber(options.opacity, 1);

  if (options.signatureImagePath) {
    const sharp = require('sharp');
    const imageBuffer = await sharp(options.signatureImagePath).png().toBuffer();
    const image = await doc.embedPng(imageBuffer);
    const width = parseNumber(options.imageWidth, 140);
    const height = (image.height / image.width) * width;
    const { x, y } = getAnchoredPosition(page, width, height, position, padding);
    page.drawImage(image, { x, y, width, height, opacity });
  } else {
    const signerName = options.signerName || 'Approved';
    const note = options.note || '';
    const font = await doc.embedFont(StandardFonts.HelveticaOblique);
    const size = parseNumber(options.fontSize, 20);
    const signatureLine = signerName;
    const secondaryLine = note ? `Signed: ${note}` : '';
    const signatureWidth = font.widthOfTextAtSize(signatureLine, size);
    const secondaryWidth = secondaryLine ? font.widthOfTextAtSize(secondaryLine, Math.max(size - 6, 10)) : 0;
    const boxWidth = Math.max(signatureWidth, secondaryWidth, 150);
    const boxHeight = secondaryLine ? size + 28 : size + 16;
    const { x, y } = getAnchoredPosition(page, boxWidth, boxHeight, position, padding);

    page.drawLine({
      start: { x, y: y + boxHeight - 8 },
      end: { x: x + boxWidth, y: y + boxHeight - 8 },
      thickness: 1,
      color,
      opacity,
    });
    page.drawText(signatureLine, { x, y: y + 8, font, size, color, opacity });
    if (secondaryLine) {
      page.drawText(secondaryLine, {
        x,
        y: y - 8,
        font,
        size: Math.max(size - 6, 10),
        color,
        opacity,
      });
    }
  }
}

async function applyPdfEdit(doc, options = {}) {
  const pageCount = doc.getPageCount();
  const editLayers = parseJsonValue(options.edits, []);
  if (Array.isArray(editLayers) && editLayers.length) {
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

    for (const layer of editLayers) {
      const pageIndex = clamp(parseInt(layer.page || '1', 10) - 1, 0, pageCount - 1);
      const page = doc.getPage(pageIndex);
      const opacity = parseNumber(layer.opacity, 1);

      if (layer.type === 'text') {
        const text = String(layer.text || '').trim();
        if (!text) continue;
        const fontSize = parseNumber(layer.fontSize, 18);
        const activeFont = parseBoolean(layer.bold, false) ? boldFont : font;
        const color = toPdfRgb(layer.color, '#111827');
        const x = parseNumber(layer.x, 72);
        const y = parseNumber(layer.y, 720);
        text.split(/\r?\n/).forEach((line, lineIndex) => {
          page.drawText(line, {
            x,
            y: y - (lineIndex * fontSize * 1.25),
            size: fontSize,
            font: activeFont,
            color,
            opacity,
          });
        });
      } else if (layer.type === 'image') {
        const imageIndex = clamp(parseInt(layer.imageIndex || '0', 10), 0, (options.editImages || []).length - 1);
        const imagePath = options.editImages?.[imageIndex]?.path;
        if (!imagePath) continue;
        const sharp = require('sharp');
        const imageBuffer = await sharp(imagePath).png().toBuffer();
        const image = await doc.embedPng(imageBuffer);
        const width = parseNumber(layer.width, 160);
        const height = parseNumber(layer.height, (image.height / image.width) * width);
        page.drawImage(image, {
          x: parseNumber(layer.x, 72),
          y: parseNumber(layer.y, 520),
          width,
          height,
          opacity,
        });
      } else if (layer.type === 'rect' || layer.type === 'whiteout') {
        const fillColor = toPdfRgb(layer.fillColor, layer.type === 'whiteout' ? '#FFFFFF' : '#FFF4ED');
        const borderColor = toPdfRgb(layer.borderColor, '#F9530E');
        page.drawRectangle({
          x: parseNumber(layer.x, 72),
          y: parseNumber(layer.y, 520),
          width: parseNumber(layer.width, 160),
          height: parseNumber(layer.height, 48),
          color: fillColor,
          borderColor: parseBoolean(layer.showBorder, layer.type !== 'whiteout') ? borderColor : undefined,
          borderWidth: parseBoolean(layer.showBorder, layer.type !== 'whiteout') ? parseNumber(layer.borderWidth, 1) : 0,
          opacity,
        });
      }
    }

    return;
  }

  const pageIndices = parsePageSelection(options.pages || options.page || '1', pageCount, { defaultAll: false });
  if (!pageIndices.length) {
    throw new Error('Choose at least one valid page to edit.');
  }

  const hasText = Boolean(String(options.text || '').trim());
  const hasImage = Boolean(options.editImagePath);
  if (!hasText && !hasImage) {
    throw new Error('Add text or choose an image before editing the PDF.');
  }

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = String(options.text || '').trim();
  const fontSize = parseNumber(options.fontSize, 18);
  const color = toPdfRgb(options.color, '#111827');
  const opacity = parseNumber(options.opacity, 1);
  const textX = parseNumber(options.x, 72);
  const textY = parseNumber(options.y, 720);

  let image = null;
  let imageWidth = 0;
  let imageHeight = 0;
  if (options.editImagePath) {
    const sharp = require('sharp');
    const imageBuffer = await sharp(options.editImagePath).png().toBuffer();
    image = await doc.embedPng(imageBuffer);
    imageWidth = parseNumber(options.imageWidth, 160);
    imageHeight = (image.height / image.width) * imageWidth;
  }

  for (const pageIndex of pageIndices) {
    const page = doc.getPage(pageIndex);

    if (hasText) {
      const lines = text.split(/\r?\n/);
      lines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x: textX,
          y: textY - (lineIndex * fontSize * 1.25),
          size: fontSize,
          font,
          color,
          opacity,
        });
      });
    }

    if (image) {
      page.drawImage(image, {
        x: parseNumber(options.imageX, textX),
        y: parseNumber(options.imageY, Math.max(24, textY - imageHeight - 24)),
        width: imageWidth,
        height: imageHeight,
        opacity,
      });
    }
  }
}

async function createManagedPagesPdf(baseDoc, options = {}) {
  const totalPages = baseDoc.getPageCount();
  const removeIndices = new Set(parsePageSelection(options.removePages, totalPages, { defaultAll: false }));
  const keptIndices = Array.from({ length: totalPages }, (_, index) => index).filter(index => !removeIndices.has(index));
  const insertAt = clamp(parseInt(options.insertAt || String(keptIndices.length + 1), 10) - 1, 0, keptIndices.length);
  const blankPages = Math.max(0, parseInt(options.blankPages || '0', 10));
  const blankWidth = parseNumber(options.blankWidth, baseDoc.getPage(0)?.getWidth?.() || 595);
  const blankHeight = parseNumber(options.blankHeight, baseDoc.getPage(0)?.getHeight?.() || 842);

  const newDoc = await PDFDocument.create();
  const before = keptIndices.slice(0, insertAt);
  const after = keptIndices.slice(insertAt);

  const addCopiedPages = async (sourceDoc, indices) => {
    if (!indices.length) return;
    const pages = await newDoc.copyPages(sourceDoc, indices);
    pages.forEach(page => newDoc.addPage(page));
  };

  await addCopiedPages(baseDoc, before);

  for (let index = 0; index < blankPages; index += 1) {
    newDoc.addPage([blankWidth, blankHeight]);
  }

  if (options.insertDoc) {
    await addCopiedPages(options.insertDoc, options.insertDoc.getPageIndices());
  }

  await addCopiedPages(baseDoc, after);
  return newDoc;
}

async function applyMetadata(doc, options = {}) {
  if (parseBoolean(options.clearExisting, false)) {
    doc.setTitle('');
    doc.setAuthor('');
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setProducer('');
    doc.setCreator('');
  }

  if (options.title !== undefined) doc.setTitle(options.title);
  if (options.author !== undefined) doc.setAuthor(options.author);
  if (options.subject !== undefined) doc.setSubject(options.subject);
  if (options.producer !== undefined) doc.setProducer(options.producer);
  if (options.creator !== undefined) doc.setCreator(options.creator);
  if (options.language !== undefined && typeof doc.setLanguage === 'function') doc.setLanguage(options.language);

  if (options.keywords !== undefined) {
    const keywords = String(options.keywords)
      .split(',')
      .map(keyword => keyword.trim())
      .filter(Boolean);
    doc.setKeywords(keywords);
  }
}

async function processBatchAction(file, action, options = {}) {
  const { bytes, doc } = await loadPdfFromPath(file.path);
  let outputBytes;

  if (action === 'rotate') {
    const pageIndices = parsePageSelection(options.pages || 'all', doc.getPageCount());
    const angle = parseInt(options.angle || '90', 10);
    pageIndices.forEach(pageIndex => {
      const page = doc.getPage(pageIndex);
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + angle) % 360));
    });
    outputBytes = await doc.save();
  } else if (action === 'watermark') {
    await applyWatermark(doc, options);
    outputBytes = await doc.save();
  } else if (action === 'compress') {
    const level = options.level || 'medium';
    applyCompressionMetadataCleanup(doc);
    outputBytes = await doc.save({
      useObjectStreams: level !== 'low',
      addDefaultPage: false,
      objectsPerTick: level === 'high' ? 20 : level === 'medium' ? 50 : 100,
    });
  } else if (action === 'page-labels') {
    await applyPageLabels(doc, options);
    outputBytes = await doc.save();
  } else {
    throw new Error('Unsupported batch action.');
  }

  return {
    originalName: path.parse(file.originalname).name,
    bytes,
    outputBytes,
  };
}

router.post('/merge', pdfUpload.array('files', 20), async (req, res) => {
  const files = req.files;
  if (!files || files.length < 2) {
    files?.forEach(file => cleanup(file.path));
    return res.status(400).json({ error: 'Please upload at least 2 PDF files.' });
  }

  try {
    const merged = await PDFDocument.create();
    for (const file of files) {
      const { doc } = await loadPdfFromPath(file.path);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(page => merged.addPage(page));
    }

    const output = saveOutput('merged', 'pdf', await merged.save());
    files.forEach(file => cleanup(file.path));
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    files?.forEach(file => cleanup(file.path));
    res.status(500).json({ error: error.message });
  }
});

router.post('/split', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(req.file.path);
    const totalPages = doc.getPageCount();
    const mode = req.body.mode || 'ranges';
    const groups = mode === 'all'
      ? Array.from({ length: totalPages }, (_, index) => [index])
      : parseSplitGroups(req.body.ranges, totalPages);

    if (!groups.length) {
      cleanup(req.file.path);
      return res.status(400).json({ error: 'No valid page ranges provided.' });
    }

    const output = await createSinglePageZip(doc, groups, 'split', 'part');
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, parts: groups.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/compress', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const level = req.body.level || 'medium';
    let compressed = await compressPdfWithGhostscript(req.file.path, level).catch(() => null);
    if (!compressed) {
      const { doc } = await loadPdfFromPath(req.file.path);
      applyCompressionMetadataCleanup(doc);
      compressed = await doc.save({
        useObjectStreams: level !== 'low',
        addDefaultPage: false,
        objectsPerTick: level === 'high' ? 20 : level === 'medium' ? 50 : 100,
      });
    }
    const output = saveOutput('compressed', 'pdf', compressed);

    cleanup(req.file.path);
    res.json({
      success: true,
      filename: output.filename,
      url: output.url,
      originalSize: bytes.length,
      newSize: compressed.length,
      reduction: Math.round((1 - compressed.length / bytes.length) * 100),
    });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/image-to-pdf', imageUpload.array('files', 30), async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No images uploaded.' });
  }

  let order = [];
  try {
    order = JSON.parse(req.body.order || '[]');
  } catch {
    order = [];
  }
  const orderedFiles = order.length === files.length ? order.map(index => files[index]) : files;

  try {
    const pdfDoc = await PDFDocument.create();
    const sharp = require('sharp');

    for (const file of orderedFiles) {
      const imageBuffer = await sharp(file.path).png().toBuffer();
      const image = await pdfDoc.embedPng(imageBuffer);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    const output = saveOutput('images', 'pdf', await pdfDoc.save());
    files.forEach(file => cleanup(file.path));
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    files?.forEach(file => cleanup(file.path));
    res.status(500).json({ error: error.message });
  }
});

router.post('/pdf-to-image', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const { doc } = await loadPdfFromPath(req.file.path, { ignoreEncryption: true });
    const format = req.body.format || 'png';
    const pageNumbers = parsePageSelection(req.body.pages || 'all', doc.getPageCount()).map(index => index + 1);
    const renderedPages = await renderPdfPages(bytes, pageNumbers, format, req.file.path);

    const output = await writeZip('pdf-images', renderedPages.map(page => ({
      name: `page-${page.pageNumber}.${page.format}`,
      data: page.buffer,
    })));

    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, pages: renderedPages.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: `PDF to image conversion failed.\n${error.message}` });
  }
});

router.post('/rotate', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(req.file.path);
    const angle = parseInt(req.body.angle || '90', 10);
    const pageIndices = parsePageSelection(req.body.pages || 'all', doc.getPageCount());

    pageIndices.forEach(pageIndex => {
      const page = doc.getPage(pageIndex);
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + angle) % 360));
    });

    const output = saveOutput('rotated', 'pdf', await doc.save());
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/reorder', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(req.file.path);
    const totalPages = doc.getPageCount();
    let order = parseJsonArray(req.body.order).map(Number).filter(Number.isInteger);
    if (!order.length) {
      order = Array.from({ length: totalPages }, (_, index) => index);
    }

    const deletePages = parseJsonArray(req.body.deletePages).map(Number).filter(Number.isInteger);
    const finalOrder = order.filter(index => !deletePages.includes(index)).filter(index => index >= 0 && index < totalPages);

    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(doc, finalOrder);
    pages.forEach(page => newDoc.addPage(page));

    const output = saveOutput('reordered', 'pdf', await newDoc.save());
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/watermark', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(req.file.path);
    await applyWatermark(doc, req.body);
    const output = saveOutput('watermarked', 'pdf', await doc.save());
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/protect', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const userPassword = String(req.body.userPassword || '').trim();
    if (!userPassword) {
      cleanup(req.file.path);
      return res.status(400).json({ error: 'Enter an open password before protecting the PDF.' });
    }

    const requestedOwnerPassword = String(req.body.ownerPassword || '').trim();
    const ownerPassword = requestedOwnerPassword && requestedOwnerPassword !== userPassword
      ? requestedOwnerPassword
      : `${userPassword}-${uuidv4()}`;
    const encrypted = await protectPdfWithQpdf(req.file.path, userPassword, ownerPassword);

    const output = saveOutput('protected', 'pdf', encrypted);
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/unlock', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const password = String(req.body.password || '').trim();
    if (!password) {
      cleanup(req.file.path);
      return res.status(400).json({ error: 'Enter the current PDF password before unlocking.' });
    }

    const encryptionStatus = await getPdfEncryptionStatus(req.file.path);
    if (encryptionStatus.available && encryptionStatus.encrypted === false) {
      cleanup(req.file.path);
      return res.status(400).json({ error: 'This PDF is not encrypted, so there is nothing to unlock.' });
    }

    let unlockedBytes;
    if (encryptionStatus.available) {
      unlockedBytes = await unlockPdfWithQpdf(req.file.path, password);
    } else {
      const { doc } = await loadPdfFromPath(req.file.path, { password: req.body.password || '' });
      unlockedBytes = await doc.save();
    }
    const output = saveOutput('unlocked', 'pdf', unlockedBytes);
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    if (error.message.includes('encrypted') || error.message.includes('password')) {
      return res.status(400).json({ error: 'Incorrect password or file is not encrypted.' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/extract-text', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const { doc } = await loadPdfFromPath(req.file.path, { ignoreEncryption: true });
    const pageNumbers = parsePageSelection(req.body.pages || 'all', doc.getPageCount()).map(index => index + 1);
    const extractedText = await extractTextFromPdf(bytes, pageNumbers, req.file.path);
    const output = saveOutput('extracted-text', 'txt', Buffer.from(extractedText || '', 'utf8'));
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, pages: pageNumbers.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/pdf-to-word', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const { doc } = await loadPdfFromPath(req.file.path, { ignoreEncryption: true });
    const pageNumbers = parsePageSelection(req.body.pages || 'all', doc.getPageCount()).map(index => index + 1);
    const extractedText = await extractTextFromPdf(bytes, pageNumbers, req.file.path);
    const output = await writeDocx('pdf-to-word', extractedText);
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, pages: pageNumbers.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: `PDF to Word conversion failed. ${error.message}` });
  }
});

router.post('/pdf-to-excel', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const { doc } = await loadPdfFromPath(req.file.path, { ignoreEncryption: true });
    const pageNumbers = parsePageSelection(req.body.pages || 'all', doc.getPageCount()).map(index => index + 1);
    const extractedText = await extractTextFromPdf(bytes, pageNumbers, req.file.path);
    const rows = rowsFromExtractedText(extractedText);
    const output = await writeXlsx('pdf-to-excel', rows);
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, pages: pageNumbers.length, rows: rows.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: `PDF to Excel conversion failed. ${error.message}` });
  }
});

router.post('/pdf-to-powerpoint', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const { doc } = await loadPdfFromPath(req.file.path, { ignoreEncryption: true });
    const pageNumbers = parsePageSelection(req.body.pages || 'all', doc.getPageCount()).map(index => index + 1);
    const renderedPages = await renderPdfPages(bytes, pageNumbers, 'png', req.file.path);
    const output = await writePptxFromRenderedPages('pdf-to-powerpoint', renderedPages);
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, pages: pageNumbers.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: `PDF to PowerPoint conversion failed. ${error.message}` });
  }
});

router.post('/excel-to-pdf', excelUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const output = await convertOfficeToPdf(req.file.path, 'excel-to-pdf');
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: `Excel to PDF conversion failed. ${error.message}` });
  }
});

router.post('/word-to-pdf', wordUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const output = await convertOfficeToPdf(req.file.path, 'word-to-pdf');
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: `Word to PDF conversion failed. ${error.message}` });
  }
});

router.post('/powerpoint-to-pdf', powerPointUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const output = await convertOfficeToPdf(req.file.path, 'powerpoint-to-pdf');
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: `PowerPoint to PDF conversion failed. ${error.message}` });
  }
});

router.post('/page-labels', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(req.file.path);
    await applyPageLabels(doc, req.body);
    const output = saveOutput('page-labels', 'pdf', await doc.save());
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/crop', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(req.file.path);
    const pageIndices = parsePageSelection(req.body.pages || 'all', doc.getPageCount());
    const margins = {
      top: Math.max(0, parseNumber(req.body.top, 0)),
      right: Math.max(0, parseNumber(req.body.right, 0)),
      bottom: Math.max(0, parseNumber(req.body.bottom, 0)),
      left: Math.max(0, parseNumber(req.body.left, 0)),
    };

    for (const pageIndex of pageIndices) {
      const page = doc.getPage(pageIndex);
      const { width, height } = page.getSize();
      const croppedWidth = width - margins.left - margins.right;
      const croppedHeight = height - margins.top - margins.bottom;

      if (croppedWidth <= 10 || croppedHeight <= 10) {
        throw new Error('Crop margins are too large for at least one selected page.');
      }

      page.setMediaBox(margins.left, margins.bottom, croppedWidth, croppedHeight);
      page.setCropBox(margins.left, margins.bottom, croppedWidth, croppedHeight);
      if (typeof page.setTrimBox === 'function') page.setTrimBox(margins.left, margins.bottom, croppedWidth, croppedHeight);
      if (typeof page.setBleedBox === 'function') page.setBleedBox(margins.left, margins.bottom, croppedWidth, croppedHeight);
      if (typeof page.setArtBox === 'function') page.setArtBox(margins.left, margins.bottom, croppedWidth, croppedHeight);
    }

    const output = saveOutput('cropped', 'pdf', await doc.save());
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/extract-pages', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(req.file.path);
    const pageIndices = parsePageSelection(req.body.pages, doc.getPageCount(), { defaultAll: false });
    if (!pageIndices.length) {
      cleanup(req.file.path);
      return res.status(400).json({ error: 'Provide at least one valid page to extract.' });
    }

    const output = await createSinglePageZip(doc, pageIndices.map(index => [index]), 'extracted-pages', 'page');
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, pages: pageIndices.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/ocr', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const { doc } = await loadPdfFromPath(req.file.path, { ignoreEncryption: true });
    const pageNumbers = parsePageSelection(req.body.pages || '1', doc.getPageCount()).map(index => index + 1);
    const text = await recognizePdfText(bytes, pageNumbers, req.body.language || 'eng', req.file.path);
    const output = saveOutput('ocr-text', 'txt', Buffer.from(text || '', 'utf8'));
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, pages: pageNumbers.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: `OCR failed. ${error.message}` });
  }
});

router.post('/sign', mixedUpload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'signatureImage', maxCount: 1 },
]), async (req, res) => {
  const pdfFile = req.files?.file?.[0];
  const signatureImage = req.files?.signatureImage?.[0];
  if (!pdfFile) return res.status(400).json({ error: 'No PDF uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(pdfFile.path);
    await applySignature(doc, {
      ...req.body,
      signatureImagePath: signatureImage?.path,
    });
    const output = saveOutput('signed', 'pdf', await doc.save());
    cleanup(pdfFile.path, signatureImage?.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(pdfFile?.path, signatureImage?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/edit', mixedUpload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'editImage', maxCount: 1 },
  { name: 'editImages', maxCount: 20 },
]), async (req, res) => {
  const pdfFile = req.files?.file?.[0];
  const editImage = req.files?.editImage?.[0];
  const editImages = req.files?.editImages || [];
  if (!pdfFile) return res.status(400).json({ error: 'No PDF uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(pdfFile.path);
    await applyPdfEdit(doc, {
      ...req.body,
      editImagePath: editImage?.path,
      editImages,
    });
    const output = saveOutput('edited', 'pdf', await doc.save());
    cleanup(pdfFile.path, editImage?.path, editImages.map(file => file.path));
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(pdfFile?.path, editImage?.path, editImages.map(file => file.path));
    res.status(500).json({ error: error.message });
  }
});

router.post('/metadata', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { doc } = await loadPdfFromPath(req.file.path);
    await applyMetadata(doc, req.body);
    const output = saveOutput('metadata', 'pdf', await doc.save());
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/page-manager', mixedUpload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'insertFile', maxCount: 1 },
]), async (req, res) => {
  const pdfFile = req.files?.file?.[0];
  const insertFile = req.files?.insertFile?.[0];
  if (!pdfFile) return res.status(400).json({ error: 'No PDF uploaded.' });

  try {
    const { doc: baseDoc } = await loadPdfFromPath(pdfFile.path);
    const insertDoc = insertFile ? (await loadPdfFromPath(insertFile.path)).doc : null;
    const managedDoc = await createManagedPagesPdf(baseDoc, {
      ...req.body,
      insertDoc,
    });

    const output = saveOutput('page-manager', 'pdf', await managedDoc.save());
    cleanup(pdfFile.path, insertFile?.path);
    res.json({ success: true, filename: output.filename, url: output.url });
  } catch (error) {
    cleanup(pdfFile?.path, insertFile?.path);
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch', pdfUpload.array('files', 20), async (req, res) => {
  const files = req.files;
  const action = req.body.action || 'compress';
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Upload at least one PDF file.' });
  }

  try {
    const processedFiles = [];
    for (const file of files) {
      const result = await processBatchAction(file, action, req.body);
      processedFiles.push({
        name: `${result.originalName}-${action}.pdf`,
        data: Buffer.from(result.outputBytes),
      });
    }

    const output = await writeZip('batch', processedFiles);
    files.forEach(file => cleanup(file.path));
    res.json({ success: true, filename: output.filename, url: output.url, files: processedFiles.length });
  } catch (error) {
    files?.forEach(file => cleanup(file.path));
    res.status(500).json({ error: error.message });
  }
});

router.post('/info', pdfUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { bytes, doc } = await loadPdfFromPath(req.file.path, { ignoreEncryption: true });
    const pageCount = doc.getPageCount();
    const pages = Array.from({ length: pageCount }, (_, index) => {
      const page = doc.getPage(index);
      const { width, height } = page.getSize();
      return { index, width: Math.round(width), height: Math.round(height) };
    });

    cleanup(req.file.path);
    res.json({ success: true, pageCount, pages, fileSize: bytes.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
  }
});

router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Max 100MB.' });
  }
  res.status(400).json({ error: err.message });
});

module.exports = router;
