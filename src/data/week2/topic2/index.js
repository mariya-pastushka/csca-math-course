import { lectures, examSkills } from './lectures.js'
import { examples, practiceQuestions, miniTestQuestions } from './exercises.js'
import { vocabulary } from './vocabulary.js'

export const topic2 = {
  id: 'topic-2', number: 2, titleRu: 'Множества и интервальная запись', title: 'Sets and interval notation', available: true,
  description: 'Читаем математические символы, выполняем операции над множествами и переводим условия в интервалы и числовую прямую.',
  goal: 'Научиться читать ∈, ∪, ∩ и скобки без угадывания, различать «и» и «или», определять включение границ и применять это к условиям задач.',
  examplesNote: '1–3 принадлежность · 4–6 операции · 7–9 интервалы · 10–12 комбинированные задачи',
  examNote: 'К таким типам задач стоит быть готовым. Это тренировочные навыки чтения обозначений и работы с условиями, а не обещание конкретной задачи в каждом варианте CSCA.',
  testDescription: '8 заданий: принадлежность, количество элементов, подмножество, объединение, пересечение, разность, интервальная запись и система условий.',
  resultMessages: {
    excellent: 'Отлично! Ты хорошо владеешь множествами и интервальной записью.',
    good: 'Хороший результат. Повтори несколько моментов.',
    review: 'Стоит ещё раз пройти лекцию и потренироваться.',
    restart: 'Рекомендуется повторить тему с начала и выполнить Practice ещё раз.',
  },
  subtopics: lectures.map((item) => ({ ...item, lessonId: 'topic-2', available: true })),
  examples, practiceQuestions, miniTestQuestions, vocabulary, examSkills,
}
