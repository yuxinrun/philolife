import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articleBySlug, articles, bookById, thinkerById, topicById } from '../content'
import { ArticleCard, BookCard, formatDate } from '../components/Cards'
import { BookmarkIcon } from '../components/Svgs'
import { renderMarkdown } from '../utils/markdown'
import { useBookmarks } from '../hooks/useStorage'
import { useMeta } from '../hooks/useMeta'

export function ArticleDetail() {
  const { slug = '' } = useParams()
  const article = articleBySlug.get(slug)
  const [activeId, setActiveId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const { isSaved, toggle } = useBookmarks()

  const rendered = useMemo(() => (article ? renderMarkdown(article.body) : { html: '', toc: [] }), [article])
  useMeta({ title: article?.title ?? '文章', description: article?.excerpt, image: article?.cover, type: 'article' })

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrollable = h.scrollHeight - h.clientHeight
      setProgress(scrollable > 0 ? Math.min(100, (h.scrollTop / scrollable) * 100) : 0)
      const headings = document.querySelectorAll<HTMLElement>('.article-body h2[id], .article-body h3[id]')
      let current = ''
      headings.forEach((el) => { if (el.getBoundingClientRect().top <= 160) current = el.id })
      setActiveId(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  if (!article) return <div className="empty-state"><h3>未找到该文章</h3><Link to="/articles/" className="text-link">返回文章列表</Link></div>

  const index = articles.findIndex((a) => a.slug === article.slug)
  const prev = index > 0 ? articles[index - 1] : undefined
  const next = index < articles.length - 1 ? articles[index + 1] : undefined
  const relatedThinkers = article.thinkers.map((id) => thinkerById.get(id)).filter(Boolean)
  const relatedBooks = article.books.map((id) => bookById.get(id)).filter(Boolean).slice(0, 3)
  const relatedTopics = article.topics.map((id) => topicById.get(id)).filter(Boolean)
  const relatedArticles = articles.filter((a) => a.slug !== article.slug && (a.category === article.category || a.tags.some((t) => article.tags.includes(t)))).slice(0, 3)
  const saved = isSaved(article.slug)

  return (
    <>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="container">
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span><Link to="/articles/">文章</Link><span>/</span>{article.category}</div>
        <header className="article-header">
          <div className="eyebrow">{article.category.toUpperCase()} · ESSAY</div>
          <h1>{article.title}</h1>
          <div className="english-title">{article.englishTitle}</div>
          <p className="excerpt">{article.excerpt}</p>
          <div className="article-meta">
            <span>{article.author}</span><span className="sep">·</span>
            <span>{formatDate(article.date)}</span><span className="sep">·</span>
            <span>{article.readTime} 分钟阅读</span><span className="sep">·</span>
            <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={() => toggle(article.slug)} aria-pressed={saved}>
              <BookmarkIcon filled={saved} /> {saved ? '已收藏' : '收藏'}
            </button>
          </div>
        </header>
        <figure className="article-cover" style={{ marginInline: 0 }}>
          <img src={article.cover} alt={article.coverAlt} />
        </figure>

        <div className="article-layout">
          <aside className="toc">
            <div className="toc-title">CONTENTS · 目录</div>
            <nav aria-label="文章目录">
              {rendered.toc.map((item) => (
                <a key={item.id} href={`#${item.id}`} className={`lvl-${item.level} ${activeId === item.id ? 'active' : ''}`}>{item.text}</a>
              ))}
            </nav>
          </aside>

          <article className="article-body">
            <button className="btn btn-outline mobile-toc-toggle" onClick={() => setTocOpen((v) => !v)}>{tocOpen ? '收起目录' : '展开目录'}</button>
            {tocOpen && (
              <nav className="toc open" style={{ marginBottom: 36 }} aria-label="文章目录">
                <div className="toc-title">CONTENTS · 目录</div>
                {rendered.toc.map((item) => <a key={item.id} href={`#${item.id}`} className={`lvl-${item.level} ${activeId === item.id ? 'active' : ''}`}>{item.text}</a>)}
              </nav>
            )}
            <div dangerouslySetInnerHTML={{ __html: rendered.html }} />

            <div className="article-end">
              <div className="eyebrow">TAGS &amp; CONNECTIONS</div>
              <h3>标签与关联</h3>
              <div className="tag-list" style={{ marginBottom: 24 }}>
                {article.tags.map((t) => <Link key={t} to={`/search/?q=${encodeURIComponent(t)}`} className="tag">#{t}</Link>)}
              </div>
              {relatedThinkers.length > 0 && (
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>相关思想家：{relatedThinkers.map((t, i) => (
                  <span key={t!.id}>{i > 0 && '、'}<Link to={`/thinkers/${t!.id}/`} style={{ color: 'var(--accent)' }}>{t!.name}</Link></span>
                ))}</p>
              )}
              {relatedTopics.length > 0 && (
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>所属专题：{relatedTopics.map((t, i) => (
                  <span key={t!.id}>{i > 0 && '、'}<Link to={`/topics/${t!.id}/`} style={{ color: 'var(--accent)' }}>{t!.title}</Link></span>
                ))}</p>
              )}
            </div>

            <div className="article-nav">
              <div>{prev && <Link to={`/articles/${prev.slug}/`}><span>← 上一篇</span>{prev.title}</Link>}</div>
              <div className="next">{next && <Link to={`/articles/${next.slug}/`}><span>下一篇 →</span>{next.title}</Link>}</div>
            </div>
          </article>

          <aside className="article-side">
            <div className="side-box">
              <h4>相关思想家</h4>
              {relatedThinkers.length ? relatedThinkers.map((t) => t && <Link key={t.id} to={`/thinkers/${t.id}/`}>{t.name} · {t.englishName}</Link>) : <p style={{ fontSize: 12, color: 'var(--muted)' }}>本文为综合性议题文章</p>}
            </div>
            <div className="side-box">
              <h4>相关经典</h4>
              {relatedBooks.length ? relatedBooks.map((b) => b && <Link key={b.id} to={`/books/${b.id}/`}>{b.title}</Link>) : <p style={{ fontSize: 12, color: 'var(--muted)' }}>见文末参考文献</p>}
            </div>
            <div className="side-box">
              <h4>阅读工具</h4>
              <button className="save-btn" onClick={() => toggle(article.slug)}><BookmarkIcon filled={saved} /> {saved ? '取消收藏' : '收藏本文'}</button>
              <Link to="/search/" style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginTop: 12 }}>全站搜索</Link>
            </div>
          </aside>
        </div>

        <div style={{ paddingBottom: 100 }}>
          <div className="section-head" style={{ marginBottom: 30 }}><div><div className="eyebrow">CONTINUE READING</div><h2>延伸阅读</h2></div><Link to="/articles/" className="text-link">全部文章</Link></div>
          <div className="grid grid-3">
            {relatedArticles.map((a) => <ArticleCard key={a.slug} article={a} compact />)}
            {relatedBooks.slice(0, 1).map((b) => b && <BookCard key={b.id} book={b} />)}
          </div>
        </div>
      </div>
    </>
  )
}
