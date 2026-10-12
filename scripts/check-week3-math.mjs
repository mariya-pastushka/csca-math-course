import assert from 'node:assert/strict'
import katex from 'katex'
import { week3, allWeek3Subtopics, week3ProgressKeys, getWeek3StagePaths } from '../src/data/week3/index.js'
import { isCorrectAnswer, parseMathNumber } from '../src/utils/answers.js'

// Recompute from the task's givens. Sums deliberately use direct addition,
// rather than the formula used in the student-facing solution.
const term = (a,d,n) => a+(n-1)*d
const sum = (a,d,n) => Array.from({length:n},(_,i)=>a+i*d).reduce((total,x)=>total+x,0)
const same = (a,b) => Math.abs(a-b)<1e-9
const arithmetic = (items) => items.slice(1).every((x,i)=>same(x-items[i],items[1]-items[0]))
const twoDifference = (c) => (c.aq-c.ap)/(c.q-c.p)
const twoFirst = (c) => c.ap-(c.p-1)*twoDifference(c)
const subscripts = (n) => String(n).replace(/\d/g,(digit)=>'₀₁₂₃₄₅₆₇₈₉'[digit])

const evaluate = (c) => {
  switch(c.kind) {
    case 'term': return term(c.a1,c.d,c.n)
    case 'difference': assert.ok(arithmetic(c.terms)); return c.terms[1]-c.terms[0]
    case 'middle': return (c.left+c.right)/2
    case 'isArithmetic': return arithmetic(c.terms)?'Да':'Нет'
    case 'trend': return !arithmetic(c.terms)?'Не является арифметической':c.terms[1]>c.terms[0]?'Возрастающая':c.terms[1]<c.terms[0]?'Убывающая':'Постоянная'
    case 'chooseSequence': {
      const matches=Object.entries(c.sequences).filter(([,items])=>arithmetic(items))
      assert.equal(matches.length,1,'Exactly one arithmetic sequence')
      return matches[0][0]
    }
    case 'linearMiddle': {
      const coefficient=2*c.middle[0]-c.left[0]-c.right[0]
      const constant=c.left[1]+c.right[1]-2*c.middle[1]
      assert.notEqual(coefficient,0)
      const x=constant/coefficient
      assert.ok(arithmetic([c.left,c.middle,c.right].map(([a,b])=>a*x+b)))
      return x
    }
    case 'impossibleMiddle':
      assert.equal(c.thirdSlope,2)
      assert.notEqual(c.first+c.thirdConstant,0)
      return 'Такого k нет'
    case 'differenceError': assert.ok(arithmetic(c.terms)); assert.notEqual(c.terms[1],c.terms[0]); return 'Вычитание сделано в обратном порядке'
    case 'constant': assert.ok(c.terms.every((x)=>x===c.terms[0])); return 'd = 0, прогрессия постоянная'
    case 'first': return c.an-(c.n-1)*c.d
    case 'twoDifference': return twoDifference(c)
    case 'fromTwo': return term(twoFirst(c),twoDifference(c),c.target)
    case 'index': {
      const n=1+(c.value-c.a1)/c.d
      assert.ok(Number.isInteger(n)&&n>0)
      assert.ok(same(term(c.a1,c.d,n),c.value))
      return n
    }
    case 'membership': {
      const n=1+(c.value-c.a1)/c.d
      return Number.isInteger(n)&&n>0?'Да':'Нет'
    }
    case 'constantMembership': assert.notEqual(c.value,c.a1); return '10 не является членом'
    case 'insert': return c.left+c.insertIndex*(c.right-c.left)/(c.k+1)
    case 'insertDifference': return (c.right-c.left)/(c.k+1)
    case 'pairConditions': {
      const d=c.difference/(c.diffQ-c.diffP)
      const a=(c.sum-(c.sumP+c.sumQ-2)*d)/2
      assert.ok(same(term(a,d,c.sumP)+term(a,d,c.sumQ),c.sum))
      assert.ok(same(term(a,d,c.diffQ)-term(a,d,c.diffP),c.difference))
      return term(a,d,c.target)
    }
    case 'stepError': return 'Использовать '+(c.n-1)+' шагов'
    case 'firstPositive': {
      let n=1
      while(c.slope*n+c.constant<=0) n++
      return c.slope*n+c.constant
    }
    case 'sum': return sum(c.a1,c.d,c.n)
    case 'endSum': return sum(c.first,(c.last-c.first)/(c.n-1),c.n)
    case 'range': return sum(term(c.a1,c.d,c.p),c.d,c.q-c.p+1)
    case 'twoRange': return sum(term(twoFirst(c),twoDifference(c),c.from),twoDifference(c),c.to-c.from+1)
    case 'count': {
      const matches=[]
      let total=0
      for(let n=1;n<=10000;n++) {
        total+=term(c.a1,c.d,n)
        if(same(total,c.sum)) matches.push(n)
      }
      assert.equal(matches.length,1,'Exactly one positive integer count')
      return matches[0]
    }
    case 'sumDifference': {
      const d=(2*c.sum/c.n-2*c.a1)/(c.n-1)
      assert.ok(same(sum(c.a1,d,c.n),c.sum))
      return d
    }
    case 'sumFirst': {
      const a=(2*c.sum/c.n-(c.n-1)*c.d)/2
      assert.ok(same(sum(a,c.d,c.n),c.sum))
      return a
    }
    case 'positiveSum': {
      assert.ok(c.a1>0&&c.d<0)
      let total=0,n=1
      while(term(c.a1,c.d,n)>0) total+=term(c.a1,c.d,n++)
      return total
    }
    case 'sumDelta': return c.current-c.previous
    case 'rangeFormula': return (c.q-c.p+1)+'(a'+subscripts(c.p)+' + a'+subscripts(c.q)+')/2'
    case 'pairSumDifference': {
      const coefficient=c.n-c.p-c.q+1
      assert.notEqual(coefficient,0)
      const d=(2*c.sum/c.n-c.pairSum)/coefficient
      const a=(c.pairSum-(c.p+c.q-2)*d)/2
      assert.ok(same(term(a,d,c.p)+term(a,d,c.q),c.pairSum))
      assert.ok(same(sum(a,d,c.n),c.sum))
      return d
    }
    default: throw Error('Missing independent audit for '+c.kind)
  }
}

