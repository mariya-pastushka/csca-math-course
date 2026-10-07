import { useState } from 'react'
import { getNextSubtopic } from '../data/week1'
import { Check, Close, Rotate, ArrowRight } from '../components/Icons'
import { SolutionSteps } from '../components/LearningCards'
import MathFormula from '../components/MathFormula'
import SubtopicHeader from '../components/SubtopicHeader'

const feedbackFor = (percentage) => {
  if (percentage >= 90) return { title: 'Excellent', text: 'Отличная работа! Вы уверенно владеете этой подтемой.' }
  if (percentage >= 70) return { title: 'Good job', text: 'Хороший результат. Разберите ошибки — и навык станет ещё устойчивее.' }
  if (percentage >= 50) return { title: 'Review the topic', text: 'Основа уже есть, но стоит повторить отмеченные правила.' }
  return { title: 'Let’s study this topic again', text: 'Вернитесь к теории и примерам. После повторения тест станет заметно легче.' }
}

export default function HomeworkResultPage({ topic, navigate, progress }) {
  const [reviewOpen, setReviewOpen] = useState(false)
  const result = progress.scores[topic.id]

  if (!result) {
    return (
      <div className="content-page result-page">
        <SubtopicHeader topic={topic} stage="result" navigate={navigate} progress={progress} />
        <div className="lesson-container narrow-container empty-result">
          <span>Результат ещё не создан</span>
          <h1>Сначала завершите домашнюю работу.</h1>
          <button className="primary-button" onClick={() => navigate('/week-1/' + topic.id + '/homework')}>
            Перейти к тесту <ArrowRight />
          </button>
        </div>
      </div>
    )
  }

  const percentage = Math.round((result.score / result.total) * 100)
  const feedback = feedbackFor(percentage)
  const nextTopic = getNextSubtopic(topic.id)
  const wrongQuestions = topic.homeworkQuestions.filter((item) => result.wrongQuestionIds.includes(item.id))

  return (
    <div className="content-page result-page">
      <SubtopicHeader topic={topic} stage="result" navigate={navigate} progress={progress} />
      <div className="lesson-container result-container">
        <section className="result-hero">
          <span className="result-kicker">Homework Complete</span>
          <div className="score-ring" style={{ '--score': percentage + '%' }}>
            <div>
              <strong>{result.score}<small>/{result.total}</small></strong>
              <span>{percentage}%</span>
            </div>
          </div>
          <h1>{feedback.title}</h1>
          <p>{feedback.text}</p>
        </section>

        <div className="result-stats">
          <div><Check /><span>Верно<strong>{result.score}</strong></span></div>
          <div><Close /><span>Неверно<strong>{result.total - result.score}</strong></span></div>
          <div><span className="percent-icon">%</span><span>Результат<strong>{percentage}%</strong></span></div>
        </div>

        <section className="review-topics">
          <span>Topics to review</span>
          <h2>{result.wrongSkills.length ? 'Что стоит повторить' : 'Тем для повторения нет'}</h2>
          {result.wrongSkills.length ? (
            <ul>{result.wrongSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          ) : (
            <p>Все задания решены правильно. Можно переходить к следующей подтеме.</p>
          )}
        </section>

        {wrongQuestions.length > 0 && (
          <section className="mistakes-review">
            <button className="secondary-button" onClick={() => setReviewOpen(!reviewOpen)}>
              {reviewOpen ? 'Скрыть ошибки' : 'Разобрать ошибки'}
            </button>
            {reviewOpen && (
              <div className="mistake-list">
                {wrongQuestions.map((question, index) => (
                  <article key={question.id}>
                    <span>Ошибка {index + 1} · {question.skill}</span>
                    <h3>{question.question}</h3>
                    {question.formula && <MathFormula>{question.formula}</MathFormula>}
                    <SolutionSteps steps={question.solution} explanation={question.explanation} />
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="result-actions">
          <button className="secondary-button" onClick={() => navigate('/week-1/' + topic.id + '/homework')}>
            <Rotate /> Попробовать снова
          </button>
          <button className="primary-button" onClick={() => navigate(nextTopic ? '/week-1/' + nextTopic.id + '/theory' : '/week-1/final-test')}>
            {nextTopic ? 'Следующая подтема' : 'Перейти к Week 1 Test'} <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}
