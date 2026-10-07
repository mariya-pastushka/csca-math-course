import { useMemo, useState } from 'react'
import { week1 } from '../data/week1'
import QuestionCard, { isCorrectAnswer, prepareQuestions } from '../components/QuestionCard'
import ProgressBar from '../components/ProgressBar'
import { ArrowLeft, ArrowRight, Flag } from '../components/Icons'

export default function FinalTestPage({ navigate, onFinish }) {
  const questions = useMemo(() => prepareQuestions(week1.finalTestQuestions), [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const current = questions[index]
  const answered = Object.keys(answers).filter((id) => answers[id] !== '').length
  const canSubmit = answered === questions.length

  const finish = () => {
    const attempts = questions.map((item) => ({
      questionId: item.id,
      answer: answers[item.id],
      correct: isCorrectAnswer(answers[item.id], item.answer),
      skill: item.skill,
    }))
    const score = attempts.filter((item) => item.correct).length
    onFinish({
      score,
      total: questions.length,
      attempts,
      wrongSkills: [...new Set(attempts.filter((item) => !item.correct).map((item) => item.skill))],
      wrongQuestionIds: attempts.filter((item) => !item.correct).map((item) => item.questionId),
      completedAt: new Date().toISOString(),
    })
    navigate('/week-1/final-result')
  }

  return (
    <div className="content-page final-test-page">
      <header className="test-header">
        <button onClick={() => navigate('/week-1')}><ArrowLeft /> Дашборд</button>
        <div>
          <Flag size={20} />
          <span>Week 1 Final Test</span>
        </div>
        <strong>{answered} / {questions.length}</strong>
      </header>

      <div className="test-container">
        <div className="test-intro">
          <span>CSCA Mathematics</span>
          <h1>Week 1 Test</h1>
          <p>Basic Arithmetic & Number Skills</p>
        </div>

        <div className="test-progress">
          <div>
            <span>Вопрос {index + 1} из {questions.length}</span>
            <span>Ответьте на все вопросы</span>
          </div>
          <ProgressBar value={(answered / questions.length) * 100} />
        </div>

        <div className="test-question-dots" aria-label="Вопросы теста">
          {questions.map((item, questionIndex) => (
            <button
              key={item.id}
              className={(questionIndex === index ? 'is-current ' : '') + (answers[item.id] !== undefined ? 'is-answered' : '')}
              onClick={() => setIndex(questionIndex)}
              aria-label={'Вопрос ' + (questionIndex + 1)}
            >
              {questionIndex + 1}
            </button>
          ))}
        </div>

        <QuestionCard
          serious
          hideFeedback
          question={current}
          value={answers[current.id]}
          onChange={(value) => setAnswers({ ...answers, [current.id]: value })}
          checked={false}
        />

        <div className="test-navigation">
          <button className="text-button" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
            <ArrowLeft /> Предыдущий
          </button>
          {index < questions.length - 1 ? (
            <button className="primary-button" onClick={() => setIndex(index + 1)} disabled={answers[current.id] === undefined || answers[current.id] === ''}>
              Следующий <ArrowRight />
            </button>
          ) : (
            <button className="primary-button" onClick={finish} disabled={!canSubmit}>
              Завершить тест <ArrowRight />
            </button>
          )}
        </div>

        {!canSubmit && index === questions.length - 1 && (
          <p className="test-hint">Перед завершением ответьте на все вопросы. Незаполненные номера отмечены выше.</p>
        )}
      </div>
    </div>
  )
}
