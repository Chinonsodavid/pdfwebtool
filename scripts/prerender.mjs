import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const templatePath = path.join(distDir, 'index.html')
const baseTemplate = fs.readFileSync(templatePath, 'utf8')

function routeToFiles(routePath) {
  if (routePath === '/') return path.join(distDir, 'index.html')
  const cleanRoute = routePath.replace(/^\//, '')
  return [
    path.join(distDir, cleanRoute, 'index.html'),
    path.join(distDir, `${cleanRoute}.html`),
  ]
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function findMetadata(routePath, { seoLandingPages, guideSummaries, siteInfo, trustLinks, tools }) {
  const landing = seoLandingPages.find(page => page.path === routePath)
  if (landing) {
    return {
      title: landing.title,
      description: landing.metaDescription || landing.description,
      canonicalPath: landing.canonicalPath || landing.path,
    }
  }

  const tool = tools.find(item => item.path === routePath)
  if (tool) {
    return {
      title: `${tool.label} - Free Online Tool | ${siteInfo.name}`,
      description: `${tool.desc}. Use ${siteInfo.name} to process your file online with a focused PDF workflow.`,
      canonicalPath: tool.path,
    }
  }

  const guide = guideSummaries.find(item => `/guides/${item.slug}` === routePath)
  if (guide) {
    return {
      title: `${guide.title} | ${siteInfo.name}`,
      description: guide.description,
      canonicalPath: `/guides/${guide.slug}`,
    }
  }

  const trustPage = trustLinks.find(link => link.to === routePath)
  if (trustPage) {
    return {
      title: `${trustPage.label} | ${siteInfo.name}`,
      description: `${siteInfo.name} ${trustPage.label.toLowerCase()} information for visitors using the PDF tools website.`,
      canonicalPath: trustPage.to,
    }
  }

  if (routePath === '/tools') {
    return {
      title: `All PDF Tools | ${siteInfo.name}`,
      description: `Browse ${siteInfo.name} tools for PDF conversion, compression, editing, organizing, OCR, and document security.`,
      canonicalPath: '/tools',
    }
  }

  if (routePath === '/guides') {
    return {
      title: `PDF Guides | ${siteInfo.name}`,
      description: `Read practical PDF guides for compression, conversion, OCR, file sharing, and document preparation.`,
      canonicalPath: '/guides',
    }
  }

  return {
    title: 'Constant PDF - Free PDF Tools, Converters, OCR, and File Guides',
    description: 'Use Constant PDF to merge, split, compress, convert, OCR, sign, protect, unlock, and organize PDF files with helpful document guides.',
    canonicalPath: '/',
  }
}

function applyMetadata(html, routePath, data) {
  const metadata = findMetadata(routePath, data)
  const { siteInfo } = data
  const canonicalUrl = `${siteInfo.url}${metadata.canonicalPath === '/' ? '' : metadata.canonicalPath}`
  return html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(metadata.description)}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`)
}

const vite = await createServer({
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
})

try {
  const { render } = await vite.ssrLoadModule('/scripts/prerender-entry.jsx')
  const { seoLandingPages } = await vite.ssrLoadModule('/data/seoLandingPages.js')
  const { guideSummaries, siteInfo, trustLinks } = await vite.ssrLoadModule('/data/siteContent.js')
  const { tools } = await vite.ssrLoadModule('/utils/toolCatalog.jsx')
  const data = { seoLandingPages, guideSummaries, siteInfo, trustLinks, tools }
  const corePaths = [
    '/',
    '/tools',
    '/guides',
    ...trustLinks.map(link => link.to),
    ...tools.map(tool => tool.path),
    ...guideSummaries.map(guide => `/guides/${guide.slug}`),
    ...seoLandingPages.map(page => page.path),
  ]
  const uniquePaths = [...new Set(corePaths)]

  for (const routePath of uniquePaths) {
    const appHtml = render(routePath)
    const html = applyMetadata(
      baseTemplate.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
      routePath,
      data,
    )
    const outputFiles = [routeToFiles(routePath)].flat()
    for (const outputFile of outputFiles) {
      fs.mkdirSync(path.dirname(outputFile), { recursive: true })
      fs.writeFileSync(outputFile, html)
    }
  }

  console.log(`Prerendered ${uniquePaths.length} routes.`)
} finally {
  await vite.close()
}
