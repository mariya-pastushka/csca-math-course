import { lectures,examSkills } from './lectures.js'
import { examples } from './examples.js'
import { practiceQuestions } from './practice.js'
import { miniTestQuestions } from './miniTest.js'
import { vocabulary } from './vocabulary.js'

export const topic3 = {
  id:'topic-3',number:3,titleRu:'Линейные и составные неравенства',title:'Linear and compound inequalities',available:true,
  description:'От смысла знаков до систем и модуля: объясняем преобразования, рисуем решения и учимся выбирать правильные границы.',
  goal:'Решать линейные неравенства и системы, понимать «и» и «или», переворот знака и геометрический смысл модуля. Записывать все решения неравенством, на прямой и интервалами, проверяя границы.',
  examplesNote:'1–4 базовые · 5–7 скобки и перенос · 8–10 системы · 11–15 модуль и комбинированные задачи',
  examFocusTitle:'Что нужно уметь для экзамена',examFocusNote:'К таким типам задач стоит быть готовым.',
  examNote:'К таким типам задач стоит быть готовым. Здесь укрепляем школьную базу решения и записи неравенств для дальнейшей подготовки к CSCA, а не обещаем конкретные задания каждого варианта. Квадратные и рациональные неравенства будут изучаться позже.',
  testDescription:'10 новых заданий: линейные неравенства, системы, модуль, числовая прямая и комбинированная задача. Решения доступны только после завершения.',
  resultMessages:{excellent:'Отлично! Ты хорошо владеешь неравенствами.',veryGood:'Очень хороший результат. Повтори несколько моментов.',good:'Неплохо. Стоит повторить отдельные типы задач.',review:'Рекомендуется ещё раз пройти Lecture и Practice.',restart:'Лучше повторить тему с начала и затем пройти Practice ещё раз.'},
  resultBands:[{min:10,key:'excellent'},{min:8,key:'veryGood'},{min:6,key:'good'},{min:4,key:'review'},{min:0,key:'restart'}],
  subtopics:lectures.map((item) => ({...item,lessonId:'topic-3',available:true})),
  examples,practiceQuestions,miniTestQuestions,vocabulary,examSkills,
}
