import { useEffect } from 'react'
import { siteInfo } from '../data/siteContent'

function setMeta(selector, attribute, value) {
  if (!value) return

  const element = document.head.querySelector(selector)
  if (element) {
    element.setAttribute(attribute, value)
  }
}

export function useDocumentMeta({ title, description, canonicalPath }) {
  useEffect(() => {
    if (title) {
      document.title = title
      setMeta('meta[property="og:title"]', 'content', title)
    }

    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
    }

    if (canonicalPath) {
      const canonicalUrl = `${siteInfo.url}${canonicalPath === '/' ? '' : canonicalPath}`
      setMeta('link[rel="canonical"]', 'href', canonicalUrl)
      setMeta('meta[property="og:url"]', 'content', canonicalUrl)
    }
  }, [canonicalPath, description, title])
}
