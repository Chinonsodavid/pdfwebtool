const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  PDFDocument,
  degrees,
  rgb,
  StandardFonts,
} = require('pdf-lib');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

const uploadsDir = path.join(__dirname, 'uploads');
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const PDF_MIME_TYPES = ['application/pdf'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});

function createUploader(allowedMimeTypes) {
  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${allowedMimeTypes.join(', ')} files are allowed`));
      }
    },
  });
}

const pdfUpload = createUploader(PDF_MIME_TYPES);
const imageUpload = createUploader(IMAGE_MIME_TYPES);
const mixedUpload = createUploader([...PDF_MIME_TYPES, ...IMAGE_MIME_TYPES]);

function cleanup(...filePaths) {
  filePaths.flat().forEach(filePath => {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      // ignore cleanup failures
    }
  });
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

async function loadPdfFromPath(filePath, options) {
  const bytes = fs.readFileSync(filePath);
  const doc = await PDFDocument.load(bytes, options);
  return { bytes, doc };
}

async function renderPdfPages(pdfBytes, pageNumbers, format = 'png') {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { createCanvas } = require('@napi-rs/canvas');
  const sharp = require('sharp');
  const pdfDocument = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
  const pages = [];

  for (const pageNumber of pageNumbers) {
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;

    let buffer = canvas.toBuffer('image/png');
    if (format === 'jpg' || format === 'jpeg') {
      buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
    }

    pages.push({
      pageNumber,
      buffer,
      width: viewport.width,
      height: viewport.height,
      format: format === 'jpeg' ? 'jpg' : format,
    });
  }

  return pages;
}

async function extractTextFromPdf(pdfBytes, pageNumbers) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
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

async function recognizePdfText(pdfBytes, pageNumbers, language = 'eng') {
  const Tesseract = require('tesseract.js');
  const renderedPages = await renderPdfPages(pdfBytes, pageNumbers, 'png');
  const sections = [];

  for (const page of renderedPages) {
    const result = await Tesseract.recognize(page.buffer, language);
    sections.push(`Page ${page.pageNumber}\n${result.data.text.trim()}`);
  }

  return sections.join('\n\n');
}

function applyCompressionMetadataCleanup(doc) {
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('');
  doc.setCreator('');
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
    const { bytes, doc } = await loadPdfFromPath(req.file.path);
    const level = req.body.level || 'medium';
    applyCompressionMetadataCleanup(doc);

    const compressed = await doc.save({
      useObjectStreams: level !== 'low',
      addDefaultPage: false,
      objectsPerTick: level === 'high' ? 20 : level === 'medium' ? 50 : 100,
    });
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
    const renderedPages = await renderPdfPages(bytes, pageNumbers, format);

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
    const { doc } = await loadPdfFromPath(req.file.path);
    const userPassword = req.body.userPassword || '';
    const ownerPassword = req.body.ownerPassword || `${userPassword}_owner`;

    const encrypted = await doc.save({
      userPassword,
      ownerPassword,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false,
      },
    });

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
    const { doc } = await loadPdfFromPath(req.file.path, { password: req.body.password || '' });
    const output = saveOutput('unlocked', 'pdf', await doc.save());
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
    const extractedText = await extractTextFromPdf(bytes, pageNumbers);
    const output = saveOutput('extracted-text', 'txt', Buffer.from(extractedText || '', 'utf8'));
    cleanup(req.file.path);
    res.json({ success: true, filename: output.filename, url: output.url, pages: pageNumbers.length });
  } catch (error) {
    cleanup(req.file?.path);
    res.status(500).json({ error: error.message });
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
    const text = await recognizePdfText(bytes, pageNumbers, req.body.language || 'eng');
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
