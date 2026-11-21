import { Link, useParams } from 'react-router-dom'
import { articleBySlug, bookById, thinkerById, topics } from '../content'
import { ArticleCard, BookCard, PageHero } from '../components/Cards'
import { LaurelDivider } from '../components/Svgs'
import { useMeta } from '../hooks/useMeta'

export function Topics() {
  useMeta({ title: '思想专题', description: '围绕人生意义、幸福、自由、孤独、死亡与爱六大命题组织的深度阅读专题。' })
  return (
    <>
      <PageHero eyebrow="IN-DEPTH TOPICS" title="思想专题" description="专题不是文章的简单合集。每个专题都包含导读、系列文章、相关思想家、经典书籍，以及留给你的进一步思考。" />
      <div className="container" style={{ paddingBottom: 100 }}>
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span>思想专题</div>
        <div className="grid grid-2" style={{ marginTop: 20 }}>
          {topics.map((t, i) => (
            <Link key={t.id} to={`/topics/${t.id}/`} className="topic-feature" style={{ gridTemplateColumns: '1fr' }}>
              <div className="topic-feature-image" style={{ minHeight: 220 }}><img src={t.image} alt={t.imageAlt} loading="lazy" /></div>
              <div className="topic-feature-body" style={{ padding: 32 }}>
                <div className="eyebrow">TOPIC {String(i + 1).padStart(2, '0')} · {t.englishTitle}</div>
                <h3>{t.title}</h3>
                <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.intro}</p>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>{t.articleSlugs.length} 篇文章 · {t.thinkers.length} 位思想家</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export function TopicDetail() {
  const { topicId = '' } = useParams()
  const topic = topics.find((t) => t.id === topicId)
  useMeta({ title: topic ? `${topic.title} · 思想专题` : '思想专题', description: topic?.intro, image: topic?.image })
  if (!topic) return <div className="empty-state"><h3>未找到该专题</h3><Link to="/topics/" className="text-link">返回专题列表</Link></div>

  const articlesList = topic.articleSlugs.map((s) => articleBySlug.get(s)).filter(Boolean)
  const relatedThinkers = topic.thinkers.map((id) => thinkerById.get(id)).filter(Boolean)
  const relatedBooks = topic.books.map((id) => bookById.get(id)).filter(Boolean)

  return (
    <>
      <section className="topic-hero">
        <img src={topic.image} alt={topic.imageAlt} />
        <div className="container topic-hero-inner">
          <div className="eyebrow">{topic.englishTitle}</div>
          <h1>{topic.title}</h1>
          <p>{topic.subtitle}</p>
        </div>
      </section>
      <div className="container" style={{ paddingBottom: 100 }}>
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span><Link to="/topics/">思想专题</Link><span>/</span>{topic.title}</div>
        <div className="detail-content" style={{ paddingTop: 40 }}>
          <div>
            <section className="detail-block">
              <h2>专题导读</h2>
              <p style={{ fontSize: 16.5, lineHeight: 2.1 }}>{topic.intro}</p>
            </section>
            <section className="detail-block">
              <h2>系列文章</h2>
              <div className="grid grid-2">
                {articlesList.map((a) => a && <ArticleCard key={a.slug} article={a} compact />)}
              </div>
            </section>
            <section className="detail-block">
              <h2>核心问题</h2>
              <div className="grid grid-2" style={{ gap: 16 }}>
                {topic.questions.map((q) => (
                  <div className="question-card" key={q.question}>
                    <h4>{q.question}</h4>
                    <p>{q.guide}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="detail-block">
              <h2>进一步思考</h2>
              <div className="further-card">
                <div className="eyebrow">QUESTIONS FOR YOU</div>
                <ol>{topic.furtherThinking.map((q) => <li key={q}>{q}</li>)}</ol>
              </div>
            </section>
          </div>
          <aside className="detail-side">
            <div className="side-box">
              <h4>相关思想家</h4>
              {relatedThinkers.map((t) => t && <Link key={t.id} to={`/thinkers/${t.id}/`}>{t.name} · {t.englishName}</Link>)}
            </div>
            <div className="side-box">
              <h4>经典阅读</h4>
              {relatedBooks.map((b) => b && <Link key={b.id} to={`/books/${b.id}/`}>{b.title}</Link>)}
            </div>
            <div className="side-box">
              <h4>其他专题</h4>
              {topics.filter((t) => t.id !== topic.id).map((t) => <Link key={t.id} to={`/topics/${t.id}/`}>{t.title}</Link>)}
            </div>
          </aside>
        </div>
        <LaurelDivider style={{ width: 240, margin: '0 auto', color: 'var(--accent)' }} />
        {relatedBooks.length > 0 && (
          <div style={{ marginTop: 50 }}>
            <div className="section-head"><div><div className="eyebrow">READING LIST</div><h2>主题书单</h2></div></div>
            <div className="grid grid-3">{relatedBooks.map((b) => b && <BookCard key={b.id} book={b} />)}</div>
          </div>
        )}
      </div>
    </>
  )
}
