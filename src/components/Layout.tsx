import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { categories } from '../content'
import { useTheme } from '../hooks/useStorage'
import { ArrowIcon, BrandMark, SearchIcon } from './Svgs'

const navItems = [
  { path: '/', label: '首页' },
  ...categories.map((c) => ({ path: c.path, label: c.name })),
  { path: '/thinkers/', label: '思想家' },
  { path: '/books/', label: '哲学经典' },
  { path: '/articles/', label: '文章' },
  { path: '/topics/', label: '思想专题' },
  { path: '/about/', label: '关于我们' },
]

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setMenuOpen(false); setSearchOpen(false) }, [location.pathname])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search/?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
  }

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="PhiloLife 哲学与人生首页">
            <BrandMark />
            <div className="brand-text">
              <div className="brand-en">PhiloLife</div>
              <div className="brand-cn">哲学与人生</div>
            </div>
          </Link>
          <nav className="main-nav" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setSearchOpen((v) => !v)} aria-label="搜索" aria-expanded={searchOpen}>
              <SearchIcon />
            </button>
            <button className="icon-btn" onClick={toggle} aria-label={theme === 'light' ? '切换深色阅读模式' : '切换浅色模式'} title="深色阅读模式">
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
                </svg>
              )}
            </button>
            <button className="icon-btn hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="打开菜单" aria-expanded={menuOpen}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
            </button>
          </div>
        </div>
        {searchOpen && (
          <div style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--bg)' }}>
            <form className="container search-box" onSubmit={submit} style={{ marginTop: 0, padding: '14px 0' }}>
              <SearchIcon />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索文章、思想家、书籍、专题…" aria-label="全站搜索" />
              <button type="submit" className="text-link">搜索</button>
            </form>
          </div>
        )}
      </header>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-en">PhiloLife</div>
            <div className="brand-cn">哲学与人生</div>
            <p>在思想的深处，寻找生命的答案。以哲学理解人生，以理性认识世界，以智慧面对生命。这里不是名言摘录站，而是一座可以长期居住的思想图书馆。</p>
          </div>
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <Link to="/western-philosophy/">西方哲学</Link>
            <Link to="/eastern-philosophy/">东方哲学</Link>
            <Link to="/life-philosophy/">人生哲学</Link>
            <Link to="/self-and-consciousness/">自我与意识</Link>
            <Link to="/mind-and-spirit/">心灵与精神</Link>
          </div>
          <div className="footer-col">
            <h4>ARCHIVE</h4>
            <Link to="/thinkers/">思想家档案</Link>
            <Link to="/books/">哲学经典</Link>
            <Link to="/articles/">全部文章</Link>
            <Link to="/topics/">思想专题</Link>
            <Link to="/search/">全站搜索</Link>
          </div>
          <div className="footer-col">
            <h4>PHILOSOPHY</h4>
            <p style={{ fontSize: 13, lineHeight: 2, color: 'rgba(245,242,235,.6)' }}>哲学不是一种职业，而是一种对自身与生活负责的活动。我们致力于把复杂的思想讲清楚，把深刻的论证留给读者自己判断。</p>
            <a href="https://github.com/yuxinrun/philolife" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
              GitHub 仓库 <ArrowIcon />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PhiloLife · 哲学与人生</span>
          <span>Philosophy, Wisdom &amp; The Art of Living</span>
          <span>联系：hello@philolife.site</span>
        </div>
      </div>
    </footer>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button className={`back-to-top ${visible ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="返回顶部">
      <ArrowIcon />
    </button>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <BackToTop />
    </>
  )
}
