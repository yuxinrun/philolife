export interface Article {
  slug: string
  title: string
  englishTitle: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  date: string
  readTime: number
  cover: string
  coverAlt: string
  thinkers: string[]
  books: string[]
  topics: string[]
  body: string
}

export interface Thinker {
  id: string
  name: string
  englishName: string
  years: string
  era: string
  school: string
  tradition: 'western' | 'eastern'
  image: string
  imageAlt: string
  intro: string
  biography: string
  coreIdeas: string[]
  works: string[]
  concepts: { term: string; explanation: string }[]
  influence: string
  related: string[]
  articleSlugs: string[]
}

export interface Book {
  id: string
  title: string
  originalTitle: string
  author: string
  year: string
  field: string
  school: string
  tradition: 'western' | 'eastern'
  cover: string
  coverAlt: string
  intro: string
  background: string
  content: string
  coreIdeas: string[]
  keyConcepts: string[]
  chapters: string[]
  value: string
  criticism: string
  audience: string
  readingOrder: string
  related: string[]
  articleSlugs: string[]
}

export interface Topic {
  id: string
  title: string
  englishTitle: string
  subtitle: string
  image: string
  imageAlt: string
  intro: string
  questions: { question: string; guide: string }[]
  articleSlugs: string[]
  thinkers: string[]
  books: string[]
  furtherThinking: string[]
}

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}
