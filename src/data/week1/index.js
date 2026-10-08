import { lesson1 } from './lesson1.js'
import { lesson2 } from './lesson2.js'
import { lesson3 } from './lesson3.js'
import { finalTestQuestions } from './finalTest.js'
import { addRussianTranslation } from './translations.js'

const lessons = [lesson1, lesson2, lesson3].map((lesson) => ({
  ...lesson,
  subtopics: lesson.subtopics.map((subtopic) => ({
    ...subtopic,
    practiceQuestions: subtopic.practiceQuestions.map(addRussianTranslation),
    homeworkQuestions: subtopic.homeworkQuestions.map(addRussianTranslation),
  })),
}))

export const week1 = {
  id: 'week-1',
  number: 1,
  title: 'Basic Arithmetic & Number Skills',
  titleRu: 'Базовая арифметика и навыки работы с числами',
  description: 'Три урока, которые укрепят вычислительную базу для заданий CSCA Mathematics.',
  lessons,
  finalTestQuestions: finalTestQuestions.map(addRussianTranslation),
}

export const allSubtopics = week1.lessons.flatMap((lesson) =>
  lesson.subtopics.map((subtopic) => ({
    ...subtopic,
    lesson,
  })),
)

export const findSubtopic = (id) => allSubtopics.find((item) => item.id === id)

export const getNextSubtopic = (id) => {
  const index = allSubtopics.findIndex((item) => item.id === id)
  return index >= 0 ? allSubtopics[index + 1] : undefined
}
