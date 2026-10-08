// Checks authored mathematical answers only; does not start or test the website.
import assert from 'node:assert/strict'
import { lectures } from '../src/data/week2/lectures.js'
import { examples, practiceQuestions, miniTestQuestions } from '../src/data/week2/exercises.js'
import { isCorrectAnswer, parseMathNumber } from '../src/utils/answers.js'

const close = (a, b) => Math.abs(a - b) < 1e-8
const evaluate = (expression, values = {}) => {
  assert.match(expression, /^[\d\sxyk.+\-*/()]+$/)
  return Function('x', 'y', 'k', 'return (' + expression + ')')(values.x || 0, values.y || 0, values.k || 0)
}
const difference = (equation, values = {}) => {
  const [left, right] = equation.split('=')
  return evaluate(left, values) - evaluate(right, values)
}

const rank = (source) => {
  const matrix = source.map((row) => [...row])
  let pivotRow = 0
  for (let column = 0; column < matrix[0].length && pivotRow < matrix.length; column += 1) {
    const pivot = matrix.findIndex((row, index) => index >= pivotRow && Math.abs(row[column]) > 1e-8)
    if (pivot === -1) continue
    ;[matrix[pivot], matrix[pivotRow]] = [matrix[pivotRow], matrix[pivot]]
    const divisor = matrix[pivotRow][column]
    matrix[pivotRow] = matrix[pivotRow].map((value) => value / divisor)
    for (let row = pivotRow + 1; row < matrix.length; row += 1) {
      const multiplier = matrix[row][column]
      matrix[row] = matrix[row].map((value, index) => value - multiplier * matrix[pivotRow][index])
    }
    pivotRow += 1
  }
  return pivotRow
}

const solutionCount = (equations, parameters = {}) => {
  const hasY = equations.some((equation) => /y/.test(equation))
  const rows = equations.map((equation) => {
    const constant = difference(equation, { ...parameters, x: 0, y: 0 })
    const x = difference(equation, { ...parameters, x: 1, y: 0 }) - constant
    const y = difference(equation, { ...parameters, x: 0, y: 1 }) - constant
    return hasY ? [x, y, -constant] : [x, -constant]
  })
  const coefficients = rank(rows.map((row) => row.slice(0, -1)))
  const augmented = rank(rows)
  return augmented > coefficients ? 'none' : coefficients === (hasY ? 2 : 1) ? 'one' : 'infinite'
}

let checked = 0
const all = [...lectures.flatMap((lecture) => lecture.lectureExamples), ...examples, ...practiceQuestions, ...miniTestQuestions]
for (const item of all) {
  const label = item.id || item.problem
  const audit = item.audit
  if (item.options) assert.equal(item.options.filter((option) => isCorrectAnswer(option, item.answer)).length, 1, label + ': exactly one correct option')
  if (!audit) continue
  if (audit.values) {
    for (const equation of audit.equations) assert.ok(close(difference(equation, audit.values), 0), label + ': ' + equation)
    if (audit.answerVariable) assert.ok(close(parseMathNumber(item.answer), audit.values[audit.answerVariable]), label + ': displayed answer')
    if (audit.integerContext) assert.ok(Object.values(audit.values).some((value) => !Number.isInteger(value)), label + ': invalid ticket count')
  }
  if (audit.count) assert.equal(solutionCount(audit.equations), audit.count, label + ': number of solutions')
  if (audit.expression) {
    assert.ok(close(evaluate(audit.expression, audit.values), audit.result), label + ': expression value')
    if (audit.answerExpression) assert.ok(close(parseMathNumber(item.answer), audit.result), label + ': displayed expression answer')
  }
  if (audit.identity) for (const x of [-7, 0, 1, 3, 11]) assert.ok(close(evaluate(audit.identity[0], { x }), evaluate(audit.identity[1], { x })), label + ': identity')
  if (audit.parameter) {
    const { name, exceptional, equations, ordinaryX, exceptionalCount } = audit.parameter
    assert.equal(solutionCount(equations, { [name]: exceptional }), exceptionalCount, label + ': exceptional parameter')
    for (const value of [-5, 0, 1, 4]) if (value !== exceptional) for (const equation of equations) assert.ok(close(difference(equation, { [name]: value, x: ordinaryX }), 0), label + ': ordinary parameter')
  }
  checked += 1
}
// Numerical examples embedded in explanations of the text-to-system method.
assert.equal(2 * 4 + 3, 11)
assert.equal(4 - 3, 1)
assert.equal(8 * 4 + 5 * 6, 62)
assert.equal(solutionCount(['(k-2)*x=6'], { k: 2 }), 'none')
assert.equal(solutionCount(['(k-2)*x=0'], { k: 2 }), 'infinite')
assert.equal(examples.length, 12)
assert.equal(practiceQuestions.length, 18)
assert.equal(miniTestQuestions.length, 8)
console.log('Week 2: ' + checked + ' mathematical items verified; 12 examples, 18 practice tasks and 8 mini-test tasks.')
