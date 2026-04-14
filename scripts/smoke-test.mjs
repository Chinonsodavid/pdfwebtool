import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { once } from 'node:events'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import sharp from 'sharp'
import { PDFDocument, degrees } from 'pdf-lib'
import pptxgen from 'pptxgenjs'

const execFileAsync = promisify(execFile)
const workspace = process.cwd()
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfforge-smoke-'))
const baseUrl = 'http://127.0.0.1:3101'
const server = spawn(process.execPath, ['server.js'], {
  cwd: workspace,
  env: {
    ...process.env,
    PORT: '3101',
    HOST: '127.0.0.1',
    FRONTEND_ORIGIN: 'http://127.0.0.1:5173,http://localhost:5173',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let serverLogs = ''
server.stdout.on('data', chunk => {
  serverLogs += chunk.toString()
})
server.stderr.on('data', chunk => {
  serverLogs += chunk.toString()
})

async function waitForServer() {
  const deadline = Date.now() + 15000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/health`)
      if (response.ok) return
    } catch {
      // Retry until the server responds or times out.
    }

    await new Promise(resolve => setTimeout(resolve, 250))
  }

  throw new Error(`Server did not become ready.\n${serverLogs}`)
}

function toFile(blobBytes, filename, type) {
  return new File([blobBytes], filename, { type })
}

async function createPdf(filePath, label, pageCount = 2) {
  const doc = await PDFDocument.create()

  for (let index = 0; index < pageCount; index += 1) {
    const page = doc.addPage([420, 595])
    page.drawText(`${label} page ${index + 1}`, {
      x: 40,
      y: 520,
      size: 24,
      rotate: degrees(index === 0 ? 0 : 2),
    })
  }

  fs.writeFileSync(filePath, await doc.save())
}

async function createImage(filePath) {
  const svg = `
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff" />
      <text x="60" y="160" font-size="62" font-family="Arial" fill="#111111">OCR SAMPLE 123</text>
      <text x="60" y="250" font-size="34" font-family="Arial" fill="#f9530e">PDFForge smoke test</text>
    </svg>
  `

  await sharp(Buffer.from(svg)).png().toFile(filePath)
}

async function postForm(endpoint, buildFormData) {
  const formData = new FormData()
  await buildFormData(formData)

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    body: formData,
  })
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(`${endpoint} failed: ${payload.error || response.statusText}`)
  }

  if (payload.url) {
    const headResponse = await fetch(`${baseUrl}${payload.url}`, { method: 'HEAD' })
    if (!headResponse.ok) {
      throw new Error(`${endpoint} returned an unreadable download header URL`)
    }

    const disposition = headResponse.headers.get('content-disposition') || ''
    if (!disposition.includes('attachment')) {
      throw new Error(`${endpoint} download is missing an attachment Content-Disposition header`)
    }

    const previewUrl = payload.url.replace('/downloads/', '/preview/')
    if (/\.(pdf|png|jpe?g|webp|gif|txt)$/i.test(payload.url)) {
      const previewResponse = await fetch(`${baseUrl}${previewUrl}`, { method: 'HEAD' })
      if (!previewResponse.ok) {
        throw new Error(`${endpoint} returned an unreadable preview URL`)
      }

      const previewDisposition = previewResponse.headers.get('content-disposition') || ''
      if (!previewDisposition.includes('inline')) {
        throw new Error(`${endpoint} preview is missing an inline Content-Disposition header`)
      }
    }

    const downloadResponse = await fetch(`${baseUrl}${payload.url}`)
    if (!downloadResponse.ok) {
      throw new Error(`${endpoint} returned an unreadable download URL`)
    }

    payload.downloadBytes = new Uint8Array(await downloadResponse.arrayBuffer())
  }

  return payload
}

async function expectBadRequest(endpoint, buildFormData, expectedSnippet) {
  const formData = new FormData()
  await buildFormData(formData)

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    body: formData,
  })
  const payload = await response.json()

  if (response.status !== 400) {
    throw new Error(`${endpoint} should have returned 400, got ${response.status}`)
  }

  if (!payload.error || !payload.error.includes(expectedSnippet)) {
    throw new Error(`${endpoint} returned the wrong validation message: ${payload.error || 'missing error'}`)
  }
}

async function loadPdf(bytes, options = undefined) {
  return PDFDocument.load(bytes, options)
}

function decodeText(bytes) {
  return new TextDecoder().decode(bytes)
}

async function commandExists(command) {
  try {
    await execFileAsync('/bin/sh', ['-lc', `command -v ${command}`])
    return true
  } catch {
    return false
  }
}

async function readZipEntry(zipBytes, entryName) {
  const zipPath = path.join(tempDir, `zip-${Date.now()}-${Math.random().toString(16).slice(2)}.zip`)
  fs.writeFileSync(zipPath, zipBytes)
  const { stdout } = await execFileAsync('unzip', ['-p', zipPath, entryName], {
    encoding: 'buffer',
    maxBuffer: 50 * 1024 * 1024,
  })
  return stdout
}

async function readQpdfEncryption(bytes, label) {
  const pdfPath = path.join(tempDir, `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}.pdf`)
  fs.writeFileSync(pdfPath, bytes)
  const { stdout, stderr } = await execFileAsync('qpdf', ['--show-encryption', pdfPath], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })
  return `${stdout || ''}${stderr || ''}`
}

async function expectImageHasInk(imageBytes, label) {
  const { data, info } = await sharp(imageBytes)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  let darkPixels = 0
  for (let index = 0; index < data.length; index += info.channels) {
    if (data[index] < 120 && data[index + 1] < 120 && data[index + 2] < 120) {
      darkPixels += 1
    }
  }

  if (darkPixels < 100) {
    throw new Error(`${label} did not render enough dark text/detail pixels`)
  }
}

async function createPresentation(filePath) {
  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_WIDE'
  const slide = pptx.addSlide()
  slide.background = { color: 'FFFFFF' }
  slide.addText('Smoke deck', { x: 1, y: 1, w: 8, h: 1, fontSize: 32, color: '111111' })
  await pptx.writeFile({ fileName: filePath })
}

async function main() {
  try {
    await waitForServer()

    const pdfAPath = path.join(tempDir, 'a.pdf')
    const pdfBPath = path.join(tempDir, 'b.pdf')
    const imagePath = path.join(tempDir, 'sample.png')
    const csvPath = path.join(tempDir, 'sample.csv')
    const pptxPath = path.join(tempDir, 'sample.pptx')
    await createPdf(pdfAPath, 'Alpha', 2)
    await createPdf(pdfBPath, 'Beta', 1)
    await createImage(imagePath)
    fs.writeFileSync(csvPath, 'Name,Value\nAlpha,1\nBeta,2\n')
    await createPresentation(pptxPath)

    const pdfABytes = fs.readFileSync(pdfAPath)
    const pdfBBytes = fs.readFileSync(pdfBPath)
    const imageBytes = fs.readFileSync(imagePath)
    const csvBytes = fs.readFileSync(csvPath)
    const pptxBytes = fs.readFileSync(pptxPath)

    const results = []

    const merge = await postForm('/api/pdf/merge', async formData => {
      formData.append('files', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('files', toFile(pdfBBytes, 'b.pdf', 'application/pdf'))
    })
    const mergedDoc = await loadPdf(merge.downloadBytes)
    if (mergedDoc.getPageCount() !== 3) throw new Error('Merge did not produce 3 pages')
    results.push('merge')

    const split = await postForm('/api/pdf/split', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('mode', 'ranges')
      formData.append('ranges', '1,2')
    })
    if (!split.downloadBytes.length) throw new Error('Split ZIP is empty')
    results.push('split')

    const compress = await postForm('/api/pdf/compress', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('level', 'medium')
    })
    if (compress.newSize <= 0) throw new Error('Compress produced no output')
    results.push('compress')

    const imageToPdf = await postForm('/api/pdf/image-to-pdf', async formData => {
      formData.append('files', toFile(imageBytes, 'sample.png', 'image/png'))
      formData.append('order', JSON.stringify([0]))
    })
    const imagePdfDoc = await loadPdf(imageToPdf.downloadBytes)
    if (imagePdfDoc.getPageCount() !== 1) throw new Error('Image to PDF should create 1 page')
    results.push('image-to-pdf')

    const pdfToImage = await postForm('/api/pdf/pdf-to-image', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('format', 'png')
      formData.append('pages', '1')
    })
    if (!pdfToImage.downloadBytes.length) throw new Error('PDF to Image ZIP is empty')
    await expectImageHasInk(await readZipEntry(pdfToImage.downloadBytes, 'page-1.png'), 'PDF to Image')
    results.push('pdf-to-image')

    const pdfToWord = await postForm('/api/pdf/pdf-to-word', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('pages', '1')
    })
    if (pdfToWord.filename?.endsWith('.docx') !== true) throw new Error('PDF to Word did not return a DOCX filename')
    if (pdfToWord.downloadBytes[0] !== 0x50 || pdfToWord.downloadBytes[1] !== 0x4b) {
      throw new Error('PDF to Word output is not a DOCX zip container')
    }
    const wordXml = decodeText(await readZipEntry(pdfToWord.downloadBytes, 'word/document.xml'))
    if (!wordXml.includes('Alpha page 1')) throw new Error('PDF to Word did not include expected text')
    results.push('pdf-to-word')

    const pdfToExcel = await postForm('/api/pdf/pdf-to-excel', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('pages', '1')
    })
    if (pdfToExcel.filename?.endsWith('.xlsx') !== true) throw new Error('PDF to Excel did not return an XLSX filename')
    if (pdfToExcel.downloadBytes[0] !== 0x50 || pdfToExcel.downloadBytes[1] !== 0x4b) {
      throw new Error('PDF to Excel output is not an XLSX zip container')
    }
    const sheetXml = decodeText(await readZipEntry(pdfToExcel.downloadBytes, 'xl/worksheets/sheet1.xml'))
    if (!sheetXml.includes('Alpha page 1')) throw new Error('PDF to Excel did not include expected text')
    results.push('pdf-to-excel')

    const pdfToPowerPoint = await postForm('/api/pdf/pdf-to-powerpoint', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('pages', '1')
    })
    if (pdfToPowerPoint.filename?.endsWith('.pptx') !== true) throw new Error('PDF to PowerPoint did not return a PPTX filename')
    if (pdfToPowerPoint.downloadBytes[0] !== 0x50 || pdfToPowerPoint.downloadBytes[1] !== 0x4b) {
      throw new Error('PDF to PowerPoint output is not a PPTX zip container')
    }
    await readZipEntry(pdfToPowerPoint.downloadBytes, 'ppt/presentation.xml')
    results.push('pdf-to-powerpoint')

    const hasOfficeConverter = await commandExists('libreoffice') || await commandExists('soffice')
    if (hasOfficeConverter) {
      const excelToPdf = await postForm('/api/pdf/excel-to-pdf', async formData => {
        formData.append('file', toFile(csvBytes, 'sample.csv', 'text/csv'))
      })
      const excelPdfDoc = await loadPdf(excelToPdf.downloadBytes)
      if (excelPdfDoc.getPageCount() < 1) throw new Error('Excel to PDF did not create a page')
      results.push('excel-to-pdf')

      const powerPointToPdf = await postForm('/api/pdf/powerpoint-to-pdf', async formData => {
        formData.append('file', toFile(pptxBytes, 'sample.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'))
      })
      const powerPointPdfDoc = await loadPdf(powerPointToPdf.downloadBytes)
      if (powerPointPdfDoc.getPageCount() < 1) throw new Error('PowerPoint to PDF did not create a page')
      results.push('powerpoint-to-pdf')
    } else {
      results.push('office-to-pdf-skipped-no-libreoffice')
    }

    const rotate = await postForm('/api/pdf/rotate', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('pages', '1')
      formData.append('angle', '90')
    })
    const rotatedDoc = await loadPdf(rotate.downloadBytes)
    if (rotatedDoc.getPage(0).getRotation().angle !== 90) throw new Error('Rotate did not apply a 90° turn')
    results.push('rotate')

    const reorder = await postForm('/api/pdf/reorder', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('order', JSON.stringify([1, 0]))
    })
    const reorderedDoc = await loadPdf(reorder.downloadBytes)
    if (reorderedDoc.getPageCount() !== 2) throw new Error('Reorder changed the page count unexpectedly')
    results.push('reorder')

    const watermark = await postForm('/api/pdf/watermark', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('text', 'SMOKE TEST')
      formData.append('position', 'center')
    })
    const watermarkedDoc = await loadPdf(watermark.downloadBytes)
    if (watermarkedDoc.getPageCount() !== 2) throw new Error('Watermark output is invalid')
    results.push('watermark')

    const protect = await postForm('/api/pdf/protect', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('userPassword', 'secret123')
      formData.append('ownerPassword', 'owner123')
    })
    const protectEncryption = await readQpdfEncryption(protect.downloadBytes, 'protected')
    if (protectEncryption.includes('File is not encrypted')) throw new Error('Protect did not encrypt the PDF')
    results.push('protect')

    await expectBadRequest('/api/pdf/protect', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
    }, 'Enter an open password')
    results.push('protect-validation')

    await expectBadRequest('/api/pdf/unlock', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('password', 'secret123')
    }, 'not encrypted')
    results.push('unlock-unencrypted-validation')

    await expectBadRequest('/api/pdf/unlock', async formData => {
      formData.append('file', toFile(protect.downloadBytes, 'protected.pdf', 'application/pdf'))
      formData.append('password', 'wrong-password')
    }, 'Incorrect password')
    results.push('unlock-password-validation')

    const unlock = await postForm('/api/pdf/unlock', async formData => {
      formData.append('file', toFile(protect.downloadBytes, 'protected.pdf', 'application/pdf'))
      formData.append('password', 'secret123')
    })
    const unlockEncryption = await readQpdfEncryption(unlock.downloadBytes, 'unlocked')
    if (!unlockEncryption.includes('File is not encrypted')) throw new Error('Unlock did not remove encryption')
    results.push('unlock')

    const info = await postForm('/api/pdf/info', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
    })
    if (info.pageCount !== 2) throw new Error('Info returned the wrong page count')
    results.push('info')

    const extractText = await postForm('/api/pdf/extract-text', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('pages', '1')
    })
    if (!decodeText(extractText.downloadBytes).includes('Alpha page 1')) {
      throw new Error('Extract text did not include expected page text')
    }
    results.push('extract-text')

    const pageLabels = await postForm('/api/pdf/page-labels', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('headerText', 'Smoke Header')
      formData.append('footerText', 'Page {page} of {total}')
    })
    const labeledDoc = await loadPdf(pageLabels.downloadBytes)
    if (labeledDoc.getPageCount() !== 2) throw new Error('Page labels changed the page count')
    results.push('page-labels')

    const crop = await postForm('/api/pdf/crop', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('pages', '1')
      formData.append('top', '20')
      formData.append('right', '20')
      formData.append('bottom', '20')
      formData.append('left', '20')
    })
    const croppedDoc = await loadPdf(crop.downloadBytes)
    if (Math.round(croppedDoc.getPage(0).getWidth()) >= 420) throw new Error('Crop did not reduce the page width')
    results.push('crop')

    const extractPages = await postForm('/api/pdf/extract-pages', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('pages', '1,2')
    })
    if (!extractPages.downloadBytes.length) throw new Error('Extract pages ZIP is empty')
    results.push('extract-pages')

    const ocr = await postForm('/api/pdf/ocr', async formData => {
      formData.append('file', toFile(imageToPdf.downloadBytes, 'image-pdf.pdf', 'application/pdf'))
      formData.append('pages', '1')
      formData.append('language', 'eng')
    })
    if (!decodeText(ocr.downloadBytes).toUpperCase().includes('OCR SAMPLE')) {
      throw new Error('OCR did not detect expected text')
    }
    results.push('ocr')

    const sign = await postForm('/api/pdf/sign', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('signatureImage', toFile(imageBytes, 'signature.png', 'image/png'))
      formData.append('page', '1')
      formData.append('position', 'bottom-right')
    })
    const signedDoc = await loadPdf(sign.downloadBytes)
    if (signedDoc.getPageCount() !== 2) throw new Error('Sign output is invalid')
    results.push('sign')

    const edit = await postForm('/api/pdf/edit', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('editImage', toFile(imageBytes, 'edit-image.png', 'image/png'))
      formData.append('pages', '1')
      formData.append('text', 'Edited by smoke test')
      formData.append('x', '72')
      formData.append('y', '500')
      formData.append('fontSize', '18')
      formData.append('imageX', '72')
      formData.append('imageY', '340')
      formData.append('imageWidth', '100')
    })
    const editedDoc = await loadPdf(edit.downloadBytes)
    if (editedDoc.getPageCount() !== 2) throw new Error('Edit PDF output is invalid')
    results.push('edit')

    const metadata = await postForm('/api/pdf/metadata', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('title', 'Smoke Title')
      formData.append('author', 'Codex')
      formData.append('keywords', 'smoke,test')
      formData.append('language', 'en-US')
    })
    const metadataDoc = await loadPdf(metadata.downloadBytes)
    if (metadataDoc.getTitle() !== 'Smoke Title' || metadataDoc.getAuthor() !== 'Codex') {
      throw new Error('Metadata changes were not persisted')
    }
    results.push('metadata')

    const pageManager = await postForm('/api/pdf/page-manager', async formData => {
      formData.append('file', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('insertFile', toFile(pdfBBytes, 'b.pdf', 'application/pdf'))
      formData.append('removePages', '2')
      formData.append('insertAt', '2')
      formData.append('blankPages', '1')
    })
    const pageManagerDoc = await loadPdf(pageManager.downloadBytes)
    if (pageManagerDoc.getPageCount() !== 3) throw new Error('Page manager returned the wrong page count')
    results.push('page-manager')

    const batch = await postForm('/api/pdf/batch', async formData => {
      formData.append('files', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
      formData.append('files', toFile(pdfBBytes, 'b.pdf', 'application/pdf'))
      formData.append('action', 'rotate')
      formData.append('angle', '90')
    })
    if (!batch.downloadBytes.length) throw new Error('Batch ZIP is empty')
    results.push('batch')

    await expectBadRequest('/api/pdf/merge', async formData => {
      formData.append('files', toFile(imageBytes, 'sample.png', 'image/png'))
      formData.append('files', toFile(pdfABytes, 'a.pdf', 'application/pdf'))
    }, 'application/pdf')
    results.push('validation')

    console.log(`Smoke test passed: ${results.join(', ')}`)
  } finally {
    server.kill('SIGTERM')
    await once(server, 'exit').catch(() => {})
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

main().catch(error => {
  console.error(error.stack || error.message)
  process.exitCode = 1
})
