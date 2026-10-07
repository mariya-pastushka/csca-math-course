import { week1 } from '../data/week1'
import { ArrowRight, Book, Check, Flag } from '../components/Icons'
import ProgressBar from '../components/ProgressBar'
import Footer from '../components/Footer'
import { PageHeading } from '../components/PageElements'

export default function WeekOverviewPage({ navigate, progress, progressPercent }) {
  const stageOrder = ['theory', 'examples', 'practice', 'homework']
  const resumeTarget = week1.lessons
    .flatMap((lesson) => lesson.subtopics)
    .flatMap((topic) => stageOrder.map((stage) => ({ topic, stage })))
    .find(({ topic, stage }) => !progress.completed[topic.id + ':' + stage])
  const resumePath = resumeTarget
    ? '/week-1/' + resumeTarget.topic.id + '/' + resumeTarget.stage
    : '/week-1/final-test'

  const lessonPercent = (lesson) => {
    const total = lesson.subtopics.length * 4
    const done = lesson.subtopics.reduce((count, topic) => (
      count + ['theory', 'examples', 'practice', 'homework'].filter((stage) => progress.completed[topic.id + ':' + stage]).length
    ), 0)
    return Math.round((done / total) * 100)
  }

  return (
    <div className="content-page dashboard-page">
      <div className="content-container">
        <PageHeading
          eyebrow="Week 1 · Дашборд"
          title="Базовая арифметика и навыки работы с числами"
          subtitle="Вы пройдёте путь от чисел со знаками до процентов. Каждая подтема разбита на короткие понятные этапы."
          meta="13 подтем · 15 тестовых заданий"
        />

        <div className="overview-progress-card">
          <div>
            <span className="overview-kicker">Ваш прогресс</span>
            <strong>{progressPercent}%</strong>
          </div>
          <ProgressBar value={progressPercent} />
          <button onClick={() => navigate(resumePath)}>
            {progressPercent ? 'Продолжить обучение' : 'Начать Week 1'}
            <ArrowRight size={18} />
          </button>
        </div>

        <section className="lesson-list">
          {week1.lessons.map((lesson) => {
            const percent = lessonPercent(lesson)
            const lessonResumeTarget = lesson.subtopics
              .flatMap((topic) => stageOrder.map((stage) => ({ topic, stage })))
              .find(({ topic, stage }) => !progress.completed[topic.id + ':' + stage])
            const lessonPath = lessonResumeTarget
              ? '/week-1/' + lessonResumeTarget.topic.id + '/' + lessonResumeTarget.stage
              : '/week-1/' + lesson.subtopics[0].id + '/theory'
            return (
              <article className="lesson-card" key={lesson.id}>
                <div className="lesson-card-top">
                  <span className="lesson-card-number">0{lesson.number}</span>
                  <div className="lesson-card-title">
                    <span>Урок {lesson.number}</span>
                    <h2>
                      <button className="lesson-title-button" onClick={() => navigate('/week-1/' + lesson.subtopics[0].id + '/theory')}>
                        {lesson.titleRu}
                      </button>
                    </h2>
                    <p>{lesson.description}</p>
                  </div>
                  <div className="lesson-percentage">{percent}%</div>
                </div>

                <div className="lesson-subtopics">
                  {lesson.subtopics.map((topic, index) => {
                    const done = stageOrder.every((stage) => Boolean(progress.completed[topic.id + ':' + stage]))
                    return (
                      <button key={topic.id} onClick={() => navigate('/week-1/' + topic.id + '/theory')}>
                        <span className={'subtopic-number ' + (done ? 'is-done' : '')}>{done ? <Check size={15} /> : index + 1}</span>
                        <span>
                          <small>{topic.title}</small>
                          {topic.titleRu}
                        </span>
                        <ArrowRight size={17} />
                      </button>
                    )
                  })}
                </div>

                <div className="lesson-card-footer">
                  <ProgressBar value={percent} compact />
                  <button onClick={() => navigate(lessonPath)}>
                    <Book size={18} />
                    {percent === 100 ? 'Повторить урок' : percent ? 'Продолжить' : 'Начать урок'}
                  </button>
                </div>
              </article>
            )
          })}
        </section>

        <section className="final-test-card">
          <div className="final-test-icon"><Flag size={27} /></div>
          <div>
            <span>ИТОГОВАЯ ПРОВЕРКА</span>
            <h2>Week 1 Test</h2>
            <p>15 смешанных заданий без подсказки о методе. Именно так проверяется готовность применять знания на экзамене.</p>
          </div>
          <button onClick={() => navigate('/week-1/final-test')}>
            {progress.finalResult ? 'Пройти ещё раз' : 'Начать тест'}
            <ArrowRight size={18} />
          </button>
        </section>

        <Footer staticMode />
      </div>
    </div>
  )
}
