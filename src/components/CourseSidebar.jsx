import { useEffect, useMemo, useState } from 'react'
import { week1 } from '../data/week1'
import Brand from './Brand'
import ProgressBar from './ProgressBar'
import { Check, Close, Flag } from './Icons'

const stages = [
  ['theory', 'Теория'],
  ['examples', 'Примеры'],
  ['practice', 'Практика'],
  ['homework', 'Домашняя работа'],
]

export default function CourseSidebar({
  navigate,
  currentPath,
  progress,
  progressPercent,
  mobileOpen,
  onClose,
}) {
  const activeTopic = useMemo(
    () => week1.lessons.flatMap((lesson) => lesson.subtopics).find((item) => currentPath.includes('/' + item.id + '/')),
    [currentPath],
  )
  const [openLessons, setOpenLessons] = useState({ 'lesson-1': true })
  const [openTopics, setOpenTopics] = useState({})

  useEffect(() => {
    if (!activeTopic) return
    setOpenLessons({ [activeTopic.lessonId]: true })
    setOpenTopics({ [activeTopic.id]: true })
  }, [activeTopic])

  const go = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      <button className={'sidebar-overlay ' + (mobileOpen ? 'is-visible' : '')} aria-label="Закрыть меню" aria-hidden={!mobileOpen} tabIndex={mobileOpen ? 0 : -1} onClick={onClose} />
      <aside className={'course-sidebar ' + (mobileOpen ? 'is-open' : '')}>
        <div className="sidebar-head">
          <Brand navigate={navigate} compact />
          <button className="sidebar-close" onClick={onClose} aria-label="Закрыть меню"><Close size={20} /></button>
        </div>

        <button className={'sidebar-dashboard ' + (currentPath === '/week-1' ? 'is-active' : '')} onClick={() => go('/week-1')}>
          <span className="sidebar-icon">⌂</span>
          Дашборд
        </button>

        <div className="sidebar-progress">
          <ProgressBar value={progressPercent} label="Прогресс Week 1" compact />
        </div>

        <div className="sidebar-scroll">
          {week1.lessons.map((lesson) => (
            <details
              className="sidebar-lesson"
              key={lesson.id}
              open={Boolean(openLessons[lesson.id])}
            >
              <summary onClick={(event) => {
                event.preventDefault()
                go('/week-1/' + lesson.subtopics[0].id + '/theory')
              }}>
                <span className="lesson-number">{lesson.number}</span>
                <span>
                  <small>Урок {lesson.number}</small>
                  {lesson.titleRu}
                </span>
              </summary>

              <div className="sidebar-topics">
                {lesson.subtopics.map((subtopic) => {
                  const isCurrent = currentPath.includes('/' + subtopic.id + '/')
                  const done = stages.every(([stage]) => Boolean(progress.completed[subtopic.id + ':' + stage]))
                  return (
                    <details
                      className="sidebar-topic"
                      key={subtopic.id}
                      open={Boolean(openTopics[subtopic.id])}
                    >
                      <summary className={isCurrent ? 'is-current' : ''} onClick={(event) => {
                        event.preventDefault()
                        go('/week-1/' + subtopic.id + '/theory')
                      }}>
                        <span className={'topic-status ' + (done ? 'is-done' : '')}>{done ? <Check size={13} /> : subtopic.number}</span>
                        <span>{subtopic.titleRu}</span>
                      </summary>
                      <div className="sidebar-stages">
                        {stages.map(([stage, label]) => {
                          const href = '/week-1/' + subtopic.id + '/' + stage
                          const complete = Boolean(progress.completed[subtopic.id + ':' + stage])
                          const skipped = Boolean(progress.skipped?.[subtopic.id + ':' + stage])
                          return (
                            <button key={stage} className={currentPath === href ? 'is-active' : ''} onClick={() => go(href)}>
                              <span
                                className={'stage-dot ' + (complete ? 'is-complete ' : '') + (skipped ? 'is-skipped' : '')}
                                title={skipped ? 'Пропущено — можно вернуться' : complete ? 'Выполнено' : ''}
                              >
                                {skipped ? '↷' : complete ? <Check size={11} /> : ''}
                              </span>
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </details>
                  )
                })}
              </div>
            </details>
          ))}

          <button className={'sidebar-final ' + (currentPath.includes('/final') ? 'is-active ' : '') + ((progress.finalResult || progress.finalSkipped) ? 'is-complete' : '')} onClick={() => go('/week-1/final-test')}>
            <Flag size={18} />
            <span>
              <small>Итог</small>
              Week 1 Test
            </span>
            {progress.finalResult && <span className="final-score">{progress.finalResult.score}/15</span>}
            {!progress.finalResult && progress.finalSkipped && <span className="final-score">↷</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
