import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Articles, CategoryPage } from './pages/Articles'
import { Thinkers, ThinkerDetail } from './pages/Thinkers'
import { Books, BookDetail } from './pages/Books'
import { Topics, TopicDetail } from './pages/Topics'
import { ArticleDetail } from './pages/ArticleDetail'
import { Search } from './pages/Search'
import { About, NotFound } from './pages/About'

const categoryPaths = [
  '/western-philosophy/', '/eastern-philosophy/', '/life-philosophy/',
  '/self-and-consciousness/', '/relationships/', '/mind-and-spirit/', '/wisdom/',
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {categoryPaths.map((p) => <Route key={p} path={p} element={<CategoryPage />} />)}
          <Route path="/articles/" element={<Articles />} />
          <Route path="/articles/:slug/" element={<ArticleDetail />} />
          <Route path="/thinkers/" element={<Thinkers />} />
          <Route path="/thinkers/:thinkerId/" element={<ThinkerDetail />} />
          <Route path="/books/" element={<Books />} />
          <Route path="/books/:bookId/" element={<BookDetail />} />
          <Route path="/topics/" element={<Topics />} />
          <Route path="/topics/:topicId/" element={<TopicDetail />} />
          <Route path="/search/" element={<Search />} />
          <Route path="/about/" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
