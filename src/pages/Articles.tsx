import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { articles, categories } from '../content'
import { ArticleCard, PageHero } from '../components/Cards'
import { useMeta } from '../hooks/useMeta'

export function Articles() {
  useMeta({ title: '全部文章', description: 'PhiloLife 全部深度哲学文章的归档与筛选。' })
  const [category, setCategory] = useState('全部')
  const [tag, setTag] = useState('全部')
  const cats = ['全部', ...Array.from(new Set(articles.map((a) => a.category)))]
  const tags = ['全部', ...Array.from(new Set(articles.flatMap((a) => a.tags)))]
  const list = useMemo(() => articles.filter((a) => (category === '全部' || a.category === category) && (tag === '全部' || a.tags.includes(tag))), [category, tag])

  return (
    <>
      <PageHero eyebrow="THE ARTICLE ARCHIVE" title="全部文章" description="有观点、有论证、有分歧，也有留给读者自己的问题。按分类或标签筛选，慢慢读。" />
      <div className="container">
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span>全部文章</div>
        <div className="filter-bar">
          {cats.map((c) => <button key={c} className={`filter-btn ${category === c ? 'active' : ''}`} onClick={() => { setCategory(c); setTag('全部') }}>{c}</button>)}
          <span className="filter-count">{list.length} 篇文章</span>
        </div>
        <div className="filter-bar" style={{ paddingTop: 0, borderBottom: 'none' }}>
          {tags.slice(0, 18).map((t) => <button key={t} className={`filter-btn ${tag === t ? 'active' : ''}`} onClick={() => setTag(t)}>{t}</button>)}
        </div>
        <div className="grid grid-3" style={{ paddingBottom: 100 }}>
          {list.map((a) => <ArticleCard key={a.slug} article={a} />)}
        </div>
        {list.length === 0 && <div className="empty-state"><h3>没有符合条件的文章</h3><p>试试其他分类或标签。</p></div>}
      </div>
    </>
  )
}

export function CategoryPage() {
  const location = useLocation()
  const path = location.pathname
  const cat = categories.find((c) => c.path === path || `${c.path}/` === path)
  const list = articles.filter((a) => a.category === (cat?.name ?? ''))
  useMeta({ title: cat?.name ?? '哲学分类', description: cat?.description })
  const [tag, setTag] = useState('全部')
  const tags = ['全部', ...Array.from(new Set(list.flatMap((a) => a.tags)))]
  const shown = tag === '全部' ? list : list.filter((a) => a.tags.includes(tag))

  if (!cat) return <div className="empty-state"><h3>分类不存在</h3><Link to="/articles/" className="text-link">返回全部文章</Link></div>

  return (
    <>
      <PageHero eyebrow={cat.english.toUpperCase()} title={cat.name} description={cat.description} />
      <div className="container">
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span>{cat.name}</div>
        {tags.length > 1 && (
          <div className="filter-bar">
            {tags.slice(0, 16).map((t) => <button key={t} className={`filter-btn ${tag === t ? 'active' : ''}`} onClick={() => setTag(t)}>{t}</button>)}
            <span className="filter-count">{shown.length} 篇文章</span>
          </div>
        )}
        <div className="grid grid-3" style={{ paddingBottom: 100 }}>
          {shown.map((a) => <ArticleCard key={a.slug} article={a} />)}
        </div>
        {shown.length === 0 && <div className="empty-state"><h3>该分类下暂无文章</h3><p>内容正在持续扩充中。</p></div>}
      </div>
    </>
  )
}
