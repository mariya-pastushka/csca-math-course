import { WorkedExample } from '../components/LearningCards'
import { LessonNavigation, PageHeading } from '../components/PageElements'
import SubtopicHeader from '../components/SubtopicHeader'

export default function WorkedExamplesPage({ topic, navigate, progress, onComplete }) {
  const nextPath = '/week-1/' + topic.id + '/practice'
  const complete = () => {
    onComplete(topic.id, 'examples')
    navigate(nextPath)
  }

  return (
    <div className="content-page lesson-content-page">
      <SubtopicHeader topic={topic} stage="examples" navigate={navigate} progress={progress} />
      <div className="lesson-container">
        <PageHeading
          eyebrow={'Урок ' + topic.lesson.number + ' · Подтема ' + topic.number + ' · Разобранные примеры'}
          title="Смотрим, как думает решающий"
          subtitle="Сложность растёт постепенно. В каждом шаге объяснено не только что делать, но и почему."
          meta={topic.titleRu}
        />

        <div className="example-sequence">
          {topic.workedExamples.map((item, index) => <WorkedExample item={item} index={index} key={item.problem} />)}
        </div>

        <LessonNavigation
          previous={{ path: '/week-1/' + topic.id + '/theory', label: 'Теория' }}
          next={{ path: nextPath, label: 'Практика' }}
          nextLabel="Продолжить к практике"
          navigate={navigate}
          onNext={complete}
        />
      </div>
    </div>
  )
}
