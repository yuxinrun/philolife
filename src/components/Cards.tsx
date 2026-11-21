import { Link } from 'react-router-dom'
import type { Article, Book, Thinker } from '../types'
import { ArrowIcon, BookIllustration } from './Svgs'

export function formatDate(date: string) {
  const parts = date.split('-')
  if (parts.length !== 3) return date
  return `${parts[0]} 年 ${Number(parts[1])} 月 ${Number(parts[2])} 日`
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <Link to={`/articles/${article.slug}/`} className={`card ${compact ? 'compact' : ''}`}>
      <div className="card-image">
        <img src={article.cover} alt={article.coverAlt} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-tag">{article.category}</div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="card-foot">
          <span>{formatDate(article.date)}</span>
          <span>{article.readTime} 分钟阅读 <span className="dot" /> <ArrowIcon style={{ width: 14, height: 14, verticalAlign: 'middle' }} /></span>
        </div>
      </div>
    </Link>
  )
}

export function ThinkerCard({ thinker }: { thinker: Thinker }) {
  return (
    <Link to={`/thinkers/${thinker.id}/`} className="card thinker-card">
      <div className="thinker-avatar">
        <img src={thinker.image} alt={thinker.imageAlt} loading="lazy" />
      </div>
      <h3>{thinker.name}</h3>
      <div className="en">{thinker.englishName}</div>
      <div className="years">{thinker.years}</div>
      <div className="school">{thinker.school}</div>
    </Link>
  )
}

export function BookCard({ book }: { book: Book }) {
  return (
    <Link to={`/books/${book.id}/`} className="card book-card">
      <div className="book-cover"><img src={book.cover} alt={book.coverAlt} loading="lazy" /></div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <h3>{book.title}</h3>
        <div className="original">{book.originalTitle}</div>
        <div className="meta">{book.author} · {book.field}</div>
        <p>{book.intro}</p>
      </div>
    </Link>
  )
}

export function SectionHead({ eyebrow, title, description, linkTo, linkText = '查看全部' }: {
  eyebrow: string; title: string; description?: string; linkTo?: string; linkText?: string
}) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div className="divider-line" />
      {linkTo && <Link to={linkTo} className="text-link">{linkText} <ArrowIcon /></Link>}
    </div>
  )
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <BookIllustration className="ornament" />
      </div>
    </section>
  )
}
