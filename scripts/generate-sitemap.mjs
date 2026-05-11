import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seoLandingPages } from '../data/seoLandingPages.js'
import { guideSummaries, siteInfo, trustLinks } from '../data/siteContent.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')

const toolPaths = [
  '/merge',
  '/split',
  '/compress',
  '/image-to-pdf',
  '/pdf-to-image',
  '/word-to-pdf',
  '/pdf-to-word',
  '/pdf-to-excel',
  '/excel-to-pdf',
  '/powerpoint-to-pdf',
  '/pdf-to-powerpoint',
  '/rotate',
  '/reorder',
  '/watermark',
  '/edit',
  '/protect',
  '/unlock',
  '/extract-text',
  '/page-labels',
  '/crop',
  '/extract-pages',
  '/ocr',
  '/sign',
  '/metadata',
  '/page-manager',
  '/batch',
]

const today = new Date().toISOString().slice(0, 10)
const routes = [
  { path: '/', priority: '1.0' },
  { path: '/tools', priority: '0.9' },
  { path: '/guides', priority: '0.9' },
  ...trustLinks.map(link => ({ path: link.to, priority: '0.7' })),
  ...toolPaths.map(routePath => ({ path: routePath, priority: '0.8' })),
  ...guideSummaries.map(guide => ({ path: `/guides/${guide.slug}`, priority: '0.7' })),
  ...seoLandingPages.map(page => ({ path: page.path, priority: '0.9' })),
]

const uniqueRoutes = Array.from(new Map(routes.map(route => [route.path, route])).values())

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes.map(route => {
  const loc = `${siteInfo.url}${route.path === '/' ? '' : route.path}`
  return `  <url><loc>${escapeXml(loc)}</loc><lastmod>${today}</lastmod><priority>${route.priority}</priority></url>`
}).join('\n')}
</urlset>
`

fs.mkdirSync(distDir, { recursive: true })
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml)
console.log(`Generated sitemap with ${uniqueRoutes.length} routes.`)
