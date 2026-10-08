import { useEffect, useMemo, useState } from 'react'
import { week1 } from '../data/week1'
import Brand from './Brand'
import ProgressBar from './ProgressBar'
import WeekSelector from './WeekSelector'
import { ArrowLeft, Board, Check, Close, Flag } from './Icons'

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
  collapsed = false,
  onCollapse,
  week = week1,
}) {
  const stageItems = week.stages || stages
  const activeWeek2Topic = week.number === 2 ? week.lessons.find((item) => item.id === (week.activeTopicId || 'topic-1')) : null
  const activeTestResult = activeWeek2Topic ? progress.testResults?.[activeWeek2Topic.id] || (activeWeek2Topic.number === 1 ? progress.miniTestResult : null) : null
  const rootPath = '/' + week.id
  const stageKey = (subtopic, stage) => (week.number === 2 && stage !== 'lecture' ? subtopic.lessonId : subtopic.id) + ':' + stage
  const stagePath = (subtopic, stage) => rootPath + '/' + (week.number === 2 && stage !== 'lecture' ? subtopic.lessonId : subtopic.id) + '/' + stage
  const activeTopic = useMemo(
    () => week.lessons.flatMap((lesson) => lesson.subtopics).find((item) => currentPath.includes('/' + item.id + '/')),
    [currentPath, week],
  )
  const [openLessons, setOpenLessons] = useState({ [week.lessons[0].id]: true })
  const [openTopics, setOpenTopics] = useState({})

  useEffect(() => {
    if (!activeTopic) {
      if (week.number === 2) {
        const activeLesson = week.lessons.find((lesson) => currentPath.includes('/' + lesson.id))
        if (activeLesson) setOpenLessons({ [activeLesson.id]: true })
      }
      return
    }
    setOpenLessons({ [activeTopic.lessonId]: true })
    setOpenTopics({ [activeTopic.id]: true })
  }, [activeTopic, currentPath, week])

  const go = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      <button className={'sidebar-overlay ' + (mobileOpen ? 'is-visible' : '')} aria-label="Закрыть меню" aria-hidden={!mobileOpen} tabIndex={mobileOpen ? 0 : -1} onClick={onClose} />
      <aside className={'course-sidebar ' + (mobileOpen ? 'is-open' : '')} inert={collapsed && !mobileOpen ? true : undefined}>
        <div className="sidebar-head">
          <Brand navigate={navigate} compact />
          <button className="sidebar-collapse" onClick={onCollapse} aria-label="Скрыть боковую панель" title="Скрыть боковую панель" aria-expanded={true}><ArrowLeft size={18} /></button>
          <button className="sidebar-close" onClick={onClose} aria-label="Закрыть меню"><Close size={20} /></button>
        </div>

        <WeekSelector navigate={go} currentWeek={week.number} />

        <button className={'sidebar-dashboard ' + (currentPath === rootPath ? 'is-active' : '')} onClick={() => go(rootPath)}>
          <span className="sidebar-icon">⌂</span>
          Дашборд
        </button>

        <div className="sidebar-progress">
          <ProgressBar value={progressPercent} label={week.progressLabel || 'Прогресс Week 1'} compact />
        </div>

        <a
          className="sidebar-whiteboard"
          href="/week-1/whiteboard"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <Board size={18} />
          <span>Интерактивная доска</span>
          <span aria-hidden="true">→</span>
        </a>

        <div className="sidebar-scroll">
          {week.lessons.map((lesson) => (
            <details
              className="sidebar-lesson"
              key={lesson.id}
              open={Boolean(openLessons[lesson.id])}
            >
              <summary onClick={(event) => {
                event.preventDefault()
                go(week.number === 2 ? rootPath + '/' + lesson.id : rootPath + '/' + lesson.subtopics[0].id + '/theory')
              }}>
                <span className="lesson-number">{lesson.number}</span>
                <span>
                  <small>{week.number === 2 ? 'Тема' : 'Урок'} {lesson.number}</small>
                  {lesson.titleRu}
                </span>
              </summary>

              <div className="sidebar-topics">
                {lesson.subtopics.map((subtopic) => {
                  const isCurrent = currentPath.includes('/' + subtopic.id + '/')
                  const done = stageItems.every(([stage]) => Boolean(progress.completed[stageKey(subtopic, stage)]))
                  return (
                    <details
                      className="sidebar-topic"
                      key={subtopic.id}
                      open={Boolean(openTopics[subtopic.id])}
                    >
                      <summary className={isCurrent ? 'is-current' : ''} onClick={(event) => {
                        event.preventDefault()
                        go(rootPath + '/' + subtopic.id + (week.number === 2 ? '/lecture' : '/theory'))
                      }}>
                        <span className={'topic-status ' + (done ? 'is-done' : '')}>{done ? <Check size={13} /> : subtopic.number}</span>
                        <span>{subtopic.titleRu}</span>
                      </summary>
                      <div className="sidebar-stages">
                        {subtopic.available !== false && stageItems.map(([stage, label]) => {
                          const href = stagePath(subtopic, stage)
                          const complete = Boolean(progress.completed[stageKey(subtopic, stage)])
                          const skipped = Boolean(progress.skipped?.[stageKey(subtopic, stage)])
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

          {week.number === 1 ? <button className={'sidebar-final ' + (currentPath.includes('/final') ? 'is-active ' : '') + ((progress.finalResult || progress.finalSkipped) ? 'is-complete' : '')} onClick={() => go('/week-1/final-test')}>
            <Flag size={18} />
            <span>
              <small>Итог</small>
              Week 1 Test
            </span>
            {progress.finalResult && <span className="final-score">{progress.finalResult.score}/15</span>}
            {!progress.finalResult && progress.finalSkipped && <span className="final-score">↷</span>}
          </button> : <button className="sidebar-final" onClick={() => go('/week-2/' + activeWeek2Topic.id + '/mini-test')}>
            <Flag size={18} /><span><small>Topic {activeWeek2Topic.number} · Итог</small>Mini Test</span>
            {activeTestResult && <span className="final-score">{activeTestResult.score}/8</span>}
          </button>}
        </div>
      </aside>
    </>
  )
}
