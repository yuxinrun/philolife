import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { articles, books, thinkers, topics } from '../content'
import { useMeta } from '../hooks/useMeta'

type Result = { type: string; title: string; subtitle: string; path: string; image: string; text: string }

export function Search() {
  const [params, setParams] = useSearchParams()
  const [input, setInput] = useState(params.get('q') ?? '')
  const [tab, setTab] = useState('全部')
  const query = (params.get('q') ?? '').trim()
  useMeta({ title: '全站搜索', description: '搜索 PhiloLife 的文章、思想家、经典书籍与思想专题。' })

  useEffect(() => { setInput(params.get('q') ?? '') }, [params])

  const results = useMemo<Result[]>(() => {
    if (!query) return []
    const q = query.toLowerCase()
    const list: Result[] = []
    articles.forEach((a) => {
      const haystack = `${a.title}${a.englishTitle}${a.excerpt}${a.category}${a.tags.join('')}${a.thinkers.join('')}${a.books.join('')}${a.body.slice(0, 1200)}`.toLowerCase()
      if (haystack.includes(q)) list.push({ type: '文章', title: a.title, subtitle: `${a.category} · ${a.readTime} 分钟阅读`, path: `/articles/${a.slug}/`, image: a.cover, text: a.excerpt })
    })
    thinkers.forEach((t) => {
      const haystack = `${t.name}${t.englishName}${t.era}${t.school}${t.intro}${t.coreIdeas.join('')}${t.works.join('')}`.toLowerCase()
      if (haystack.includes(q)) list.push({ type: '思想家', title: t.name, subtitle: `${t.englishName} · ${t.years}`, path: `/thinkers/${t.id}/`, image: t.image, text: t.intro })
    })
    books.forEach((b) => {
      const haystack = `${b.title}${b.originalTitle}${b.author}${b.field}${b.school}${b.intro}${b.keyConcepts.join('')}`.toLowerCase()
      if (haystack.includes(q)) list.push({ type: '经典', title: b.title, subtitle: `${b.author} · ${b.field}`, path: `/books/${b.id}/`, image: b.cover, text: b.intro })
    })
    topics.forEach((t) => {
      const haystack = `${t.title}${t.englishTitle}${t.subtitle}${t.intro}${t.questions.map((x) => x.question).join('')}`.toLowerCase()
      if (haystack.includes(q)) list.push({ type: '专题', title: t.title, subtitle: t.englishTitle, path: `/topics/${t.id}/`, image: t.image, text: t.intro })
    })
    return list
  }, [query])

  const shown = tab === '全部' ? results : results.filter((r) => r.type === tab)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setParams(input.trim() ? { q: input.trim() } : {})
  }

  return (
    <>
      <div className="container search-hero">
        <div className="eyebrow">SEARCH THE ARCHIVE</div>
        <h1 style={{ fontSize: 'clamp(34px,5vw,58px)', fontWeight: 500, marginTop: 14 }}>全站搜索</h1>
        <form className="search-box" onSubmit={submit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="搜索标题、关键词、摘要、思想家、书籍或标签…" aria-label="搜索关键词" />
          <button type="submit" className="btn btn-outline" style={{ minHeight: 40, padding: '0 20px' }}>搜索</button>
        </form>
        <div className="search-tabs">
          {['全部', '文章', '思想家', '经典', '专题'].map((t) => (
            <button key={t} className={`filter-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        {query && <p style={{ fontSize: 13, color: 'var(--muted)' }}>关于「<strong style={{ color: 'var(--ink)' }}>{query}</strong>」的 {results.length} 条结果</p>}
      </div>
      <div className="container" style={{ paddingBottom: 100 }}>
        {shown.map((r, i) => (
          <Link key={`${r.path}-${i}`} to={r.path} className="result-row">
            <img src={r.image} alt="" loading="lazy" />
            <div>
              <span className="type">{r.type.toUpperCase()}</span>
              <h3>{r.title}</h3>
              <p style={{ marginBottom: 6 }}>{r.subtitle}</p>
              <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.text}</p>
            </div>
          </Link>
        ))}
        {query && shown.length === 0 && <div className="empty-state"><h3>没有找到匹配的内容</h3><p>换个关键词试试，或浏览<Link to="/articles/" style={{ color: 'var(--accent)' }}>全部文章</Link>。</p></div>}
        {!query && (
          <div className="empty-state">
            <h3>从一个问题开始</h3>
            <p>试试搜索：意义、幸福、自由、苏格拉底、庄子、柏拉图、死亡、孤独。</p>
            <div className="tag-list" style={{ justifyContent: 'center', marginTop: 20 }}>
              {['意义', '幸福', '自由', '苏格拉底', '庄子', '死亡'].map((t) => <Link key={t} to={`/search/?q=${encodeURIComponent(t)}`} className="tag">{t}</Link>)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
