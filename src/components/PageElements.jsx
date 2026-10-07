import { ArrowLeft, ArrowRight } from './Icons'

export function PageHeading({ eyebrow, title, subtitle, meta }) {
  return (
    <header className="page-heading">
      <div className="page-eyebrow">
        <span>{eyebrow}</span>
        {meta && <span className="page-meta">{meta}</span>}
      </div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  )
}

export function LessonNavigation({ previous, next, nextLabel = 'Далее', navigate, onNext }) {
  return (
    <nav className="lesson-navigation" aria-label="Навигация по уроку">
      {previous ? (
        <button className="text-button" onClick={() => navigate(previous.path)}>
          <ArrowLeft size={18} />
          <span><small>Назад</small>{previous.label}</span>
        </button>
      ) : <span />}

      {next && (
        <button className="primary-button" onClick={onNext || (() => navigate(next.path))}>
          <span>{nextLabel || next.label}</span>
          <ArrowRight size={18} />
        </button>
      )}
    </nav>
  )
}

export function SectionTitle({ index, title, note }) {
  return (
    <div className="section-title">
      {index && <span>{index}</span>}
      <div>
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </div>
    </div>
  )
}
