import { useState } from 'react'
import { week1 } from '../data/week1'
import { ArrowLeft, Check, Close, Rotate } from '../components/Icons'
import { SolutionSteps } from '../components/LearningCards'
import MathFormula from '../components/MathFormula'

const finalFeedback = (percentage) => {
  if (percentage >= 90) return ['Excellent', 'Вы готовы двигаться дальше: базовые навыки Week 1 освоены уверенно.']
  if (percentage >= 70) return ['Good job', 'Хорошая база. Разберите несколько ошибок, прежде чем переходить к следующей неделе.']
  if (percentage >= 50) return ['Review the topics', 'Часть навыков уже сформирована. Повторите указанные темы и пройдите тест ещё раз.']
  return ['Let’s study Week 1 again', 'Вернитесь к урокам по темам ниже. Маленькие шаги дадут лучший результат, чем угадывание.']
}

export default function FinalResultPage({ navigate, result }) {
  const [reviewOpen, setReviewOpen] = useState(false)

  if (!result) {
    return (
      <div className="content-page final-result-page">
        <div className="test-container empty-result">
          <span>Итогового результата пока нет</span>
          <h1>Сначала завершите Week 1 Test.</h1>
          <button className="primary-button" onClick={() => navigate('/week-1/final-test')}>Начать тест</button>
        </div>
      </div>
    )
  }

  const percentage = Math.round((result.score / result.total) * 100)
  const [title, message] = finalFeedback(percentage)
  const wrongQuestions = week1.finalTestQuestions.filter((item) => result.wrongQuestionIds.includes(item.id))

  return (
    <div className="content-page final-result-page">
      <header className="test-header">
        <button onClick={() => navigate('/week-1')}><ArrowLeft /> Дашборд</button>
        <div><span>Week 1 · Result</span></div>
        <strong>{percentage}%</strong>
      </header>

      <div className="test-container">
        <section className="final-result-hero">
          <span>Week 1 Complete</span>
          <h1>{result.score} <small>/ {result.total}</small></h1>
          <div className="final-percentage">{percentage}%</div>
          <h2>{title}</h2>
          <p>{message}</p>
        </section>

        <div className="result-stats">
          <div><Check /><span>Correct<strong>{result.score}</strong></span></div>
          <div><Close /><span>Incorrect<strong>{result.total - result.score}</strong></span></div>
          <div><span className="percent-icon">%</span><span>Percentage<strong>{percentage}%</strong></span></div>
        </div>

        <section className="review-topics">
          <span>Topics to review</span>
          <h2>{result.wrongSkills.length ? 'Повторите перед следующим шагом' : 'Все темы усвоены'}</h2>
          {result.wrongSkills.length ? (
            <ul>{result.wrongSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          ) : (
            <p>Ошибок нет — отличный контроль базовых навыков.</p>
          )}
        </section>

        {wrongQuestions.length > 0 && (
          <section className="mistakes-review">
            <button className="secondary-button" onClick={() => setReviewOpen(!reviewOpen)}>
              {reviewOpen ? 'Скрыть разбор' : 'Review Mistakes'}
            </button>
            {reviewOpen && (
              <div className="mistake-list">
                {wrongQuestions.map((question, index) => (
                  <article key={question.id}>
                    <span>Question {index + 1} · {question.skill}</span>
                    <h3>{question.question}</h3>
                    {question.formula && <MathFormula>{question.formula}</MathFormula>}
                    <p className="your-answer">Ваш ответ: <strong>{result.attempts.find((item) => item.questionId === question.id)?.answer || '—'}</strong></p>
                    <SolutionSteps steps={question.solution} explanation={question.explanation} />
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="result-actions">
          <button className="secondary-button" onClick={() => navigate('/week-1/final-test')}>
            <Rotate /> Пройти ещё раз
          </button>
          <button className="primary-button" onClick={() => navigate('/week-1')}>
            Вернуться на дашборд
          </button>
        </div>
      </div>
    </div>
  )
}
