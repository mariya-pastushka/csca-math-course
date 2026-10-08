import { useEffect, useState } from 'react'
import MathFormula from './MathFormula'
import MathAnswerInput from './MathAnswerInput'
import MathVisual from './MathVisual'
import { Check, Close } from './Icons'
import { SolutionReveal } from './LearningCards'
import { isCorrectAnswer } from '../utils/answers'

export { isCorrectAnswer }

export default function QuestionCard({
  question,
  value,
  onChange,
  checked,
  correct,
  solutionOpen,
  onToggleSolution,
  onCheck,
  serious = false,
  hideFeedback = false,
  showSkill = true,
}) {
  const [translationOpen, setTranslationOpen] = useState(false)

  useEffect(() => {
    setTranslationOpen(false)
  }, [question.id])

  return (
    <article className={'question-card ' + (serious ? 'question-serious ' : '') + (checked ? (correct ? 'is-correct' : 'is-incorrect') : '')}>
      <div className="question-label">
        <span>{question.difficulty}</span>
        {showSkill && <small>{question.skill}</small>}
      </div>
      <div className="question-prompt-row">
        <h2>{question.question}</h2>
        {question.translationRu && (
          <button
            type="button"
            className={'translation-toggle ' + (translationOpen ? 'is-open' : '')}
            aria-expanded={translationOpen}
            onClick={() => setTranslationOpen((open) => !open)}
          >
            {translationOpen ? 'Скрыть перевод' : 'Перевод'}
          </button>
        )}
      </div>
      {question.translationRu && translationOpen && (
        <div className="question-translation">
          <span>Русский перевод</span>
          <p>{question.translationRu}</p>
          {question.optionTranslationsRu && question.options && (
            <div className="translated-options">
              {question.options.map((option, index) => (
                <small key={option}>
                  <strong>{String.fromCharCode(65 + index)})</strong> {question.optionTranslationsRu[option]}
                </small>
              ))}
            </div>
          )}
        </div>
      )}
      {question.formula && <MathFormula className="question-formula">{question.formula}</MathFormula>}
      {question.visual && <MathVisual visual={question.visual} />}

      {question.type === 'choice' || question.type === 'multi-choice' ? (
        <div className="answer-options">
          {question.options.map((option, index) => (
            <label className={'answer-option ' + ((question.type === 'multi-choice' ? Array.isArray(value) && value.includes(option) : value === option) ? 'is-selected' : '')} key={option}>
              <input
                type={question.type === 'multi-choice' ? 'checkbox' : 'radio'}
                name={question.id}
                value={option}
                checked={question.type === 'multi-choice' ? Array.isArray(value) && value.includes(option) : value === option}
                onChange={() => {
                  if (checked) return
                  if (question.type !== 'multi-choice') return onChange(option)
                  const selected = Array.isArray(value) ? value : []
                  onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])
                }}
                disabled={checked}
              />
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <MathAnswerInput
          id={'answer-' + question.id}
          value={value || ''}
          onChange={onChange}
          disabled={checked}
          kind={question.answerKind}
        />
      )}

      {!hideFeedback && checked && (
        <div className={'answer-feedback ' + (correct ? 'feedback-correct' : 'feedback-incorrect')}>
          {correct ? <Check /> : <Close />}
          <div>
            <strong>{correct ? 'Верно!' : 'Пока неверно'}</strong>
            <span>{question.feedbackExplanation || (correct ? 'Отлично, правило применено правильно.' : 'Это нормальная часть обучения. Разберите решение по шагам.')}</span>
            {question.feedbackExplanation && <span className="correct-answer-text">Правильный ответ: {Array.isArray(question.answer) ? question.answer.join('; ') : question.answer}</span>}
          </div>
        </div>
      )}

      {!checked && onCheck && (
        <button className="check-button" onClick={onCheck} disabled={value === undefined || value === '' || (Array.isArray(value) && value.length === 0)}>
          Проверить ответ
        </button>
      )}

      {!hideFeedback && checked && (
        <SolutionReveal
          solution={question.solution}
          explanation={question.explanation}
          open={solutionOpen}
          onToggle={onToggleSolution}
        />
      )}
    </article>
  )
}

export const shuffle = (items) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const prepareQuestions = (questions, shuffleOrder = false) => {
  const source = shuffleOrder ? shuffle(questions) : [...questions]
  return source.map((item) => ({
    ...item,
    options: item.options ? shuffle(item.options) : undefined,
  }))
}
