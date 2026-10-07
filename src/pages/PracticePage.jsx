import { useMemo, useState } from 'react'
import QuestionCard, { isCorrectAnswer, prepareQuestions } from '../components/QuestionCard'
import ProgressBar from '../components/ProgressBar'
import { ArrowLeft, ArrowRight } from '../components/Icons'
import { LessonNavigation, PageHeading } from '../components/PageElements'
import SubtopicHeader from '../components/SubtopicHeader'

export default function PracticePage({ topic, navigate, progress, onComplete, onSkip }) {
  const questions = useMemo(() => prepareQuestions(topic.practiceQuestions), [topic.id])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [solutions, setSolutions] = useState({})
  const current = questions[index]
  const value = answers[current.id]
  const isChecked = Boolean(checked[current.id])
  const isCorrect = isCorrectAnswer(value, current.answer)

  const goNext = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const finish = () => {
    onComplete(topic.id, 'practice')
    navigate('/week-1/' + topic.id + '/homework')
  }
  const skip = () => {
    onSkip(topic.id, 'practice')
    navigate('/week-1/' + topic.id + '/homework')
  }

  return (
    <div className="content-page lesson-content-page">
      <SubtopicHeader topic={topic} stage="practice" navigate={navigate} progress={progress} onSkip={skip} />
      <div className="lesson-container narrow-container">
        <PageHeading
          eyebrow={'Урок ' + topic.lesson.number + ' · Подтема ' + topic.number + ' · Практика'}
          title="Теперь попробуйте сами"
          subtitle="Решите задачу, проверьте ответ и только потом, если нужно, откройте подробное решение."
          meta={topic.titleRu}
        />

        <button className="stage-back-link" onClick={() => navigate('/week-1/' + topic.id + '/examples')}>
          <ArrowLeft size={16} /> Назад к разобранным примерам
        </button>

        <div className="session-status">
          <div>
            <span>Практика</span>
            <strong>Задание {index + 1} из {questions.length}</strong>
          </div>
          <ProgressBar value={((index + (isChecked ? 1 : 0)) / questions.length) * 100} />
        </div>

        <QuestionCard
          question={current}
          value={value}
          onChange={(nextValue) => setAnswers({ ...answers, [current.id]: nextValue })}
          checked={isChecked}
          correct={isCorrect}
          onCheck={() => setChecked({ ...checked, [current.id]: true })}
          solutionOpen={Boolean(solutions[current.id])}
          onToggleSolution={() => setSolutions({ ...solutions, [current.id]: !solutions[current.id] })}
        />

        {isChecked && index < questions.length - 1 && (
          <div className="question-next">
            <button className="primary-button" onClick={goNext}>
              Следующее задание <ArrowRight size={18} />
            </button>
          </div>
        )}

        {isChecked && index === questions.length - 1 && (
          <LessonNavigation
            previous={{ path: '/week-1/' + topic.id + '/examples', label: 'Разобранные примеры' }}
            next={{ path: '/week-1/' + topic.id + '/homework', label: 'Домашняя работа' }}
            nextLabel="Продолжить к домашней работе"
            navigate={navigate}
            onNext={finish}
          />
        )}
      </div>
    </div>
  )
}