const plainAnswer = (answer) => String(answer)
  .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,'$1/$2')
  .replace(/\\frac(\d)(\d)/g,'$1/$2')
  .replace(/\\text\{([^}]+)\}/g,'$1')

let checked=0,formulas=0
const ids=new Set()
for(const mini of allWeek3Subtopics) {
  const items=[...mini.lectureExamples,...mini.examples,...mini.practiceQuestions,...mini.miniTestQuestions]
  assert.ok(mini.theory.length>=5&&mini.rules.length>=3)
  assert.equal(mini.examples.length,5)
  assert.ok(mini.practiceQuestions.length>=8)
  assert.ok(mini.miniTestQuestions.length>=6)
  assert.ok(mini.miniTestQuestions.some((item)=>item.type==='choice')&&mini.miniTestQuestions.some((item)=>item.type==='input'))
  assert.ok(!('homeworkQuestions' in mini))
  const paths=getWeek3StagePaths(mini)
  for(const [stage] of week3.stages) {
    assert.equal(paths[stage],'/week-3/'+mini.id+'/'+stage)
    assert.ok(week3ProgressKeys.includes(mini.id+':'+stage))
  }
  for(const item of items) {
    assert.ok(item.id&&!ids.has(item.id),item.id+': unique id'); ids.add(item.id)
    assert.ok(item.translationKk&&item.translationKk.length>15,item.id+': task translation')
    const expected=evaluate(item.audit)
    assert.ok(isCorrectAnswer(plainAnswer(item.answer),expected,item.answerKind),item.id+': expected '+expected+', found '+item.answer)
    const solution=item.steps||item.solution
    assert.ok(solution.length>=3,item.id+': detailed solution')
    assert.ok(solution.every((step)=>step.title&&step.text),item.id+': explain why')
    if(item.options) {
      assert.equal(new Set(item.options).size,item.options.length,item.id+': unique choices')
      assert.equal(item.options.filter((option)=>isCorrectAnswer(option,item.answer,item.answerKind)).length,1,item.id+': one correct answer')
    }
    for(const formula of [item.problem,item.formula,...solution.map((step)=>step.formula),...(item.steps?[item.answer]:[])].filter(Boolean)) {
      katex.renderToString(formula,{throwOnError:true,strict:false}); formulas++
    }
    const numeric=parseMathNumber(plainAnswer(item.answer))
    if(item.type==='input'&&numeric!==null) {
      assert.ok(isCorrectAnswer(String(numeric),item.answer),item.id+': numerical grading')
      assert.ok(!isCorrectAnswer(String(numeric+1),item.answer),item.id+': reject wrong value')
    }
    checked++
  }
  for(const card of [...mini.theory,...mini.rules,...mini.info]) if(card.formula) {
    katex.renderToString(card.formula,{throwOnError:true,strict:false}); formulas++
  }
}
assert.equal(week3.lessons.length,1)
assert.equal(allWeek3Subtopics.length,3)
assert.equal(week3ProgressKeys.length,12)
assert.ok(week3.stages.every(([stage])=>stage!=='homework'))
assert.ok(isCorrectAnswer('-0.75','-3/4'))
assert.ok(isCorrectAnswer('−3/4','-3/4'))
console.log(`Week 3: ${checked} independent answer checks and ${formulas} LaTeX expressions passed. All choices, numeric/fraction grading, task translations and 12 progression stages checked.`)
