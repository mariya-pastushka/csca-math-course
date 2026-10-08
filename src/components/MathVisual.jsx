import { useId, useState } from 'react'
import MathFormula from './MathFormula'

export function NumberLine({ min = -5, max = 9, segments = [], title, caption }) {
  const x = (value) => 40 + (value - min) / (max - min) * 440
  const tickStep = Math.max(1, Math.ceil((max - min) / 12))
  const ticks = []
  for (let value = min; value <= max; value += tickStep) ticks.push(value)
  const descriptions = segments.map((segment) => `${Number.isFinite(segment.start) ? 'от ' + segment.start + (segment.leftClosed ? ', закрашенная точка' : ', пустой кружок') : 'луч влево'}; ${Number.isFinite(segment.end) ? 'до ' + segment.end + (segment.rightClosed ? ', закрашенная точка' : ', пустой кружок') : 'луч вправо'}`).join('. ')
  return <figure className="sets-number-line">
    {title && <figcaption>{title}</figcaption>}
    <svg viewBox="0 0 520 112" role="img" aria-label={'Числовая прямая. ' + (descriptions || 'Отрицательные числа слева от нуля, положительные справа.')}>
      <path d="M22 52H498 M29 47L22 52L29 57 M491 47L498 52L491 57" fill="none" stroke="#a2ad99" strokeWidth="1.6" />
      {ticks.map((value) => <g key={value}><line x1={x(value)} x2={x(value)} y1="46" y2="58" stroke="#a2ad99" /><text x={x(value)} y="84" textAnchor="middle">{value === 0 ? '0' : String(value).replace('-', '−')}</text></g>)}
      {segments.map((segment, index) => {
        const left = Number.isFinite(segment.start) ? x(segment.start) : 23
        const right = Number.isFinite(segment.end) ? x(segment.end) : 497
        return <g key={index}>
          <line x1={left} x2={right} y1="52" y2="52" stroke="#718d3e" strokeWidth="5" />
          {Number.isFinite(segment.start) ? <circle cx={left} cy="52" r="6" fill={segment.leftClosed ? '#526b2e' : '#fafbf6'} stroke="#526b2e" strokeWidth="2.5" /> : <path d="M33 44L23 52L33 60" fill="none" stroke="#526b2e" strokeWidth="3" />}
          {Number.isFinite(segment.end) ? <circle cx={right} cy="52" r="6" fill={segment.rightClosed ? '#526b2e' : '#fafbf6'} stroke="#526b2e" strokeWidth="2.5" /> : <path d="M487 44L497 52L487 60" fill="none" stroke="#526b2e" strokeWidth="3" />}
          {[segment.start, segment.end].filter(Number.isFinite).filter((value) => !ticks.includes(value)).map((value) => <text key={value} x={x(value)} y="28" textAnchor="middle">{String(value).replace('-', '−')}</text>)}
        </g>
      })}
    </svg>
    {caption && <p>{caption}</p>}
  </figure>
}

function VennDiagram({ title, left, right }) {
  const id = useId().replace(/:/g, '')
  const [operation, setOperation] = useState('union')
  const common = left.filter((item) => right.includes(item))
  const leftOnly = left.filter((item) => !right.includes(item))
  const rightOnly = right.filter((item) => !left.includes(item))
  const options = [['union','∪','Всё вместе'],['intersection','∩','Только общее'],['difference','\\','A без B']]
  const result = operation === 'union' ? [...new Set([...left,...right])] : operation === 'intersection' ? common : leftOnly
  const symbol = operation === 'union' ? '\\cup' : operation === 'intersection' ? '\\cap' : '\\setminus'
  return <figure className="sets-venn">
    <figcaption>{title}</figcaption>
    <div className="sets-visual-switch">{options.map(([key, glyph, label]) => <button key={key} className={operation === key ? 'is-active' : ''} onClick={() => setOperation(key)} aria-pressed={operation === key}>{glyph} · {label}</button>)}</div>
    <svg viewBox="0 0 360 205" role="img" aria-label={options.find(([key]) => key === operation)[2] + ': выделенная область диаграммы Венна'}>
      <defs><clipPath id={id + '-right'}><circle cx="225" cy="105" r="75" /></clipPath><mask id={id + '-difference'}><circle cx="135" cy="105" r="75" fill="white" /><circle cx="225" cy="105" r="75" fill="black" /></mask></defs>
      <circle cx="135" cy="105" r="75" fill="#f3f6eb" /><circle cx="225" cy="105" r="75" fill="#f3f6eb" />
      {operation === 'union' && <g fill="#c9dba0"><circle cx="135" cy="105" r="75" /><circle cx="225" cy="105" r="75" /></g>}
      {operation === 'intersection' && <circle cx="135" cy="105" r="75" fill="#c9dba0" clipPath={'url(#' + id + '-right)'} />}
      {operation === 'difference' && <rect width="360" height="205" fill="#c9dba0" mask={'url(#' + id + '-difference)'} />}
      <circle cx="135" cy="105" r="75" stroke="#768766" strokeWidth="1.8" fill="none" /><circle cx="225" cy="105" r="75" stroke="#768766" strokeWidth="1.8" fill="none" />
      <text x="92" y="22">A</text><text x="263" y="22">B</text>
      {[leftOnly,common,rightOnly].map((items,index) => <text key={index} x={[107,180,253][index]} y="111" textAnchor="middle">{items.join(', ')}</text>)}
    </svg>
    <MathFormula>{'A' + symbol + 'B=' + (result.length ? '\\{' + result.sort((a,b) => a-b).join(',') + '\\}' : '\\varnothing')}</MathFormula>
  </figure>
}

function IntervalTable() {
  return <div className="sets-table-wrap"><table className="sets-table"><caption>Скобки, знаки и границы</caption><thead><tr><th>Запись</th><th>Что означает</th><th>Левая граница</th><th>Правая граница</th></tr></thead><tbody>
    {[['(a;b)','a<x<b','Не входит ○','Не входит ○'],['[a;b]','a≤x≤b','Входит ●','Входит ●'],['[a;b)','a≤x<b','Входит ●','Не входит ○'],['(a;b]','a<x≤b','Не входит ○','Входит ●']].map((row) => <tr key={row[0]}>{row.map((cell,i) => <td key={i}>{cell}</td>)}</tr>)}
  </tbody></table></div>
}

export function NotationTable({ rows }) {
  return <div className="sets-table-wrap"><table className="sets-table"><caption>ВАЖНЫЕ ОБОЗНАЧЕНИЯ</caption><thead><tr><th>Символ</th><th>Читаем</th><th>Пример</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell,index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
}

export default function MathVisual({ visual }) {
  if (!visual) return null
  if (visual.kind === 'numberLine') return <NumberLine {...visual} />
  if (visual.kind === 'venn') return <VennDiagram {...visual} />
  if (visual.kind === 'intervalTable') return <IntervalTable />
  return null
}
