import MathFormula from './MathFormula'
import { ChevronDown } from './Icons'
import MathVisual from './MathVisual'

export function VocabularyCard({ item }) {
  return (
    <article className="vocabulary-card">
      <div>
        <span>{item.term}</span>
        <strong>{item.translation}</strong>
      </div>
      <p>{item.explanation}</p>
    </article>
  )
}

export function RuleCard({ item, index }) {
  return (
    <article className="rule-card">
      <span className="card-index">0{index + 1}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      {item.formula && <MathFormula>{item.formula}</MathFormula>}
      {item.cue && <div className="rule-cue">{item.cue}</div>}
    </article>
  )
}

export function TheoryCard({ item }) {
  return (
    <article className="theory-card">
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      {item.formula && <MathFormula>{item.formula}</MathFormula>}
    </article>
  )
}

export function MiniExample({ item, index }) {
  return (
    <article className="mini-example">
      <span className="mini-number">{String(index + 1).padStart(2, '0')}</span>
      <MathFormula>{item.expression}</MathFormula>
      <div className="mini-answer">
        <span>Ответ</span>
        <MathFormula inline>{item.answer}</MathFormula>
      </div>
      <p>{item.note}</p>
    </article>
  )
}

export function SolutionSteps({ steps, explanation, answer }) {
  return (
    <div className="solution-steps">
      {steps.map((item, index) => (
        <div className="solution-step" key={item.title + index}>
          <span>{index + 1}</span>
          <div>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
            {item.formula && <MathFormula>{item.formula}</MathFormula>}
          </div>
        </div>
      ))}
      {(explanation || answer) && (
        <div className="solution-answer">
          <span>Ответ</span>
          {answer ? <MathFormula inline>{answer}</MathFormula> : <strong>{explanation}</strong>}
        </div>
      )}
    </div>
  )
}

export function WorkedExample({ item, index }) {
  return (
    <article className="worked-example">
      <header>
        <div>
          <span>Пример {index + 1}</span>
          <small>{item.level}</small>
        </div>
        <span className="difficulty">{item.level}</span>
      </header>
      <div className="worked-problem">
        <span>Задание</span>
        {item.prompt && <p>{item.prompt}</p>}
        <MathFormula>{item.problem}</MathFormula>
        {item.visual && <MathVisual visual={item.visual} />}
      </div>
      <SolutionSteps steps={item.steps} answer={item.answer} />
    </article>
  )
}

export function SolutionReveal({ solution, explanation, open, onToggle }) {
  return (
    <div className={'solution-reveal ' + (open ? 'is-open' : '')}>
      <button onClick={onToggle}>
        <span>{open ? 'Скрыть решение' : 'Показать решение'}</span>
        <ChevronDown />
      </button>
      <div className="solution-reveal-body" aria-hidden={!open}>
        <div>
          <h4>Решение</h4>
          <SolutionSteps steps={solution} explanation={explanation} />
        </div>
      </div>
    </div>
  )
}
