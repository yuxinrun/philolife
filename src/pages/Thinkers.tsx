import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articleBySlug, bookById, thinkerById, thinkers } from '../content'
import { BookCard, PageHero, ThinkerCard } from '../components/Cards'
import { LaurelDivider } from '../components/Svgs'
import { useMeta } from '../hooks/useMeta'

export function Thinkers() {
  useMeta({ title: '思想家档案', description: '三十余位中西哲学家的生平、核心思想、代表著作、重要概念与思想影响。' })
  const [tradition, setTradition] = useState('全部')
  const [query, setQuery] = useState('')
  const list = useMemo(() => thinkers.filter((t) =>
    (tradition === '全部' || t.tradition === tradition) &&
    (!query || `${t.name}${t.englishName}${t.school}${t.era}${t.coreIdeas.join('')}`.toLowerCase().includes(query.toLowerCase()))
  ), [tradition, query])

  return (
    <>
      <PageHero eyebrow="THE THINKERS' ARCHIVE" title="思想家档案" description="他们提出问题、制造分歧、改变人们理解世界的方式。这里记录的不是庙堂式的雕像，而是仍然能够与我们对话的思想。" />
      <div className="container">
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span>思想家档案</div>
        <div className="filter-bar">
          <button className={`filter-btn ${tradition === '全部' ? 'active' : ''}`} onClick={() => setTradition('全部')}>全部</button>
          <button className={`filter-btn ${tradition === 'western' ? 'active' : ''}`} onClick={() => setTradition('western')}>西方哲学</button>
          <button className={`filter-btn ${tradition === 'eastern' ? 'active' : ''}`} onClick={() => setTradition('eastern')}>东方哲学</button>
          <input
            value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索姓名、流派或思想…"
            style={{ marginLeft: 'auto', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)', padding: '8px 14px', fontSize: 13, outline: 'none', minWidth: 230 }}
            aria-label="搜索思想家"
          />
        </div>
        <div className="grid grid-4" style={{ paddingBottom: 100 }}>
          {list.map((t) => <ThinkerCard key={t.id} thinker={t} />)}
        </div>
        {list.length === 0 && <div className="empty-state"><h3>没有找到相关思想家</h3></div>}
      </div>
    </>
  )
}

export function ThinkerDetail() {
  const { thinkerId = '' } = useParams()
  const t = thinkerById.get(thinkerId)
  useMeta({
    title: t ? `${t.name} · 思想家档案` : '思想家档案',
    description: t?.intro,
    image: t?.image,
  })
  if (!t) return <div className="empty-state"><h3>未找到该思想家</h3><Link to="/thinkers/" className="text-link">返回思想家档案</Link></div>

  const related = t.related.map((id) => thinkerById.get(id)).filter(Boolean)
  const relatedArticles = t.articleSlugs.map((s) => articleBySlug.get(s)).filter(Boolean)
  const relatedBooks = t.works.length ? Array.from(new Set(t.articleSlugs.flatMap((s) => articleBySlug.get(s)?.books ?? []))).map((id) => bookById.get(id)).filter(Boolean).slice(0, 3) : []

  return (
    <>
      <div className="container">
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span><Link to="/thinkers/">思想家档案</Link><span>/</span>{t.name}</div>
        <div className="detail-hero">
          <img className="detail-portrait" src={t.image} alt={t.imageAlt} />
          <div>
            <div className="eyebrow">{t.era.toUpperCase()} · {t.school}</div>
            <h1>{t.name}</h1>
            <div className="en">{t.englishName}</div>
            <div className="years">{t.years} · {t.era}</div>
            <p className="intro">{t.intro}</p>
            <div className="fact-grid">
              <div className="fact"><span>所属时代</span><strong>{t.era}</strong></div>
              <div className="fact"><span>哲学流派</span><strong>{t.school}</strong></div>
              <div className="fact"><span>思想传统</span><strong>{t.tradition === 'western' ? '西方哲学' : '东方哲学'}</strong></div>
            </div>
          </div>
        </div>
        <LaurelDivider style={{ width: 240, color: 'var(--accent)', opacity: .6 }} />
        <div className="detail-content" style={{ paddingTop: 50 }}>
          <div>
            <section className="detail-block">
              <h2>I. 生平与语境</h2>
              <p>{t.biography}</p>
            </section>
            <section className="detail-block">
              <h2>II. 核心思想</h2>
              <ul>
                {t.coreIdeas.map((idea) => <li key={idea} style={{ fontSize: 15.5, lineHeight: 2.05, marginBottom: 8 }}>{idea}</li>)}
              </ul>
            </section>
            <section className="detail-block">
              <h2>III. 重要概念</h2>
              <div className="concept-list">
                {t.concepts.map((c) => (
                  <div className="concept-item" key={c.term}>
                    <strong>{c.term}</strong>
                    <p>{c.explanation}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="detail-block">
              <h2>IV. 代表著作</h2>
              <ul>{t.works.map((w) => <li key={w} style={{ fontFamily: 'var(--serif)', fontSize: 16, lineHeight: 2.1 }}>《{w}》</li>)}</ul>
            </section>
            <section className="detail-block">
              <h2>V. 思想影响</h2>
              <p>{t.influence}</p>
            </section>
            {relatedArticles.length > 0 && (
              <section className="detail-block">
                <h2>VI. 推荐文章</h2>
                <div className="grid grid-2">
                  {relatedArticles.map((a) => a && (
                    <Link key={a.slug} to={`/articles/${a.slug}/`} className="card">
                      <div className="card-body"><div className="card-tag">{a.category}</div><h3 style={{ fontSize: 17 }}>{a.title}</h3></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
          <aside className="detail-side">
            <div className="side-box">
              <h4>相关人物</h4>
              {related.map((r) => r && <Link key={r.id} to={`/thinkers/${r.id}/`}>{r.name} · {r.englishName}</Link>)}
            </div>
            {relatedBooks.length > 0 && (
              <div className="side-box">
                <h4>相关经典</h4>
                {relatedBooks.map((b) => b && <Link key={b.id} to={`/books/${b.id}/`}>{b.title}</Link>)}
              </div>
            )}
            <div className="side-box">
              <h4>继续探索</h4>
              <Link to="/thinkers/">全部思想家档案</Link>
              <Link to="/books/">哲学经典图书馆</Link>
              <Link to="/topics/">思想专题</Link>
            </div>
          </aside>
        </div>
        {relatedBooks.length > 0 && (
          <div style={{ paddingBottom: 100 }}>
            <div className="section-head"><div><div className="eyebrow">RELATED READING</div><h2>延伸阅读</h2></div></div>
            <div className="grid grid-3">{relatedBooks.map((b) => b && <BookCard key={b.id} book={b} />)}</div>
          </div>
        )}
      </div>
    </>
  )
}
