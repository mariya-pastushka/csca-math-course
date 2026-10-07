export const vocab = (term, translation, explanation) => ({ term, translation, explanation })

export const step = (title, text, formula = '') => ({ title, text, formula })

export const worked = (level, problem, steps, answer) => ({ level, problem, steps, answer })

export const question = ({
  id,
  question,
  formula = '',
  answer,
  options,
  solution,
  explanation = '',
  difficulty = 'Средний',
  skill,
  type = options ? 'choice' : 'input',
}) => ({ id, question, formula, answer: String(answer), options, solution, explanation, difficulty, skill, type })

export const topic = ({
  id,
  lessonId,
  number,
  title,
  titleRu,
  summary,
  vocabulary,
  theory,
  rules,
  miniExamples,
  workedExamples,
  practiceQuestions,
  homeworkQuestions,
}) => ({
  id,
  lessonId,
  number,
  title,
  titleRu,
  summary,
  vocabulary,
  theory,
  rules,
  miniExamples,
  workedExamples,
  practiceQuestions,
  homeworkQuestions,
})
