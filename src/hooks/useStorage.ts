import { useCallback, useEffect, useState } from 'react'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function useLocalState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback))
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
  }, [key, value])
  return [value, setValue] as const
}

export function useTheme() {
  const [theme, setTheme] = useLocalState<'light' | 'dark'>('philolife-theme', 'light')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), [setTheme])
  return { theme, toggle }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalState<string[]>('philolife-bookmarks', [])
  const toggle = useCallback((slug: string) => {
    setBookmarks((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]))
  }, [setBookmarks])
  return { bookmarks, toggle, isSaved: (slug: string) => bookmarks.includes(slug) }
}
