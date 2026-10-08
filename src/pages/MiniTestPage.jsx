import { useState } from 'react'
import QuestionCard, { isCorrectAnswer, prepareQuestions } from '../components/QuestionCard'
import { PageHeading } from '../components/PageElements'
import ProgressBar from '../components/ProgressBar'
import { SolutionSteps } from '../components/LearningCards'
import MathFormula from '../components/MathFormula'
import { ArrowLeft, ArrowRight, Check, Close, Rotate } from '../components/Icons'

const feedback = (score) => score === 8 ? 'Отлично' : score >= 6 ? 'Хорошо' : score >= 4 ? 'Нужно повторить несколько пунктов' : 'Рекомендуется пройти лекцию ещё раз'

export default function MiniTestPage({ title, questions: sourceQuestions, navigate, backPath, lecturePath, onFinish, savedResult, topicNumber = 1, resultMessages }) {
  const [questions, setQuestions] = useState(() => prepareQuestions(sourceQuestions))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(savedResult || null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const answeredCount = questions.filter((item) => answers[item.id] !== undefined && answers[item.id] !== '').length
  const current = questions[index]
  const canFinish = answeredCount === questions.length

  const finish = () => {
    if (!canFinish) return
    const attempts = questions.map((item) => ({ questionId: item.id, answer: answers[item.id], correct: isCorrectAnswer(answers[item.id], item.answer, item.answerKind), skill: item.skill }))
    const nextResult = { score: attempts.filter((item) => item.correct).length, total: questions.length, attempts, wrongSkills: [...new Set(attempts.filter((item) => !item.correct).map((item) => item.skill))] }
    setResult(nextResult)
    onFinish(nextResult)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const retry = () => {
    setQuestions(prepareQuestions(sourceQuestions, true))
    setAnswers({})
    setIndex(0)
    setResult(null)
    setReviewOpen(false)
  }

  if (result) {
    const percentage = Math.round(result.score / result.total * 100)
    const wrong = sourceQuestions.filter((item) => result.attempts.some((attempt) => attempt.questionId === item.id && !attempt.correct))
    return <div className="content-page final-result-page"><div className="test-container">
      <section className="final-result-hero"><span>{title} · Результат</span><h1>{result.score} <small>/ {result.total}</small></h1><div className="final-percentage">{percentage}%</div><h2>{resultMessages ? resultMessages[result.score === 8 ? 'excellent' : result.score >= 6 ? 'good' : result.score >= 4 ? 'review' : 'restart'] : feedback(result.score)}</h2><p>{result.wrongSkills.length ? 'Посмотрите, какие навыки стоит повторить, и разберите ошибки по шагам.' : (resultMessages ? 'Все восемь заданий решены верно.' : 'Вы уверенно применяете уравнения и системы к разным условиям.')}</p></section>
      <div className="result-stats"><div><Check /><span>Верно<strong>{result.score}</strong></span></div><div><Close /><span>Ошибки<strong>{result.total - result.score}</strong></span></div><div><span className="percent-icon">%</span><span>Результат<strong>{percentage}%</strong></span></div></div>
      <section className="review-topics"><span>Что повторить</span><h2>{result.wrongSkills.length ? 'Вернитесь к этим навыкам' : 'Все задания решены верно'}</h2>{result.wrongSkills.length > 0 && <ul>{result.wrongSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>}</section>
      {wrong.length > 0 && <section className="mistakes-review"><button className="secondary-button" onClick={() => setReviewOpen((open) => !open)}>{reviewOpen ? 'Скрыть решения' : 'Разобрать ошибки'}</button>{reviewOpen && <div className="mistake-list">{wrong.map((item) => <article key={item.id}><h3>{item.question}</h3>{item.formula && <MathFormula>{item.formula}</MathFormula>}<p className="your-answer">Ваш ответ: <strong>{result.attempts.find((attempt) => attempt.questionId === item.id)?.answer}</strong></p><SolutionSteps steps={item.solution} explanation={item.explanation} /></article>)}</div>}</section>}
      <div className="result-actions"><button className="secondary-button" onClick={retry}><Rotate /> Пройти ещё раз</button><button className="secondary-button" onClick={() => navigate(lecturePath)}>Повторить лекцию</button><button className="primary-button" onClick={() => navigate(backPath)}>Вернуться к теме</button></div>
    </div></div>
  }

  return <div className="content-page final-test-page">
    <header className="test-header"><button onClick={() => navigate(backPath)}><ArrowLeft /> Topic {topicNumber}</button><div><span>{title}</span></div><strong>{answeredCount} / {questions.length}</strong></header>
    <div className="test-container"><PageHeading eyebrow={'Week 2 · Итог Topic ' + topicNumber} title={title} subtitle="8 смешанных заданий. Во время теста решения скрыты; разбор ошибок появится после завершения." />
      <div className="test-progress"><div><span>Вопрос {index + 1} из {questions.length}</span><span>Ответов: {answeredCount}</span></div><ProgressBar value={answeredCount / questions.length * 100} /></div>
      <div className="test-question-dots">{questions.map((item, i) => <button key={item.id} className={(index === i ? 'is-current ' : '') + (answers[item.id] !== undefined ? 'is-answered' : '')} onClick={() => setIndex(i)} aria-label={'Вопрос ' + (i + 1)}>{i + 1}</button>)}</div>
      <QuestionCard question={current} serious hideFeedback showSkill={false} value={answers[current.id]} onChange={(value) => setAnswers((previous) => ({ ...previous, [current.id]: value }))} checked={false} />
      <div className="test-navigation"><button className="text-button" onClick={() => setIndex((previous) => previous - 1)} disabled={index === 0}><ArrowLeft /> Предыдущий</button>{index < questions.length - 1 ? <button className="primary-button" onClick={() => setIndex((previous) => previous + 1)}>Следующий <ArrowRight /></button> : <button className="primary-button" onClick={finish} disabled={!canFinish}>Показать результат <ArrowRight /></button>}</div>
      {!canFinish && index === questions.length - 1 && <p className="test-hint">Ответьте на все 8 заданий. К любому вопросу можно вернуться по его номеру.</p>}
    </div>
  </div>
}
