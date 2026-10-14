import { basics } from './basics.js'
import { nthTerm } from './nthTerm.js'
import { sums } from './sums.js'
import { resultMessages } from './helpers.js'
import { geometricBasics } from './geometricBasics.js'
import { geometricNthTerm } from './geometricNthTerm.js'
import { geometricSums } from './geometricSums.js'

export const arithmeticProgression = {
  id:'topic-1', number:1, title:'Arithmetic Progression', titleRu:'Арифметическая прогрессия', available:true,
  description:'Закономерности числовых последовательностей, разность прогрессии, формула общего члена, сумма первых n членов и экзаменационные задачи.',
  goal:'Понимать постоянный шаг, выбирать формулу и решать задачи, а не просто запоминать записи. Каждая подтема проходит свой цикл Lecture → Worked Examples → Practice → Mini Test.',
  subtopics:[basics,nthTerm,sums].map((mini) => ({...mini,lessonId:'topic-1',available:true,resultMessages})),
}

export const geometricProgression = {
  id:'topic-2', number:2, title:'Geometric Progression', titleRu:'Геометрическая прогрессия', available:true,
  description:'Постоянное отношение, общий член, конечные и бесконечные суммы. Знаки, степени, проценты и задачи экзаменационного формата.',
  goal:'Понимать множитель q, выбирать формулу по вопросу и проверять её ограничения. От первых шагов к восстановлению прогрессии и задачам на бесконечную сумму. Каждая подтема: Lecture → Worked Examples → Practice → Mini Test.',
  subtopics:[geometricBasics,geometricNthTerm,geometricSums].map((mini) => ({...mini,lessonId:'topic-2',available:true,resultMessages})),
}

export const week3 = {
  id:'week-3', number:3, title:'Arithmetic and Geometric Progressions', titleRu:'Арифметическая и геометрическая прогрессии',
  description:'Арифметическая и геометрическая прогрессии: закономерности, формулы общего члена и суммы. Две темы с отдельными лекциями, разборами, практикой и мини-тестами.',
  progressLabel:'Прогресс Week 3', subtopicStages:true, overviewMeta:'2 темы · 6 подтем',
  stages:[['lecture','Lecture · Лекция'],['examples','Worked Examples · Примеры'],['practice','Practice · Практика'],['mini-test','Mini Test']],
  lessons:[arithmeticProgression,geometricProgression],
}

export const allWeek3Subtopics = week3.lessons.flatMap((lesson) => lesson.subtopics.map((mini) => ({...mini,lesson})))
export const findWeek3Subtopic = (id) => allWeek3Subtopics.find((mini) => mini.id === id)
export const week3ProgressKeys = allWeek3Subtopics.flatMap((mini) => week3.stages.map(([stage]) => mini.id+':'+stage))
export const getWeek3StagePaths = (mini) => Object.fromEntries(week3.stages.map(([stage]) => [stage,'/week-3/'+mini.id+'/'+stage]))
