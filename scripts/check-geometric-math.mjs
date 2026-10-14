import assert from 'node:assert/strict'
import katex from 'katex'
import { readFileSync } from 'node:fs'
import { week3, geometricProgression, allWeek3Subtopics, findWeek3Subtopic, week3ProgressKeys, getWeek3StagePaths } from '../src/data/week3/index.js'
import { isCorrectAnswer, parseMathNumber } from '../src/utils/answers.js'

const close = (a,b) => Math.abs(a-b)<1e-9
// Calculate terms and finite sums by repeated multiplication/addition,
// independently of the closed formulas used in the lessons.
const term = (b,ratio,n) => {
  assert.ok(Number.isInteger(n)&&n>=1)
  let result=b
  for(let k=1;k<n;k++) result*=ratio
  return result
}
const sum = (b,ratio,n) => {
  let current=b,total=0
  for(let k=0;k<n;k++){total+=current;current*=ratio}
  return total
}
const isGeometric = (terms) => terms.every((x)=>x!==0)&&terms.slice(1).every((x,i)=>close(x/terms[i],terms[1]/terms[0]))
const ratioOf = (terms) => {assert.ok(isGeometric(terms));return terms[1]/terms[0]}
const roots = (value,power) => {
  assert.ok(Number.isInteger(power)&&power>0)
  if(value<0&&power%2===0) return []
  const root=Math.abs(value)**(1/power)
  if(power%2===1) return [value<0?-root:root]
  return root===0?[0]:[-root,root]
}
const singleRoot = (c) => {
  assert.notEqual(c.b1,0)
  const values=roots(c.bn/c.b1,c.n-1)
  assert.equal(values.length,1,'A unique real common ratio is required')
  assert.ok(close(term(c.b1,values[0],c.n),c.bn))
  return values[0]
}
const infinite = (b,ratio) => {
  assert.ok(Math.abs(ratio)<1)
  const expected=b/(1-ratio)
  assert.ok(close(sum(b,ratio,300),expected),'Partial sums approach the infinite sum')
  return expected
}
const findIndices = (b,ratio,value) => {
  const matches=[]
  for(let n=1;n<=100;n++) if(close(term(b,ratio,n),value)) matches.push(n)
  return matches
}
const evaluate = (c) => {
  switch(c.kind){
    case 'term': return term(c.b1,c.ratio,c.n)
    case 'ratio': return ratioOf(c.terms)
    case 'mean': {assert.ok(c.left>0&&c.right>0);return Math.sqrt(c.left*c.right)}
    case 'isGeometric': return isGeometric(c.terms)?'Да':'Нет'
    case 'chooseSequence': {
      const candidates=Object.entries(c.sequences).filter(([,terms])=>isGeometric(terms))
      assert.equal(candidates.length,1)
      return candidates[0][0]
    }
    case 'nextPair': {
      const ratio=ratioOf(c.terms),last=c.terms.at(-1)
      return `${last*ratio}; ${last*ratio*ratio}`
    }
    case 'nextPairWithRatio': {
      const ratio=ratioOf(c.terms),last=c.terms.at(-1),n=c.terms.length
      return String.raw`q=${ratio},\quad b_${n+1}=${last*ratio},\quad b_${n+2}=${last*ratio*ratio}`
    }
    case 'definition': return 'Постоянное отношение следующего члена к предыдущему'
    case 'first': {
      assert.notEqual(c.ratio,0)
      let result=c.bn
      for(let k=1;k<c.n;k++) result/=c.ratio
      assert.ok(close(term(result,c.ratio,c.n),c.bn))
      return result
    }
    case 'ratioPower': return singleRoot(c)
    case 'onlyRatio': return 'Только '+Math.round(singleRoot(c))
    case 'ratioRoots': {
      const values=roots(c.bn/c.b1,c.n-1)
      assert.ok(values.every((ratio)=>close(term(c.b1,ratio,c.n),c.bn)))
      return '{'+values.map((x)=>Number(x.toFixed(10))).join(';')+'}'
    }
    case 'index': {
      const matches=findIndices(c.b1,c.ratio,c.value)
      assert.equal(matches.length,1,'The requested index must be unique and a positive integer')
      return matches[0]
    }
    case 'membership': return findIndices(c.b1,c.ratio,c.value).length?'Да':'Нет'
    case 'fromTwo': {
      const values=roots(c.br/c.bp,c.r-c.p)
      assert.equal(values.length,1)
      const ratio=values[0],b1=c.bp/term(1,ratio,c.p)
      assert.ok(close(term(b1,ratio,c.p),c.bp)&&close(term(b1,ratio,c.r),c.br))
      return term(b1,ratio,c.target)
    }
    case 'insert': {
      const ratio=(c.right/c.left)**(1/(c.k+1))
      assert.ok(c.left>0&&c.right>0&&ratio>0)
      assert.ok(close(term(c.left,ratio,c.k+2),c.right))
      return term(c.left,ratio,c.insertIndex+1)
    }
    case 'sum': {
      const direct=sum(c.b1,c.ratio,c.n)
      const formula=c.ratio===1?c.n*c.b1:c.b1*(c.ratio**c.n-1)/(c.ratio-1)
      assert.ok(close(direct,formula))
      return direct
    }
    case 'sumCount': {
      const matches=[]
      for(let n=1;n<=100;n++) if(close(sum(c.b1,c.ratio,n),c.sum))matches.push(n)
      assert.equal(matches.length,1,'The number of terms must be a unique positive integer')
      return matches[0]
    }
    case 'infinite': return infinite(c.b1,c.ratio)
    case 'converges': assert.notEqual(c.b1,0); assert.ok(Math.abs(c.ratio)>=1); return 'Нет конечной суммы'
    case 'convergenceRule': return '|q| < 1'
    case 'bounce': return c.height+2*infinite(c.height*c.ratio,c.ratio)
    default: throw Error('Missing independent audit: '+c.kind)
  }
}
const plainAnswer = (value) => String(value)
  .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,'$1/$2')
  .replace(/\\frac(\d)(\d)/g,'$1/$2')
  .replace(/\\text\{([^}]+)\}/g,'$1')
  .replace(/^q\\in/,'')
  .replace(/\\([{}])/g,'$1')

