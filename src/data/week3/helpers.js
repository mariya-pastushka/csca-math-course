export { step as s } from '../week1/helpers.js'
export const m = String.raw

export const ex = (id, prompt, translationKk, problem, answer, steps, audit, level = 'Лекция · по шагам') => ({
  id, prompt, translationKk, problem, answer: String(answer), steps, audit, level,
})

export const q = (item) => ({
  ...item, answer: Array.isArray(item.answer) ? item.answer : String(item.answer),
  type: item.type || (item.options ? 'choice' : 'input'),
  difficulty: item.difficulty || 'Средний',
  feedbackExplanation: item.explanation,
})

export const resultMessages = {
  excellent: 'Отлично! Все навыки этой подтемы освоены.',
  good: 'Хороший результат. Разберите оставшиеся ошибки.',
  review: 'Повторите отмеченные навыки и потренируйтесь ещё.',
  restart: 'Вернитесь к лекции и пройдите примеры по шагам.',
}
