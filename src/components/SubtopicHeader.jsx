import { ArrowRight, Check } from './Icons'

const stages = [
  ['theory', 'Теория'],
  ['examples', 'Примеры'],
  ['practice', 'Практика'],
  ['homework', 'Домашняя работа'],
  ['result', 'Результат'],
]

export default function SubtopicHeader({ topic, stage, navigate, progress, onSkip }) {
  return (
    <header className="subtopic-header">
      <div className="breadcrumbs">
        <button onClick={() => navigate('/week-1')}>Week 1</button>
        <span>/</span>
        <span>Урок {topic.lesson.number}</span>
        <span>/</span>
        <strong>{topic.titleRu}</strong>
      </div>
      <div className="subtopic-header-actions">
        <div className="subtopic-stage-nav">
          {stages.map(([stageId, label], index) => {
            const complete = stageId === 'result'
              ? Boolean(progress.scores[topic.id])
              : Boolean(progress.completed[topic.id + ':' + stageId])
            const skipped = stageId !== 'result' && Boolean(progress.skipped?.[topic.id + ':' + stageId])
            return (
              <button
                key={stageId}
                className={stage === stageId ? 'is-active' : ''}
                onClick={() => navigate('/week-1/' + topic.id + '/' + stageId)}
                disabled={stageId === 'result' && !progress.scores[topic.id]}
              >
                <span className={skipped ? 'is-skipped' : ''} title={skipped ? 'Пропущено — можно вернуться' : complete ? 'Выполнено' : ''}>
                  {skipped ? '↷' : complete ? <Check size={13} /> : index + 1}
                </span>
                {label}
              </button>
            )
          })}
        </div>
        {onSkip && (
          <button className="stage-skip-button" onClick={onSkip}>
            Пропустить этап <ArrowRight size={16} />
          </button>
        )}
      </div>
    </header>
  )
}
