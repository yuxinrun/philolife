import { useState } from 'react'
import { Link } from 'react-router-dom'
import { articles, books, dailyQuestions, knowledgeMap, lifePropositions, thinkers, topics } from '../content'
import { ArticleCard, BookCard, SectionHead, ThinkerCard } from '../components/Cards'
import { ArrowIcon, KnowledgeMap, LaurelDivider, TwelvePropositions } from '../components/Svgs'
import { useMeta } from '../hooks/useMeta'

export function Home() {
  useMeta({
    title: 'PhiloLife 哲学与人生 — Philosophy, Wisdom & The Art of Living',
    description: '在思想的深处，寻找生命的答案。从古典哲学到现代思想，从自我认知到生命意义，以哲学理解人生，以理性认识世界，以智慧面对生命。',
  })
  const [dayIndex, setDayIndex] = useState(() => new Date().getDate() % dailyQuestions.length)
  const featured = articles.slice(0, 6)
  const selfArticles = articles.filter((a) => ['自我与意识', '心灵与精神'].includes(a.category)).slice(0, 4)
  const featuredThinkers = ['socrates', 'plato', 'confucius', 'nietzsche', 'zhuangzi', 'kant'].map((id) => thinkers.find((t) => t.id === id)).filter(Boolean).slice(0, 6)

  return (
    <>
      <section className="hero">
        <div className="hero-image">
          <img src="./images/hero/school-of-athens.webp" alt="拉斐尔《雅典学院》——古希腊哲学家们在拱廊中相聚" fetchPriority="high" />
        </div>
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="eyebrow">PHILOSOPHY · WISDOM · THE ART OF LIVING</div>
            <h1><span>在思想的深处，</span><span>寻找生命的答案。</span></h1>
            <p className="hero-sub">从古典哲学到现代思想，从自我认知到生命意义，在伟大思想家的智慧中重新理解自己、世界与人生。</p>
            <div className="hero-actions">
              <Link to="/articles/" className="btn btn-primary">探索哲学 <ArrowIcon /></Link>
              <Link to="/topics/" className="btn btn-ghost">开始阅读</Link>
            </div>
            <div className="hero-meta">
              <div><strong>{articles.length}</strong><span>深度文章</span></div>
              <div><strong>{thinkers.length}</strong><span>思想家档案</span></div>
              <div><strong>{books.length}</strong><span>哲学经典</span></div>
              <div><strong>{topics.length}</strong><span>思想专题</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="daily-card">
            <div className="eyebrow">DAILY PHILOSOPHICAL QUESTION · 每日哲思</div>
            <h2 className="daily-question">{dailyQuestions[dayIndex].question}</h2>
            <p className="daily-guide">{dailyQuestions[dayIndex].guide}</p>
            <div className="daily-controls">
              <button onClick={() => setDayIndex((i) => (i - 1 + dailyQuestions.length) % dailyQuestions.length)}>上一个问题</button>
              <span className="daily-count">{String(dayIndex + 1).padStart(2, '0')} / {String(dailyQuestions.length).padStart(2, '0')}</span>
              <button onClick={() => setDayIndex((i) => (i + 1) % dailyQuestions.length)}>下一个问题</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow="EDITOR'S SELECTION" title="编辑精选" description="经过认真编辑与校验的深度文章，拒绝口号与廉价的安慰。" linkTo="/articles/" />
          <div className="grid grid-3">
            {featured.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-deep)' }}>
        <div className="container">
          <SectionHead eyebrow="THE MAP OF THOUGHT" title="哲学思想地图" description="从三个方向进入哲学：西方的问题、东方的智慧，以及每个人都要面对的生命本身。" />
          <div className="map-panel"><KnowledgeMap /></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="TWELVE PROPOSITIONS" title="人生的十二个命题" description="这些不是需要回答的选择题，而是会反复出现在生命中的追问。" linkTo="/topics/" linkText="进入专题" />
          <div className="proposition-list">
            {lifePropositions.map((p) => (
              <div className="proposition" key={p.roman}>
                <div className="roman">{p.roman}</div>
                <h4>{p.name}</h4>
                <span>{p.note}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
            <TwelvePropositions className="twelve-svg" />
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-deep)' }}>
        <div className="container">
          <SectionHead eyebrow="THINKERS' ARCHIVE" title="思想家档案" description="三十余位塑造了人类思想的人物，以及他们真正说过的话与真正引发的争论。" linkTo="/thinkers/" />
          <div className="grid grid-3">
            {featuredThinkers.map((t) => t && <ThinkerCard key={t.id} thinker={t} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="LIFE & SELF" title="人生与自我" description="哲学最本分的工作，是帮助人看清自己正在过的生活。" linkTo="/self-and-consciousness/" />
          <div className="grid grid-4">
            {selfArticles.map((a) => <ArticleCard key={a.slug} article={a} compact />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-deep)' }}>
        <div className="container">
          <SectionHead eyebrow="THE CLASSICS" title="经典书籍典藏" description="不是「必读书单」，而是一条可以反复往返的思想路径。" linkTo="/books/" />
          <div className="grid grid-2">
            {books.slice(0, 4).map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="IN-DEPTH TOPICS" title="深度专题" description="围绕重大命题组织的系列阅读：导读、文章、思想家、经典与留给你的问题。" linkTo="/topics/" />
          <div className="topic-feature">
            <div className="topic-feature-image"><img src={topics[0].image} alt={topics[0].imageAlt} loading="lazy" /></div>
            <div className="topic-feature-body">
              <div className="eyebrow">{topics[0].englishTitle}</div>
              <h3>{topics[0].title}</h3>
              <p>{topics[0].intro}</p>
              <ul>{topics[0].questions.slice(0, 3).map((q) => <li key={q.question}>{q.question}</li>)}</ul>
              <Link to={`/topics/${topics[0].id}/`} className="text-link">进入专题 <ArrowIcon /></Link>
            </div>
          </div>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            {topics.slice(1, 4).map((t) => (
              <Link key={t.id} to={`/topics/${t.id}/`} className="card">
                <div className="card-image"><img src={t.image} alt={t.imageAlt} loading="lazy" /></div>
                <div className="card-body">
                  <div className="card-tag">{t.englishTitle}</div>
                  <h3>{t.title}</h3>
                  <p>{t.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="reading-route">
            <div className="eyebrow">THIS WEEK'S READING</div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', marginTop: 14 }}>本周阅读路线：从怀疑到重建</h2>
            <div className="route-steps">
              <div className="route-step">
                <div className="num">I · 起点</div>
                <h4>承认无知</h4>
                <p>从苏格拉底的诘问开始，学会区分「我以为我知道」与「我确实知道」。</p>
                <Link to="/articles/socrates-examined-life/" className="text-link">阅读文章 <ArrowIcon /></Link>
              </div>
              <div className="route-step">
                <div className="num">II · 转向</div>
                <h4>审视自我</h4>
                <p>跟随笛卡尔的普遍怀疑，看看在拆掉一切之后，还有什么能够站得住。</p>
                <Link to="/articles/descartes-methodic-doubt/" className="text-link">阅读文章 <ArrowIcon /></Link>
              </div>
              <div className="route-step">
                <div className="num">III · 落脚</div>
                <h4>承担责任</h4>
                <p>以萨特的自由观收束：自由的代价，是必须亲自为选择负责。</p>
                <Link to="/articles/sartre-freedom-responsibility/" className="text-link">阅读文章 <ArrowIcon /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ paddingBottom: 40, textAlign: 'center', color: 'var(--muted)' }}>
        <LaurelDivider style={{ width: 240, margin: '0 auto' }} />
      </div>
    </>
  )
}
