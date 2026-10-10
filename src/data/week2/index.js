import { lectures, examSkills } from './lectures.js'
import { examples, practiceQuestions, miniTestQuestions } from './exercises.js'
import { vocabulary } from './vocabulary.js'
import { topic2 } from './topic2/index.js'
import { topic3 } from './topic3/index.js'

export { topic2 }
export { topic3 }

export const topic1 = {
  id: 'topic-1', number: 1,
  titleRu: 'Линейные уравнения и системы',
  title: 'Linear equations and systems',
  description: 'От смысла равенства до дробных коэффициентов, выбора метода, параметров и текстовых задач.',
  available: true,
  subtopics: lectures.map((item) => ({ ...item, lessonId: 'topic-1', available: true })),
  examples, practiceQuestions, miniTestQuestions, vocabulary, examSkills,
}

export const week2 = {
  id: 'week-2', number: 2,
  title: 'Equations, Sets and Inequalities',
  titleRu: 'Уравнения, множества и неравенства',
  progressLabel: 'Прогресс Topic 1',
  stages: [['lecture', 'Lecture · Лекция'], ['examples', 'Examples · Примеры'], ['practice', 'Practice · Практика']],
  lessons: [
    topic1,
    topic2,
    topic3,
  ],
}

export const allWeek2Subtopics = week2.lessons.flatMap((lesson) => lesson.subtopics.map((item) => ({ ...item, lesson })))
export const findWeek2Subtopic = (id) => allWeek2Subtopics.find((item) => item.id === id)
export const topic1ProgressKeys = [...lectures.map((item) => item.id + ':lecture'), 'topic-1:examples', 'topic-1:practice', 'topic-1:vocabulary', 'topic-1:mini-test']
export const getTopicProgressKeys = (item) => [...item.subtopics.map((mini) => mini.id + ':lecture'), ...['examples','practice','vocabulary','mini-test'].map((stage) => item.id + ':' + stage)]
