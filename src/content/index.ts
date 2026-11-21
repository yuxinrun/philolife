import type { Article, Book, Thinker, Topic } from '../types'
import { parseFrontmatter } from '../utils/markdown'
import { thinkers } from './thinkers'
import { books } from './books'
import { topics } from './topics'

const modules = import.meta.glob<string>('./articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function asArray(value: string | string[] | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}
function asString(value: string | string[] | undefined, fallback = ''): string {
  return Array.isArray(value) ? value.join('，') : value ?? fallback
}
function asNumber(value: string | string[] | undefined, fallback = 8): number {
  const n = Number(asString(value, ''))
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export const articles: Article[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw)
    return {
      slug: asString(meta.slug, path.split('/').pop()!.replace('.md', '')),
      title: asString(meta.title),
      englishTitle: asString(meta.englishTitle),
      excerpt: asString(meta.excerpt),
      category: asString(meta.category, '人生哲学'),
      tags: asArray(meta.tags),
      author: asString(meta.author, 'PhiloLife 编辑部'),
      date: asString(meta.date),
      readTime: asNumber(meta.readTime),
      cover: asString(meta.cover, '/images/articles/default.webp'),
      coverAlt: asString(meta.coverAlt, asString(meta.title)),
      thinkers: asArray(meta.thinkers),
      books: asArray(meta.books),
      topics: asArray(meta.topics),
      body,
    } as Article
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export { thinkers, books, topics }

export const thinkerById = new Map(thinkers.map((t) => [t.id, t]))
export const bookById = new Map(books.map((b) => [b.id, b]))
export const topicById = new Map(topics.map((t) => [t.id, t]))
export const articleBySlug = new Map(articles.map((a) => [a.slug, a]))

export const categories = [
  { path: '/western-philosophy/', name: '西方哲学', english: 'Western Philosophy', description: '从古希腊的追问到现代性的反思，梳理西方思想的主脉。' },
  { path: '/eastern-philosophy/', name: '东方哲学', english: 'Eastern Philosophy', description: '儒、道、墨、佛与禅，在东方思想中理解生命与秩序。' },
  { path: '/life-philosophy/', name: '人生哲学', english: 'Philosophy of Life', description: '关于意义、幸福、自由、死亡与爱的根本追问。' },
  { path: '/self-and-consciousness/', name: '自我与意识', english: 'Self & Consciousness', description: '认识自己，是哲学最古老也最困难的任务。' },
  { path: '/relationships/', name: '人际关系', english: 'Relationships & Ethics', description: '在自我与他者之间，思考尊严、责任与共同生活。' },
  { path: '/mind-and-spirit/', name: '心灵与精神', english: 'Mind & Spirit', description: '面对焦虑、痛苦与不确定，寻找精神自由的道路。' },
  { path: '/wisdom/', name: '人生智慧', english: 'Practical Wisdom', description: '独立思考、判断与克制，把思想转化为生活方式。' },
]

export const knowledgeMap = [
  {
    title: '西方哲学', english: 'Western Philosophy', accent: '#52665B',
    branches: ['前苏格拉底哲学', '古希腊哲学', '中世纪哲学', '近代哲学', '德国古典哲学', '现代哲学'],
  },
  {
    title: '东方哲学', english: 'Eastern Philosophy', accent: '#A17A50',
    branches: ['儒家', '道家', '墨家', '佛学与禅宗', '宋明理学', '印度哲学'],
  },
  {
    title: '人生与自我', english: 'Life & Self', accent: '#6B7C8C',
    branches: ['生命意义', '幸福', '自由意志', '自我认知', '意识', '死亡与有限性'],
  },
]

export const lifePropositions = [
  { roman: 'I', name: '人生意义', note: '我们为何而活' },
  { roman: 'II', name: '自由意志', note: '选择是否真实' },
  { roman: 'III', name: '幸福', note: '状态还是能力' },
  { roman: 'IV', name: '孤独', note: '自我的边界' },
  { roman: 'V', name: '死亡', note: '有限性的重量' },
  { roman: 'VI', name: '时间', note: '流逝与当下' },
  { roman: 'VII', name: '命运', note: '必然与偶然' },
  { roman: 'VIII', name: '爱', note: '给予还是占有' },
  { roman: 'IX', name: '责任', note: '自由的代价' },
  { roman: 'X', name: '道德', note: '如何共同生活' },
  { roman: 'XI', name: '欲望', note: '满足的悖论' },
  { roman: 'XII', name: '自我', note: '认识你自己' },
]

export const dailyQuestions = [
  { question: '人为什么需要意义？', guide: '如果生命没有预设的目的，追问意义本身是否就是一种意义？试着区分「被发现的意义」与「被创造的意义」。' },
  { question: '自由意味着什么？', guide: '自由不只是「想做什么就做什么」。思考：当选择增多时，你是否真的更自由，还是更难以承担选择的后果？' },
  { question: '幸福是一种状态还是一种能力？', guide: '亚里士多德把幸福看作合乎德性的实践活动。想一想：幸福能否在被动的享受中获得，还是必须在持续的行动中展开？' },
  { question: '人能否真正认识自己？', guide: '苏格拉底说「认识你自己」。但我们的自我认知有多少来自他人的目光、记忆的选择性叙述与社会角色？' },
  { question: '我们为什么害怕死亡？', guide: '伊壁鸠鲁认为死亡与我们无关；海德格尔却说唯有面向死亡，存在才成为真实的。这两种看法的分歧在哪里？' },
  { question: '孤独是一种缺陷吗？', guide: '区分「孤立」（被迫隔绝）与「独处」（主动选择）。安静地与自己相处，是否反而是精神独立的条件？' },
  { question: '痛苦是否能够赋予生命意义？', guide: '不要急于赞美痛苦。思考：是痛苦本身有价值，还是我们在承受痛苦时展现出的态度有价值？' },
  { question: '为什么我们需要他人？', guide: '从亚里士多德的「政治动物」到萨特的「他人即地狱」，哲学对他人的理解充满张力。你更接近哪一种？' },
]
