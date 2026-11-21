import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articleBySlug, bookById, books } from '../content'
import { BookCard, PageHero } from '../components/Cards'
import { useMeta } from '../hooks/useMeta'

export function Books() {
  useMeta({ title: '哲学经典图书馆', description: '四十余部中西哲学经典的典藏档案：背景、内容、核心思想、思想局限与阅读顺序。' })
  const [tradition, setTradition] = useState('全部')
  const [query, setQuery] = useState('')
  const list = useMemo(() => books.filter((b) =>
    (tradition === '全部' || b.tradition === tradition) &&
    (!query || `${b.title}${b.originalTitle}${b.author}${b.field}${b.coreIdeas.join('')}`.toLowerCase().includes(query.toLowerCase()))
  ), [tradition, query])

  return (
    <>
      <PageHero eyebrow="THE PHILOSOPHICAL LIBRARY" title="哲学经典图书馆" description="典藏不是供奉。每部经典都附带它的背景、论证、争议与局限——理解一本书，从理解它试图解决的问题开始。" />
      <div className="container">
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span>哲学经典</div>
        <div className="filter-bar">
          <button className={`filter-btn ${tradition === '全部' ? 'active' : ''}`} onClick={() => setTradition('全部')}>全部</button>
          <button className={`filter-btn ${tradition === 'western' ? 'active' : ''}`} onClick={() => setTradition('western')}>西方经典</button>
          <button className={`filter-btn ${tradition === 'eastern' ? 'active' : ''}`} onClick={() => setTradition('eastern')}>东方经典</button>
          <input
            value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索书名、作者或思想…"
            style={{ marginLeft: 'auto', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)', padding: '8px 14px', fontSize: 13, outline: 'none', minWidth: 230 }}
            aria-label="搜索书籍"
          />
        </div>
        <div className="grid grid-2" style={{ paddingBottom: 100 }}>
          {list.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
        {list.length === 0 && <div className="empty-state"><h3>没有找到相关经典</h3></div>}
      </div>
    </>
  )
}

export function BookDetail() {
  const { bookId = '' } = useParams()
  const b = bookById.get(bookId)
  useMeta({ title: b ? `${b.title} · 哲学经典` : '哲学经典', description: b?.intro, image: b?.cover })
  if (!b) return <div className="empty-state"><h3>未找到该经典</h3><Link to="/books/" className="text-link">返回图书馆</Link></div>

  const related = b.related.map((id) => bookById.get(id)).filter(Boolean)
  const relatedArticles = b.articleSlugs.map((s) => articleBySlug.get(s)).filter(Boolean)

  return (
    <>
      <div className="container">
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span><Link to="/books/">哲学经典</Link><span>/</span>{b.title}</div>
        <div className="detail-hero">
          <img className="book-detail-cover" src={b.cover} alt={b.coverAlt} />
          <div>
            <div className="eyebrow">{b.field.toUpperCase()} · {b.school}</div>
            <h1>{b.title}</h1>
            <div className="en">{b.originalTitle}</div>
            <div className="years">{b.author} · {b.year}</div>
            <p className="intro">{b.intro}</p>
            <div className="fact-grid">
              <div className="fact"><span>哲学领域</span><strong>{b.field}</strong></div>
              <div className="fact"><span>所属流派</span><strong>{b.school}</strong></div>
              <div className="fact"><span>思想传统</span><strong>{b.tradition === 'western' ? '西方哲学' : '东方哲学'}</strong></div>
            </div>
          </div>
        </div>
        <div className="detail-content" style={{ paddingTop: 50 }}>
          <div>
            <section className="detail-block">
              <h2>I. 作品背景</h2>
              <p>{b.background}</p>
            </section>
            <section className="detail-block">
              <h2>II. 内容概要</h2>
              <p>{b.content}</p>
            </section>
            <section className="detail-block">
              <h2>III. 核心思想</h2>
              <ul>{b.coreIdeas.map((idea) => <li key={idea} style={{ fontSize: 15.5, lineHeight: 2.05, marginBottom: 8 }}>{idea}</li>)}</ul>
            </section>
            <section className="detail-block">
              <h2>IV. 关键概念</h2>
              <div className="tag-list">{b.keyConcepts.map((c) => <span className="tag" key={c}>{c}</span>)}</div>
            </section>
            <section className="detail-block">
              <h2>V. 重要章节</h2>
              <ul>{b.chapters.map((c) => <li key={c} style={{ fontSize: 15, lineHeight: 2.1, fontFamily: 'var(--serif)' }}>{c}</li>)}</ul>
            </section>
            <section className="detail-block">
              <h2>VI. 哲学价值与争议</h2>
              <p><strong>价值：</strong>{b.value}</p>
              <p><strong>局限与争议：</strong>{b.criticism}</p>
            </section>
            <section className="detail-block">
              <h2>VII. 阅读建议</h2>
              <p><strong>适合读者：</strong>{b.audience}</p>
              <p><strong>推荐顺序：</strong>{b.readingOrder}</p>
            </section>
            {relatedArticles.length > 0 && (
              <section className="detail-block">
                <h2>VIII. 延伸文章</h2>
                <div className="grid grid-2">
                  {relatedArticles.map((a) => a && (
                    <Link key={a.slug} to={`/articles/${a.slug}/`} className="card"><div className="card-body"><div className="card-tag">{a.category}</div><h3 style={{ fontSize: 17 }}>{a.title}</h3></div></Link>
                  ))}
                </div>
              </section>
            )}
          </div>
          <aside className="detail-side">
            <div className="side-box">
              <h4>相关书籍</h4>
              {related.map((r) => r && <Link key={r.id} to={`/books/${r.id}/`}>{r.title}</Link>)}
            </div>
            <div className="side-box">
              <h4>阅读提示</h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.9 }}>注意区分原著创作年代与不同译本的出版年份。本站所记年代为原始创作或成书年代。</p>
            </div>
            <div className="side-box">
              <h4>继续探索</h4>
              <Link to="/books/">全部经典</Link>
              <Link to="/thinkers/">思想家档案</Link>
            </div>
          </aside>
        </div>
        {related.length > 0 && (
          <div style={{ paddingBottom: 100 }}>
            <div className="section-head"><div><div className="eyebrow">RELATED BOOKS</div><h2>相关经典</h2></div></div>
            <div className="grid grid-3">{related.map((r) => r && <BookCard key={r.id} book={r} />)}</div>
          </div>
        )}
      </div>
    </>
  )
}
