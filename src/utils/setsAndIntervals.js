export const parseFiniteSet = (value) => {
  if (typeof value !== 'string') return null
  const text = value.trim().replace(/[−–—]/g, '-')
  if (['∅', '{}', '{ }'].includes(text)) return []
  const body = text.replace(/^\{/, '').replace(/\}$/, '').trim()
  if (!body) return null
  const parts = body.split(/[;,]/).map((part) => part.trim())
  if (parts.some((part) => !/^[+-]?\d+(?:\.\d+)?$/.test(part))) return null
  return [...new Set(parts.map(Number))].sort((a, b) => a - b)
}

export const containsPoint = (segment, x) => Number.isFinite(x)
  && (x > segment.start || (x === segment.start && segment.leftClosed))
  && (x < segment.end || (x === segment.end && segment.rightClosed))

const nonempty = (segment) => segment.start < segment.end
  || (Number.isFinite(segment.start) && segment.start === segment.end && segment.leftClosed && segment.rightClosed)

export const normalizeIntervals = (segments) => {
  const sorted = segments.filter(nonempty).map((segment) => ({ ...segment }))
    .sort((a, b) => a.start - b.start || Number(b.leftClosed) - Number(a.leftClosed))
  const result = []
  for (const segment of sorted) {
    const last = result[result.length - 1]
    const touches = last && segment.start === last.end && (last.rightClosed || segment.leftClosed)
    if (!last || (segment.start >= last.end && !touches)) {
      result.push(segment)
      continue
    }
    if (segment.start === last.start) last.leftClosed ||= segment.leftClosed
    if (segment.end > last.end) {
      last.end = segment.end
      last.rightClosed = segment.rightClosed
    } else if (segment.end === last.end) last.rightClosed ||= segment.rightClosed
  }
  return result
}

export const intersectIntervals = (left, right) => normalizeIntervals(left.flatMap((a) => right.map((b) => {
  const start = Math.max(a.start, b.start)
  const end = Math.min(a.end, b.end)
  return { start, end, leftClosed: containsPoint(a, start) && containsPoint(b, start), rightClosed: containsPoint(a, end) && containsPoint(b, end) }
})))

export const subtractIntervals = (left, right) => right.reduce((remaining, removed) => remaining.flatMap((segment) => {
  const [overlap] = intersectIntervals([segment], [removed])
  if (!overlap) return [segment]
  return [
    { start: segment.start, end: overlap.start, leftClosed: segment.leftClosed, rightClosed: !overlap.leftClosed && containsPoint(segment, overlap.start) },
    { start: overlap.end, end: segment.end, leftClosed: !overlap.rightClosed && containsPoint(segment, overlap.end), rightClosed: segment.rightClosed },
  ].filter(nonempty)
}), normalizeIntervals(left))

const endpoint = (text) => {
  if (text === '-∞') return -Infinity
  if (text === '∞' || text === '+∞') return Infinity
  return /^[+-]?\d+(?:[.,]\d+)?$/.test(text) ? Number(text.replace(',', '.')) : NaN
}

export const parseIntervals = (value) => {
  if (typeof value !== 'string') return null
  const text = value.replace(/\s/g, '').replace(/[−–—]/g, '-')
  if (text === '∅' || text === '{}') return []
  const singleton = text.match(/^\{([+-]?\d+(?:[.,]\d+)?)\}$/)
  if (singleton) {
    const point = endpoint(singleton[1])
    return [{ start: point, end: point, leftClosed: true, rightClosed: true }]
  }
  const segments = []
  for (const part of text.split('∪')) {
    const match = part.match(/^(\[|\()([^;]+);([^;]+)(\]|\))$/)
    if (!match) return null
    const start = endpoint(match[2])
    const end = endpoint(match[3])
    const leftClosed = match[1] === '['
    const rightClosed = match[4] === ']'
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start === Infinity || end === -Infinity) return null
    if ((!Number.isFinite(start) && leftClosed) || (!Number.isFinite(end) && rightClosed)) return null
    segments.push({ start, end, leftClosed, rightClosed })
  }
  return normalizeIntervals(segments)
}

export const sameIntervals = (left, right) => {
  if (!left || !right) return false
  const a = normalizeIntervals(left)
  const b = normalizeIntervals(right)
  return a.length === b.length && a.every((segment, index) => segment.start === b[index].start && segment.end === b[index].end && segment.leftClosed === b[index].leftClosed && segment.rightClosed === b[index].rightClosed)
}
