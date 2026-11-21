import type { CSSProperties } from 'react'

type SvgProps = { className?: string; title?: string; style?: CSSProperties }

export function BrandMark({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1" opacity=".45" />
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth=".6" opacity=".3" />
      <path d="M14 34V15h9.5c5.2 0 8.2 2.6 8.2 6.9 0 3-1.5 5.1-4.2 6.2L33.5 34h-6.6l-5.3-7.6h-2V34z" fill="currentColor" />
      <path d="M20.4 20.2v4.5h3.5c1.8 0 2.8-.9 2.8-2.3s-1-2.2-2.8-2.2z" fill="var(--brand-mark-cut, #F5F2EB)" />
      <path d="M37 14v20" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
      <path d="M34.6 14h4.8M34.6 34h4.8" stroke="currentColor" strokeWidth="1" opacity=".6" />
    </svg>
  )
}

export function LaurelDivider({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 240 24" fill="none" aria-hidden="true">
      <path d="M0 12h100M140 12h100" stroke="currentColor" strokeWidth=".7" opacity=".45" />
      <path d="M120 3c-7 2-12 6-14 9 2 3 7 7 14 9 7-2 12-6 14-9-2-3-7-7-14-9z" stroke="currentColor" strokeWidth=".8" />
      <circle cx="120" cy="12" r="2.4" fill="currentColor" />
    </svg>
  )
}

export function KnowledgeMap({ className = '' }: SvgProps) {
  const western = ['前苏格拉底', '古希腊', '中世纪', '近代', '德国古典', '现代']
  const eastern = ['儒家', '道家', '墨家', '佛学禅宗', '宋明理学', '印度哲学']
  const life = ['意义', '幸福', '自由', '自我', '意识', '有限性']
  const group = (items: string[], x: number, y: number, w: number, h: number, color: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill="none" stroke={color} strokeWidth="1" opacity=".55" />
      <path d={`M${x} ${y + 30}h${w}`} stroke={color} strokeWidth=".6" opacity=".45" />
      {items.map((t, i) => (
        <g key={t}>
          <circle cx={x + 13} cy={y + 48 + i * ((h - 58) / items.length)} r="2" fill={color} />
          <text x={x + 23} y={y + 52 + i * ((h - 58) / items.length)} fontSize="11" fill="currentColor" opacity=".8">{t}</text>
        </g>
      ))}
    </g>
  )
  return (
    <svg className={className} viewBox="0 0 960 430" role="img" aria-label="哲学思想地图：西方哲学、东方哲学与人生自我三大体系">
      <path d="M480 30v40M180 150h600M480 70v80" stroke="currentColor" strokeWidth="1" opacity=".3" />
      <rect x="380" y="18" width="200" height="44" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="480" y="46" textAnchor="middle" fontSize="17" letterSpacing="3" fill="currentColor">PHILOSOPHY</text>
      {group(western, 40, 150, 270, 250, '#52665B')}
      {group(eastern, 345, 150, 270, 250, '#A17A50')}
      {group(life, 650, 150, 270, 250, '#6B7C8C')}
      <text x="175" y="136" textAnchor="middle" fontSize="13" letterSpacing="2" fill="#52665B">西方哲学</text>
      <text x="480" y="136" textAnchor="middle" fontSize="13" letterSpacing="2" fill="#A17A50">东方哲学</text>
      <text x="785" y="136" textAnchor="middle" fontSize="13" letterSpacing="2" fill="#6B7C8C">人生与自我</text>
      <path d="M480 400h0M40 418h880" stroke="currentColor" strokeWidth=".5" opacity=".25" />
      <text x="480" y="416" textAnchor="middle" fontSize="10" letterSpacing="4" fill="currentColor" opacity=".5">THE MAP OF THOUGHT</text>
    </svg>
  )
}

