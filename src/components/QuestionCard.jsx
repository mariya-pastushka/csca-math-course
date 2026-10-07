import MathFormula from './MathFormula'
import MathAnswerInput from './MathAnswerInput'
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
}) {
  return (
    <article className={'question-card ' + (serious ? 'question-serious ' : '') + (checked ? (correct ? 'is-correct' : 'is-incorrect') : '')}>
      <div className="question-label">
        <span>{question.difficulty}</span>
        <small>{question.skill}</small>
      </div>
      <h2>{question.question}</h2>
      {question.formula && <MathFormula className="question-formula">{question.formula}</MathFormula>}

      {question.type === 'choice' ? (
        <div className="answer-options">
          {question.options.map((option, index) => (
            <label className={'answer-option ' + (value === option ? 'is-selected' : '')} key={option}>
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={() => !checked && onChange(option)}
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
        />
      )}

      {!hideFeedback && checked && (
        <div className={'answer-feedback ' + (correct ? 'feedback-correct' : 'feedback-incorrect')}>
          {correct ? <Check /> : <Close />}
          <div>
            <strong>{correct ? 'Верно!' : 'Пока неверно'}</strong>
            <span>{correct ? 'Отлично, правило применено правильно.' : 'Это нормальная часть обучения. Разберите решение по шагам.'}</span>
          </div>
        </div>
      )}

      {!checked && onCheck && (
        <button className="check-button" onClick={onCheck} disabled={value === undefined || value === ''}>
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
