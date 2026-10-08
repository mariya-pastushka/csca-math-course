import assert from 'node:assert/strict'
import katex from 'katex'
import { topic2 } from '../src/data/week2/topic2/index.js'
import { isCorrectAnswer } from '../src/utils/answers.js'
import { parseFiniteSet, parseIntervals } from '../src/utils/setsAndIntervals.js'

const sorted = (items) => [...new Set(items)].sort((a,b) => a-b)
const inIntervals = (x, segments) => segments.some(({ start,end,leftClosed,rightClosed }) => (x > start || x === start && leftClosed) && (x < end || x === end && rightClosed))
const samples = (audit) => {
  const borders = [...(audit.left || []), ...(audit.right || []), ...(audit.expected || [])].filter((item) => item && typeof item === 'object').flatMap((item) => [item.start,item.end]).filter(Number.isFinite)
  const points = [-1e6,1e6,...borders,...borders.flatMap((x) => [x-0.01,x+0.01])]
  for (let x = -20; x <= 20; x += 0.25) points.push(x)
  return points
}

let audits = 0
for (const item of [...topic2.examples,...topic2.practiceQuestions,...topic2.miniTestQuestions]) {
  const label = item.id || 'example-' + item.number
  if (item.options && item.type !== 'multi-choice') assert.equal(item.options.filter((option) => isCorrectAnswer(option,item.answer,item.answerKind)).length,1,label + ': one correct option')
  if (item.type === 'multi-choice') assert.ok(item.answer.every((answer) => item.options.includes(answer)),label + ': valid selections')
  const audit = item.audit
  if (!audit) continue
  let calculated
  if (audit.operation === 'member') calculated = audit.left.includes(audit.value)
  if (audit.operation === 'cardinality') calculated = new Set(audit.left).size
  if (audit.operation === 'subset') calculated = audit.left.every((value) => audit.right.includes(value))
  if (audit.operation === 'union') calculated = sorted([...audit.left,...audit.right])
  if (audit.operation === 'intersection') calculated = sorted(audit.left.filter((value) => audit.right.includes(value)))
  if (audit.operation === 'difference') calculated = sorted(audit.left.filter((value) => !audit.right.includes(value)))
  if (audit.operation === 'filter-members') calculated = sorted(audit.candidates.filter((value) => audit.left.includes(value)))
  if (audit.operation === 'integer-range') {
    calculated = []
    for (let x = Math.ceil(audit.start); x <= Math.floor(audit.end); x++) if ((x > audit.start || audit.leftClosed) && (x < audit.end || audit.rightClosed)) calculated.push(x)
  }
  if (audit.operation === 'integer-filter') calculated = sorted(audit.left.filter((value) => inIntervals(value,audit.right)))
  if (audit.operation === 'interval-members') calculated = sorted(audit.candidates.filter((value) => inIntervals(value,audit.left)))
  if (calculated !== undefined) assert.deepEqual(calculated,Array.isArray(audit.expected) ? sorted(audit.expected) : audit.expected,label + ': answer')
  if (audit.operation.startsWith('interval-') && audit.operation !== 'interval-members') {
    for (const x of samples(audit)) {
      const a = inIntervals(x,audit.left)
      const b = inIntervals(x,audit.right || [])
      const desired = audit.operation === 'interval-union' ? a || b : audit.operation === 'interval-intersection' ? a && b : audit.operation === 'interval-difference' ? a && !b : a
      assert.equal(inIntervals(x,audit.expected),desired,label + ': boundary ' + x)
    }
    const displayed = audit.answerText || (item.answerKind === 'interval' ? item.answer : null)
    if (displayed) {
      const parsed = parseIntervals(displayed)
      assert.ok(parsed,label + ': parse answer')
      for (const x of samples(audit)) assert.equal(inIntervals(x,parsed),inIntervals(x,audit.expected),label + ': displayed interval')
    }
  }
  if (item.answerKind === 'set') assert.deepEqual(parseFiniteSet(item.answer),sorted(audit.expected),label + ': displayed set')
  if (audit.operation === 'cardinality' && item.id) assert.equal(Number(item.answer),audit.expected,label + ': displayed cardinality')
  audits++
}

// Independent checks for the conditions and pictures used in the worked examples.
for (let x = -10; x <= 10; x += 0.25) {
  assert.equal(inIntervals(x,topic2.examples[6].audit.expected),x <= -3)
  assert.equal(inIntervals(x,topic2.examples[7].audit.expected),x > -4 && x <= 6)
}
for (const item of [...topic2.examples,...topic2.practiceQuestions]) if (item.visual) {
  for (const x of samples(item.audit)) assert.equal(inIntervals(x,item.visual.segments),inIntervals(x,item.audit.expected),(item.id || item.number) + ': number line')
}

assert.ok(isCorrectAnswer('{7, 1, 7}','{1;7}','set'))
assert.ok(!isCorrectAnswer('{1;5}','{1;7}','set'))
assert.ok(isCorrectAnswer(' [ −6 ; +∞ ) ','[-6;+∞)','interval'))
assert.ok(!isCorrectAnswer('(-6;+∞)','[-6;+∞)','interval'))
assert.ok(!isCorrectAnswer('[-6;+∞]','[-6;+∞)','interval'))
assert.ok(isCorrectAnswer('[2;8]∪[-1;4)','[-1;8]','interval'))
assert.ok(!isCorrectAnswer('[-1;2)∪(2;8]','[-1;8]','interval'))
assert.ok(isCorrectAnswer(['0∈I','4∈I'],['4∈I','0∈I'],'multi'))
assert.ok(!isCorrectAnswer(['0∈I','4∈I','5∈I'],['4∈I','0∈I'],'multi'))
assert.equal(topic2.examples.length,12)
assert.equal(topic2.practiceQuestions.length,19)
assert.equal(topic2.miniTestQuestions.length,8)
assert.ok(!('homeworkQuestions' in topic2))

let formulas = 0
const visit = (value,key='') => {
  if (Array.isArray(value)) return value.forEach((item) => visit(item,key))
  if (value && typeof value === 'object') return Object.entries(value).forEach(([k,item]) => visit(item,k))
  if (typeof value === 'string' && ['formula','problem','answer'].includes(key) && value) {
    assert.ok(!/(?<!\\)(?:Rightarrow|Longrightarrow|Longleftrightarrow)/.test(value),'unescaped command: ' + value)
    katex.renderToString(value,{throwOnError:true,strict:false})
    formulas++
  }
}
visit(topic2)
console.log('Topic 2: '+audits+' answers audited; '+formulas+' formulas parsed; boundary and answer-input checks passed.')
