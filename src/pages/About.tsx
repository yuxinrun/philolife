import { Link } from 'react-router-dom'
import { articles, books, thinkers, topics } from '../content'
import { PageHero } from '../components/Cards'
import { LaurelDivider, TimelineSvg } from '../components/Svgs'
import { useMeta } from '../hooks/useMeta'

export function About() {
  useMeta({ title: '关于我们', description: 'PhiloLife 的编辑理念、内容标准、技术架构与图片版权说明。' })
  return (
    <>
      <PageHero eyebrow="ABOUT PHILOLIFE" title="关于我们" description="在思想的深处，寻找生命的答案。" />
      <div className="container" style={{ paddingBottom: 100 }}>
        <div className="breadcrumb"><Link to="/">首页</Link><span>/</span>关于我们</div>
        <div className="detail-content" style={{ paddingTop: 40 }}>
          <div>
            <section className="detail-block">
              <h2>I. 我们是谁</h2>
              <p>PhiloLife（哲学与人生）是一个中文哲学与人生智慧平台。它试图同时成为四件事：一座哲学数字图书馆、一个人生思想研究所、一份深度阅读杂志，以及一部不断生长的思想家百科。</p>
              <p>我们相信，哲学不是学院里的术语游戏，也不是用来装点谈吐的名言。哲学是一种活动——对自身信念负责、对习以为常的世界保持追问、在有限的生命中认真选择。</p>
            </section>
            <section className="detail-block">
              <h2>II. 内容标准</h2>
              <p>本站的文章以论证为核心。每篇文章都试图交代问题的来龙去脉、关键概念的准确含义、思想家的论证逻辑、不同立场之间的分歧、以及这一思想在当下生活中的意义与局限。</p>
              <ul style={{ paddingLeft: '1.4em' }}>
                <li style={{ lineHeight: 2.1 }}>不编造哲学家言论，不伪造原著出处；对存在争议的解释标明不同学术观点。</li>
                <li style={{ lineHeight: 2.1 }}>区分哲学论证、心理学研究和个人建议，不把复杂问题简化为心灵鸡汤。</li>
                <li style={{ lineHeight: 2.1 }}>不回避思想的局限与批判，尊重读者独立判断的能力。</li>
                <li style={{ lineHeight: 2.1 }}>图片均来自具有明确公有领域或 CC0 授权的馆藏资源，逐张记录来源。</li>
              </ul>
            </section>
            <section className="detail-block">
              <h2>III. 站点现状</h2>
              <div className="fact-grid" style={{ marginTop: 8 }}>
                <div className="fact"><span>深度文章</span><strong>{articles.length} 篇</strong></div>
                <div className="fact"><span>思想家档案</span><strong>{thinkers.length} 位</strong></div>
                <div className="fact"><span>经典典藏</span><strong>{books.length} 部</strong></div>
                <div className="fact"><span>思想专题</span><strong>{topics.length} 个</strong></div>
                <div className="fact"><span>技术架构</span><strong>静态站点</strong></div>
                <div className="fact"><span>内容格式</span><strong>Markdown</strong></div>
              </div>
            </section>
            <section className="detail-block">
              <h2>IV. 思想脉络</h2>
              <TimelineSvg style={{ width: '100%' }} />
            </section>
            <section className="detail-block">
              <h2>V. 技术与开源</h2>
              <p>本站采用 Vite、React、TypeScript 与原生 CSS 构建，不依赖后端、数据库或大型 UI 框架。所有内容以本地 Markdown 与 TypeScript 数据文件管理，通过 GitHub Actions 自动构建并部署到 GitHub Pages。</p>
              <p>项目完全开源，欢迎提出 Issue、修正事实错误、补充内容与改进翻译。仓库地址：<a href="https://github.com/yuxinrun/philolife" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>github.com/yuxinrun/philolife</a></p>
            </section>
            <LaurelDivider style={{ width: 240, color: 'var(--accent)' }} />
          </div>
          <aside className="detail-side">
            <div className="side-box">
              <h4>快速入口</h4>
              <Link to="/articles/">全部文章</Link>
              <Link to="/thinkers/">思想家档案</Link>
              <Link to="/books/">经典图书馆</Link>
              <Link to="/topics/">思想专题</Link>
              <Link to="/search/">全站搜索</Link>
            </div>
            <div className="side-box">
              <h4>本站理念</h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 2, margin: 0 }}>以哲学理解人生，<br />以理性认识世界，<br />以智慧面对生命。</p>
            </div>
            <div className="side-box">
              <h4>联系</h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>hello@philolife.site</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export function NotFound() {
  useMeta({ title: '页面未找到' })
  return (
    <div className="empty-state" style={{ paddingTop: 160, paddingBottom: 160 }}>
      <div className="eyebrow">404 · PAGE NOT FOUND</div>
      <h1 style={{ fontSize: 46, margin: '18px 0' }}>这里没有答案。</h1>
      <p>也许该回去，换一条路寻找。</p>
      <Link to="/" className="btn btn-outline" style={{ marginTop: 24 }}>返回首页</Link>
    </div>
  )
}
