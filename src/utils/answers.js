export const normalizeAnswer = (value) => {
  let normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\$/g, '')
    .replace(/%/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/⁄/g, '/')

  const decimalComma = /^[+-]?\d+,\d+$/.test(normalized)
    && (normalized.replace(/^[+-]/, '').startsWith('0,') || normalized.split(',')[1].length !== 3)
  normalized = decimalComma ? normalized.replace(',', '.') : normalized.replace(/,/g, '')

  return normalized
    .replace(/\b(km|kg|cm|mm|m|g|l)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export const parseMathNumber = (value) => {
  const normalized = normalizeAnswer(value)
  const mixed = normalized.match(/^([+-]?\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed && Number(mixed[3]) !== 0) {
    const whole = Number(mixed[1])
    const fraction = Number(mixed[2]) / Number(mixed[3])
    return whole < 0 ? whole - fraction : whole + fraction
  }

  const fraction = normalized.match(/^([+-]?\d+)\s*\/\s*(\d+)$/)
  if (fraction && Number(fraction[2]) !== 0) {
    return Number(fraction[1]) / Number(fraction[2])
  }

  const numeric = Number(normalized)
  return normalized !== '' && Number.isFinite(numeric) ? numeric : null
}

export function isCorrectAnswer(value, expected) {
  const actual = normalizeAnswer(value)
  const target = normalizeAnswer(expected)
  const actualNumber = parseMathNumber(actual)
  const targetNumber = parseMathNumber(target)
  if (actualNumber !== null && targetNumber !== null) {
    return Math.abs(actualNumber - targetNumber) < 1e-9
  }
  return actual === target
}