let audited=0,formulas=0,feedbackEntries=0
const ids=new Set(allWeek3Subtopics.filter((mini)=>mini.lessonId!=='topic-2').flatMap((mini)=>[...mini.lectureExamples,...mini.examples,...mini.practiceQuestions,...mini.miniTestQuestions].map((item)=>item.id)))
const minimums=[[5,6,6],[5,7,7],[5,7,7]]
for(const [index,mini] of geometricProgression.subtopics.entries()){
  assert.ok(mini.theory.length>=7&&mini.rules.length>=3&&mini.info.length>=5)
  assert.ok(mini.examples.length>=minimums[index][0]&&mini.practiceQuestions.length>=minimums[index][1])
  assert.equal(mini.miniTestQuestions.length,minimums[index][2])
  assert.equal(mini.miniTestQuestions.filter((item)=>isCorrectAnswer(item.answer,item.answer,item.answerKind)).length,mini.miniTestQuestions.length,'All-correct test score')
  assert.equal(mini.miniTestQuestions.filter((item)=>isCorrectAnswer(item.options.find((option)=>!isCorrectAnswer(option,item.answer,item.answerKind)),item.answer,item.answerKind)).length,0,'All-incorrect test score')
  assert.equal(mini.number,'2.'+(index+1))
  assert.equal(findWeek3Subtopic(mini.id).lessonId,'topic-2')
  assert.ok(!('homeworkQuestions' in mini))
  for(const [stage] of week3.stages){
    assert.equal(getWeek3StagePaths(mini)[stage],'/week-3/'+mini.id+'/'+stage)
    assert.ok(week3ProgressKeys.includes(mini.id+':'+stage))
  }
  for(const item of [...mini.lectureExamples,...mini.examples,...mini.practiceQuestions,...mini.miniTestQuestions]){
    assert.ok(item.id&&!ids.has(item.id),item.id+': globally unique id');ids.add(item.id)
    assert.ok(item.translationKk&&item.translationKk.length>15,item.id+': Kazakh task translation')
    const expected=evaluate(item.audit)
    const kind=item.audit.kind==='ratioRoots'?'set':item.answerKind
    assert.ok(isCorrectAnswer(plainAnswer(item.answer),expected,kind),`${item.id}: expected ${expected}, found ${item.answer}`)
    const steps=item.steps||item.solution
    assert.ok(steps.length>=3&&steps.every((step)=>step.title&&step.text),item.id+': meaningful step explanations')
    if(item.options){
      assert.equal(new Set(item.options).size,item.options.length)
      assert.equal(item.options.filter((option)=>isCorrectAnswer(option,item.answer,item.answerKind)).length,1,item.id+': exactly one correct choice')
    }
    if(mini.miniTestQuestions.includes(item)){
      assert.equal(item.options.length,4,item.id+': four choices')
      for(const option of item.options){assert.ok(item.optionFeedback?.[option]?.length>15,item.id+': selected-option feedback');feedbackEntries++}
    }
    for(const formula of [item.problem,item.formula,...steps.map((step)=>step.formula),...(item.steps?[item.answer]:[])].filter(Boolean)){
      katex.renderToString(formula,{throwOnError:true,strict:false});formulas++
    }
    if(item.type==='input'){
      const numeric=parseMathNumber(item.answer)
      assert.notEqual(numeric,null,item.id+': compatible numerical input')
      assert.ok(isCorrectAnswer(String(numeric),item.answer))
      assert.ok(!isCorrectAnswer(String(numeric+0.00001),item.answer),item.id+': reject rounded/incorrect result')
    }
    audited++
  }
  for(const card of [...mini.theory,...mini.rules,...mini.info])if(card.formula){katex.renderToString(card.formula,{throwOnError:true,strict:false});formulas++}
}
// Explicit checks for the incorrect keys in the supplied draft.
assert.equal(geometricProgression.subtopics[1].miniTestQuestions[3].answer,'10')
assert.equal(geometricProgression.subtopics[1].miniTestQuestions[4].answer,'Только 3')
assert.ok(isCorrectAnswer('0.5','1/2')&&isCorrectAnswer('0,375','3/8'))
assert.ok(isCorrectAnswer('20/3','6 2/3'))
assert.ok(!isCorrectAnswer('6.67','20/3'))
assert.ok(!isCorrectAnswer('64','-64'))
assert.equal(term(5,0,4),0)
assert.equal(sum(5,0,4),5)
assert.equal(sum(5,-1,4),0)
assert.equal(sum(5,-1,5),5)
assert.deepEqual(roots(-4,2),[])
assert.deepEqual(roots(-8,3),[-2])
assert.equal(week3.lessons.length,2)
assert.deepEqual(week3.lessons.map((item)=>item.id),['topic-1','topic-2'])
assert.equal(allWeek3Subtopics.length,6)
assert.equal(week3ProgressKeys.length,24)
assert.equal(new Set(week3ProgressKeys).size,24)
const app=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8')
assert.ok(app.includes('week3.lessons.find((item) => path === \'/week-3/\' + item.id)'))
assert.ok(app.includes("key={mini.id + '-practice'}")&&app.includes("key={mini.id + '-test'}"))
assert.ok(app.includes('csca-week3-progress-v1'))
console.log(`Geometric Progression: ${audited} answers, ${formulas} LaTeX expressions, ${feedbackEntries} option-specific explanations passed. Fraction grading, unique roots/indices/counts, corrected draft keys and 24 Week 3 stages checked.`)
