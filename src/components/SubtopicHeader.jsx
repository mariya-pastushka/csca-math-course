import { ArrowRight, Check } from './Icons'

const stages = [
  ['theory', 'Теория'],
  ['examples', 'Примеры'],
  ['practice', 'Практика'],
  ['homework', 'Домашняя работа'],
  ['result', 'Результат'],
]

export default function SubtopicHeader({ topic, stage, navigate, progress, onSkip, weekId = 'week-1', stageConfig = stages, stagePaths = {}, stageProgressKeys = {} }) {
  return (
    <header className="subtopic-header">
      <div className="breadcrumbs">
        <button onClick={() => navigate('/' + weekId)}>{weekId === 'week-1' ? 'Week 1' : 'Week 2'}</button>
        <span>/</span>
        <span>{weekId === 'week-1' ? 'Урок' : 'Тема'} {topic.lesson.number}</span>
        <span>/</span>
        <strong>{topic.titleRu}</strong>
      </div>
      <div className="subtopic-header-actions">
        <div className="subtopic-stage-nav">
          {stageConfig.map(([stageId, label], index) => {
            const complete = stageId === 'result'
              ? Boolean(progress.scores[topic.id])
              : Boolean(progress.completed[stageProgressKeys[stageId] || topic.id + ':' + stageId])
            const skipped = stageId !== 'result' && Boolean(progress.skipped?.[topic.id + ':' + stageId])
            return (
              <button
                key={stageId}
                className={stage === stageId ? 'is-active' : ''}
                onClick={() => navigate(stagePaths[stageId] || '/' + weekId + '/' + topic.id + '/' + stageId)}
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