export function TwelvePropositions({ className = '' }: SvgProps) {
  const items = ['意义', '自由', '幸福', '孤独', '死亡', '时间', '命运', '爱', '责任', '道德', '欲望', '自我']
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  return (
    <svg className={className} viewBox="0 0 900 620" role="img" aria-label="人生的十二个命题图">
      <circle cx="450" cy="310" r="118" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".4" />
      <circle cx="450" cy="310" r="82" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".25" />
      <text x="450" y="300" textAnchor="middle" fontSize="22" letterSpacing="6" fill="currentColor">人生</text>
      <text x="450" y="332" textAnchor="middle" fontSize="22" letterSpacing="6" fill="currentColor">十二命题</text>
      {items.map((label, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
        const x = 450 + Math.cos(angle) * 240
        const y = 310 + Math.sin(angle) * 250
        return (
          <g key={label}>
            <path d={`M${450 + Math.cos(angle) * 122} ${310 + Math.sin(angle) * 124}L${x - Math.cos(angle) * 34} ${y - Math.sin(angle) * 30}`} stroke="currentColor" strokeWidth=".6" opacity=".3" />
            <circle cx={x} cy={y} r="26" fill="none" stroke="currentColor" strokeWidth=".8" />
            <text x={x} y={y - 2} textAnchor="middle" fontSize="14" fill="currentColor">{label}</text>
            <text x={x} y={y + 13} textAnchor="middle" fontSize="7" fill="currentColor" opacity=".55">{roman[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}

export function TimelineSvg({ className = '' }: SvgProps) {
  const events = [
    ['前6—前4世纪', '古希腊与先秦诸子'], ['前1—5世纪', '佛教兴起与传入'], ['3—13世纪', '经院哲学与宋明理学'],
    ['17—18世纪', '理性主义与启蒙'], ['19世纪', '德国古典与存在先声'], ['20世纪', '现象学、存在主义与分析哲学'],
  ]
  return (
    <svg className={className} viewBox="0 0 1000 190" role="img" aria-label="哲学发展时间轴">
      <path d="M40 95h920" stroke="currentColor" strokeWidth="1" opacity=".4" />
      {events.map(([year, label], i) => {
        const x = 70 + i * 172
        return (
          <g key={year}>
            <circle cx={x} cy="95" r="5" fill={i % 2 ? '#A17A50' : '#52665B'} />
            <text x={x} y={i % 2 ? 74 : 130} textAnchor="middle" fontSize="12" fill="currentColor">{year}</text>
            <text x={x} y={i % 2 ? 56 : 150} textAnchor="middle" fontSize="10" fill="currentColor" opacity=".7">{label}</text>
          </g>
        )
      })}
    </svg>
  )
}

export function BookIllustration({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 160 200" role="img" aria-label="古典书籍插画">
      <path d="M20 24c22-8 44-8 60 2 16-10 38-10 60-2v148c-22-8-44-8-60 2-16-10-38-10-60-2z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M80 26v148" stroke="currentColor" strokeWidth="1" opacity=".5" />
      <path d="M34 52c14-4 28-4 38 1M34 70c14-4 28-4 38 1M34 88c14-4 28-4 38 1M88 52c14-4 28-4 38 1M88 70c14-4 28-4 38 1M88 88c14-4 28-4 38 1" stroke="currentColor" strokeWidth=".6" opacity=".4" />
      <circle cx="80" cy="128" r="13" fill="none" stroke="currentColor" strokeWidth=".8" />
      <path d="M80 115v26M67 128h26" stroke="currentColor" strokeWidth=".5" opacity=".6" />
    </svg>
  )
}

export function ConceptDiagram({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 480 250" role="img" aria-label="概念关系图：思想、语言与生命">
      <circle cx="140" cy="125" r="62" fill="none" stroke="#52665B" strokeWidth="1" />
      <circle cx="340" cy="125" r="62" fill="none" stroke="#A17A50" strokeWidth="1" />
      <circle cx="240" cy="45" r="42" fill="none" stroke="#6B7C8C" strokeWidth="1" />
      <text x="140" y="131" textAnchor="middle" fontSize="16" fill="currentColor">思想</text>
      <text x="340" y="131" textAnchor="middle" fontSize="16" fill="currentColor">生命</text>
      <text x="240" y="50" textAnchor="middle" fontSize="14" fill="currentColor">语言</text>
      <path d="M196 100l88 0M200 152l86 0M264 80l-18 22M216 80l18 22" stroke="currentColor" strokeWidth=".7" opacity=".4" />
    </svg>
  )
}

export function EasternWesternBranches({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 800 320" role="img" aria-label="东方与西方哲学分支图">
      <path d="M400 40v50M400 90c-140 0-250 60-290 150M400 90c140 0 250 60 290 150" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
      <rect x="330" y="16" width="140" height="34" rx="2" fill="none" stroke="currentColor" />
      <text x="400" y="38" textAnchor="middle" fontSize="13" letterSpacing="2" fill="currentColor">哲学</text>
      {['前苏格拉底', '柏拉图主义', '亚里士多德', '近代主体性', '现代哲学'].map((t, i) => (
        <text key={t} x={120 + i * 40} y={205 + i * 20} fontSize="11" fill="#52665B" transform={`rotate(-20 ${120 + i * 40} ${205 + i * 20})`}>{t}</text>
      ))}
      {['儒家', '道家', '墨家', '佛教', '禅宗'].map((t, i) => (
        <text key={t} x={560 + i * 40} y={205 + i * 20} fontSize="11" fill="#A17A50" transform={`rotate(20 ${560 + i * 40} ${205 + i * 20})`}>{t}</text>
      ))}
    </svg>
  )
}

export function ThoughtIcon({ kind, className = '' }: SvgProps & { kind: 'western' | 'eastern' | 'life' | 'self' | 'ethics' | 'mind' | 'wisdom' }) {
  const paths: Record<string, React.ReactNode> = {
    western: <><circle cx="24" cy="24" r="15" /><path d="M24 9v30M9 24h30" /></>,
    eastern: <><circle cx="24" cy="24" r="15" /><path d="M14 28c6-10 10-10 20 0M17 18h14" /></>,
    life: <><path d="M24 40c10-8 15-15 15-22a8 8 0 00-15-4 8 8 0 00-15 4c0 7 5 14 15 22z" /></>,
    self: <><circle cx="24" cy="18" r="7" /><path d="M11 40c1-8 6-12 13-12s12 4 13 12" /></>,
    ethics: <><path d="M24 8l14 6v11c0 10-6 15-14 19-8-4-14-9-14-19V14z" /></>,
    mind: <><path d="M14 34c-4-4-4-12 1-16 2-8 14-9 18-2 7 2 7 12 2 16 2 6-4 9-9 7-5 3-11 0-12-5z" /></>,
    wisdom: <><path d="M12 38h24M16 32l8-18 8 18M20 26h8" /></>,
  }
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      {paths[kind]}
    </svg>
  )
}

export function ArrowIcon({ className = '' }: SvgProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
}

export function SearchIcon({ className = '' }: SvgProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
}

export function BookmarkIcon({ className = '', filled = false }: SvgProps & { filled?: boolean }) {
  return <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
}
