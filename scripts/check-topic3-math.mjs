import assert from 'node:assert/strict'
import katex from 'katex'
import { topic3 } from '../src/data/week2/topic3/index.js'
import { isCorrectAnswer } from '../src/utils/answers.js'
import { parseIntervals,containsPoint } from '../src/utils/setsAndIntervals.js'
import { miniTestFeedbackKey } from '../src/utils/miniTestFeedback.js'

const compare = (left,op,right) => {
  const delta = Math.abs(left-right)<1e-10 ? 0 : left-right
  return op==='<' ? delta<0 : op==='>' ? delta>0 : op==='<=' ? delta<=0 : delta>=0
}
const satisfies = (condition,x) => condition.kind==='absolute'
  ? compare(Math.abs(condition.a*x+condition.b),condition.op,condition.c)
  : compare(condition.a*x+condition.b,condition.op,condition.d*x+condition.c)
const inSet = (x,segments) => segments.some((segment) => containsPoint(segment,x))
const originalChecks = [
  (x)=>x+8<=14,(x)=>x-7>-10,(x)=>5*x>=-15,(x)=>-4*x<16,
  (x)=>3*(x+2)<=2*x+11,(x)=>-2*(2*x-3)>14,(x)=>7-3*x>=2*x-8,
  (x)=>x>-5&&x<=1,(x)=>2*x-4>=2&&x+2<9,(x)=>x<=-2&&x>=-2,
  (x)=>Math.abs(x)<5,(x)=>Math.abs(x)>=2,(x)=>Math.abs(x-1)<4,
  (x)=>Math.abs(x+3)>1,(x)=>Math.abs(2*x-4)<=6&&x>0,
]
let audited = 0
for (const item of [...topic3.subtopics.flatMap((mini)=>mini.lectureExamples),...topic3.examples,...topic3.practiceQuestions,...topic3.miniTestQuestions]) {
  const label = item.id || item.problem
  const {conditions,answerText,combine} = item.audit
  const intervals = parseIntervals(answerText)
  assert.ok(intervals,label+': valid interval')
  const roots = conditions.flatMap((condition) => condition.kind==='absolute'
    ? [(-condition.c-condition.b)/condition.a,(condition.c-condition.b)/condition.a]
    : [(condition.c-condition.b)/(condition.a-condition.d)]).filter(Number.isFinite)
  const endpoints = intervals.flatMap((item)=>[item.start,item.end]).filter(Number.isFinite)
  const critical = [...new Set([...roots,...endpoints])]
  const points = [-1e6,1e6,...critical,...critical.flatMap((x)=>[x-0.00001,x+0.00001])]
  for (let x=-30;x<=30;x+=0.125) points.push(x)
  const desired = (x) => combine==='any' ? conditions.some((c)=>satisfies(c,x)) : conditions.every((c)=>satisfies(c,x))
  for (const x of points) assert.equal(inSet(x,intervals),desired(x),label+': boundary/condition '+x)
  if (item.number) for (const x of points) assert.equal(inSet(x,intervals),originalChecks[item.number-1](x),label+': original expression')
  if (item.answerKind==='interval') assert.ok(isCorrectAnswer(item.answer,answerText,'interval'),label+': displayed answer matches conditions')
  if (item.audit.integerMaximum !== undefined) {
    const max = Number(item.answer)
    assert.ok(desired(max) && !desired(max+1),label+': maximum whole quantity')
  }
  if (item.id==='ineq-p10') assert.ok(intervals.length===1&&intervals[0].start===Number(item.answer)&&intervals[0].end===Number(item.answer))
  if (item.options && item.type!=='multi-choice') assert.equal(item.options.filter((option)=>isCorrectAnswer(option,item.answer,item.answerKind)).length,1,label+': exactly one correct choice')
  if (item.type==='multi-choice') {
    for (const option of item.options) assert.equal(item.answer.includes(option),desired(item.audit.selections[option]),label+': candidate '+option)
  }
  const picture = item.solutionVisual || item.visual || item.optionVisuals?.[item.answer]
  if (picture) for (const x of points) assert.equal(inSet(x,picture.segments),desired(x),label+': correct graph')
  assert.ok((item.steps||item.solution).length>=3,label+': detailed solution')
  audited++
}

assert.equal(topic3.subtopics.length,3)
assert.equal(topic3.examples.length,15)
assert.equal(topic3.practiceQuestions.length,21)
assert.equal(topic3.miniTestQuestions.length,10)
assert.equal(topic3.vocabulary.length,17)
assert.ok(!('homeworkQuestions' in topic3))
for (let score=0;score<=10;score++) assert.equal(miniTestFeedbackKey(score,10,topic3.resultBands),score===10?'excellent':score>=8?'veryGood':score>=6?'good':score>=4?'review':'restart')
assert.equal(miniTestFeedbackKey(8,8),'excellent')
assert.equal(miniTestFeedbackKey(6,8),'good')
assert.equal(miniTestFeedbackKey(4,8),'review')
assert.ok(isCorrectAnswer('(-∞;-10/3)∪(2;+∞)','(2;+∞)∪(-∞;-10/3)','interval'))
assert.ok(!isCorrectAnswer('(-∞;-10/3]∪(2;+∞)','(-∞;-10/3)∪(2;+∞)','interval'))
assert.ok(!isCorrectAnswer('[-1/0;2]','[-1;2]','interval'))
const expressions = [...topic3.subtopics.flatMap((mini)=>mini.lectureExamples),...topic3.examples,...topic3.practiceQuestions,...topic3.miniTestQuestions].map((item)=>item.problem||item.formula)
assert.equal(new Set(expressions).size,expressions.length,'No repeated expressions across lecture/examples/practice/test')
let formulas=0
const visit = (value,key='') => {
  if (Array.isArray(value)) return value.forEach((item)=>visit(item,key))
  if (value && typeof value==='object') return Object.entries(value).forEach(([k,item])=>visit(item,k))
  if (typeof value==='string'&&['formula','problem','answer'].includes(key)&&value) {
    katex.renderToString(value,{throwOnError:true,strict:false})
    formulas++
  }
}
visit(topic3)
console.log(`Topic 3: ${audited} solutions checked at boundaries and sample points; ${formulas} formulas parsed. Feedback, graphs, grading and unique questions passed.`)
