import { marked } from 'marked'
import type { TocItem } from '../types'

marked.setOptions({ gfm: true, breaks: false })

/**
 * 解析轻量 Markdown Frontmatter。
 * 支持 `key: value` 与 `key: a | b | c`（数组）。
 */
export function parseFrontmatter(raw: string): { meta: Record<string, string | string[]>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  const meta: Record<string, string | string[]> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (!key || !value) continue
    meta[key] = value.includes('|') ? value.split('|').map((v) => v.trim()) : value
  }
  return { meta, body: match[2] }
}

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

/** 渲染 Markdown，并为标题注入锚点 id，同时返回目录。 */
export function renderMarkdown(body: string): { html: string; toc: TocItem[] } {
  const rawHtml = marked.parse(body, { async: false }) as string
  const toc: TocItem[] = []
  let counter = 0
  const html = rawHtml.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_full, level: string, inner: string) => {
    counter += 1
    const id = `sec-${counter}`
    const text = plainText(inner)
    toc.push({ id, text, level: Number(level) as 2 | 3 })
    return `<h${level} id="${id}">${inner}</h${level}>`
  })
  return { html, toc }
}
