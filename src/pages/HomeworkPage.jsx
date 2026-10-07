import { useMemo, useState } from 'react'
import QuestionCard, { isCorrectAnswer, prepareQuestions } from '../components/QuestionCard'
import ProgressBar from '../components/ProgressBar'
import { ArrowLeft, ArrowRight } from '../components/Icons'
import { PageHeading } from '../components/PageElements'
import SubtopicHeader from '../components/SubtopicHeader'

export default function HomeworkPage({ topic, navigate, progress, onFinish }) {
  const questions = useMemo(() => prepareQuestions(topic.homeworkQuestions, true), [topic.id])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [solutions, setSolutions] = useState({})
  const current = questions[index]
  const value = answers[current.id]
  const isChecked = Boolean(checked[current.id])
  const isCorrect = isCorrectAnswer(value, current.answer)
  const answeredCount = Object.keys(checked).length

  const viewResult = () => {
    const attempts = questions.map((item) => ({
      questionId: item.id,
      answer: answers[item.id],
      correct: isCorrectAnswer(answers[item.id], item.answer),
      skill: item.skill,
    }))
    const score = attempts.filter((item) => item.correct).length
    onFinish(topic.id, {
      score,
      total: questions.length,
      attempts,
      wrongSkills: [...new Set(attempts.filter((item) => !item.correct).map((item) => item.skill))],
      wrongQuestionIds: attempts.filter((item) => !item.correct).map((item) => item.questionId),
      completedAt: new Date().toISOString(),
    })
    navigate('/week-1/' + topic.id + '/result')
  }

  return (
    <div className="content-page lesson-content-page homework-page">
      <SubtopicHeader topic={topic} stage="homework" navigate={navigate} progress={progress} />
      <div className="lesson-container narrow-container">
        <PageHeading
          eyebrow={'Урок ' + topic.lesson.number + ' · Подтема ' + topic.number}
          title="Домашняя работа"
          subtitle="Здесь задания ближе к экзаменационному формату. Ответьте самостоятельно, затем при необходимости разберите решение."
          meta={topic.titleRu}
        />

        <button className="stage-back-link" onClick={() => navigate('/week-1/' + topic.id + '/practice')}>
          <ArrowLeft size={16} /> Назад к практике
        </button>

        <div className="homework-progress">
          <div>
            <span>Homework Progress</span>
            <strong>{answeredCount} / {questions.length}</strong>
          </div>
          <ProgressBar value={(answeredCount / questions.length) * 100} />
        </div>

        <div className="question-count">Question {index + 1} of {questions.length}</div>
        <QuestionCard
          serious
          question={current}
          value={value}
          onChange={(nextValue) => setAnswers({ ...answers, [current.id]: nextValue })}
          checked={isChecked}
          correct={isCorrect}
          onCheck={() => setChecked({ ...checked, [current.id]: true })}
          solutionOpen={Boolean(solutions[current.id])}
          onToggleSolution={() => setSolutions({ ...solutions, [current.id]: !solutions[current.id] })}
        />

        {isChecked && (
          <div className="question-next">
            {index < questions.length - 1 ? (
              <button className="primary-button" onClick={() => {
                setIndex(index + 1)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}>
                Следующий вопрос <ArrowRight size={18} />
              </button>
            ) : (
              <button className="primary-button" onClick={viewResult}>
                Посмотреть результат <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
