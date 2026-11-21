import { useEffect } from 'react'

interface MetaOptions {
  title: string
  description?: string
  type?: 'website' | 'article' | 'book'
  image?: string
}

function setMeta(selector: string, attr: string, key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function useMeta({ title, description, type = 'website', image }: MetaOptions) {
  useEffect(() => {
    const fullTitle = title.includes('PhiloLife') ? title : `${title} — PhiloLife 哲学与人生`
    document.title = fullTitle
    const desc = description ?? '以哲学理解人生，以理性认识世界，以智慧面对生命。'
    setMeta('meta[name="description"]', 'name', 'description', desc)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    if (image) setMeta('meta[property="og:image"]', 'property', 'og:image', image)
  }, [title, description, type, image])
}
