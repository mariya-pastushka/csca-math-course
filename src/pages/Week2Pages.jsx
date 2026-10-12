import { week2, topic1 } from '../data/week2'
import { ArrowLeft, ArrowRight, Check, Flag } from '../components/Icons'
import { PageHeading, SectionTitle, LessonNavigation } from '../components/PageElements'
import { TheoryCard, RuleCard, WorkedExample } from '../components/LearningCards'
import MathFormula from '../components/MathFormula'
import ProgressBar from '../components/ProgressBar'
import SubtopicHeader from '../components/SubtopicHeader'
import VocabularyList from '../components/VocabularyList'
import Footer from '../components/Footer'
import MathVisual, { NotationTable } from '../components/MathVisual'
import TaskPrompt from '../components/TaskPrompt'

const root = '/week-2/topic-1'
export const topic1StagePaths = { lecture: '/week-2/linear-equations/lecture', examples: root + '/examples', practice: root + '/practice' }
export const getTopicStagePaths = (item) => ({ lecture: '/week-2/' + item.subtopics[0].id + '/lecture', examples: '/week-2/' + item.id + '/examples', practice: '/week-2/' + item.id + '/practice' })

// The existing pages accept a week configuration; Week 2 remains the default.
export function Week2OverviewPage({ navigate, progress, progressPercent, courseWeek = week2 }) {
  const firstTopicPath = '/' + courseWeek.id + '/' + courseWeek.lessons[0].id
  return (
    <div className="content-page dashboard-page"><div className="content-container">
      <PageHeading eyebrow={'Week ' + courseWeek.number + ' · Дашборд'} title={courseWeek.title} subtitle={courseWeek.description || 'Уравнения, множества и неравенства. Все три темы доступны: отдельные лекции, смешанные задания и Mini Test для каждой темы.'} meta={courseWeek.overviewMeta || '3 темы · 9 мини-тем'} />
      <div className="overview-progress-card">
        <div><span className="overview-kicker">Доступные темы · Ваш прогресс</span><strong>{progressPercent}%</strong></div>
        <ProgressBar value={progressPercent} />
        <button onClick={() => navigate(firstTopicPath)}>Открыть Topic 1 <ArrowRight size={18} /></button>
      </div>
      <section className="lesson-list">
        {courseWeek.lessons.map((item) => <article className="lesson-card" key={item.id}>
          <div className="lesson-card-top">
            <span className="lesson-card-number">0{item.number}</span>
            <div className="lesson-card-title"><span>Topic {item.number} · {courseWeek.subtopicStages ? item.title + ' · ' : ''}{item.subtopics.length} мини-темы</span><h2><button className="lesson-title-button" onClick={() => navigate('/' + courseWeek.id + '/' + item.id)}>{item.titleRu}</button></h2><p>{item.description}</p></div>
            <span className="week2-status">{item.available ? 'Доступно' : 'Структура'}</span>
          </div>
          <div className="week2-card-footer"><span>{item.available ? 'Lecture → Examples → Practice → Mini Test' : 'Подробные уроки будут добавлены позже'}</span><button className="secondary-button" onClick={() => navigate('/' + courseWeek.id + '/' + item.id)}>Открыть тему <ArrowRight size={16} /></button></div>
        </article>)}
      </section>
      <Footer staticMode />
    </div></div>
  )
}

export function Week2TopicPage({ item, navigate, progress, courseWeek = week2 }) {
  const root = '/' + courseWeek.id + '/' + item.id
  const perSubtopic = courseWeek.subtopicStages
  const stagePaths = perSubtopic ? {lecture: '/' + courseWeek.id + '/' + item.subtopics[0].id + '/lecture'} : getTopicStagePaths(item)
  return (
    <div className="content-page"><div className="content-container">
      <button className="stage-back-link" onClick={() => navigate('/' + courseWeek.id)}><ArrowLeft size={16} /> Week {courseWeek.number}</button>
      <PageHeading eyebrow={'Week ' + courseWeek.number + ' · Topic ' + item.number} title={item.titleRu} subtitle={item.description} meta={perSubtopic ? item.title : '3 мини-темы'} />
      {item.available && <div className="learning-intro"><span>Цель темы</span><p>{item.goal || 'Освоить равносильные преобразования, подстановку и сложение; выбирать метод, проверять пару и переводить текстовое условие в систему. Все условия и решения — на русском.'}</p></div>}
      <div className="week2-mini-grid">
        {item.subtopics.map((mini) => <article className="lesson-card week2-mini-card" key={mini.id}>
          <button className="week2-mini-link" onClick={() => navigate('/' + courseWeek.id + '/' + mini.id + '/lecture')}>
            <span className="week2-mini-number">{mini.number}</span><h2>{mini.titleRu}</h2><p>{mini.summary}</p><span className="week2-mini-open">{mini.available ? 'Открыть лекцию' : 'Посмотреть план'} <ArrowRight size={17} /></span>
          </button>
          {mini.available ? <div className="week2-mini-stages">
            {courseWeek.stages.map(([stage, label]) => {
              const stageOwner = stage === 'lecture' || perSubtopic ? mini.id : item.id
              const key = stageOwner + ':' + stage
              const path = '/' + courseWeek.id + '/' + stageOwner + '/' + stage
              return <button key={stage} onClick={() => navigate(path)}>{progress.completed[key] && <Check size={13} />}{label}</button>
            })}
          </div> : <div className="week2-mini-stages"><span>Lecture · Examples · Practice — готовятся</span></div>}
        </article>)}
      </div>
      {item.available ? <>
        <section className="content-section"><SectionTitle title="Как проходить тему" />
          <div className="theory-grid">
            <TheoryCard item={{ title: perSubtopic ? 'Одна подтема — полный учебный цикл' : 'Сначала три лекции', text: perSubtopic ? 'В каждой подтеме отдельно: Lecture, Worked Examples, Practice и Mini Test. После теста переходите к следующей подтеме. Домашних заданий здесь нет.' : 'Каждая мини-тема разобрана отдельно: правила, решения с объяснением каждого шага и типичные ошибки. Примеры лекции помогают понять метод.' }} />
            <TheoryCard item={{ title: 'Потом самостоятельное применение', text: perSubtopic ? 'Сначала попробуйте задания Examples, затем сравните пошаговые решения. Practice проверяет ответ без автоматического раскрытия решения. В Mini Test разбор доступен только после завершения. Условия можно перевести на казахский.' : 'В Examples сначала идут все ' + item.examples.length + ' новых заданий и только затем их решения. В Practice — ещё ' + item.practiceQuestions.length + ' задач с проверкой и скрытыми решениями. Mini Test проверяет всю тему.' }} />
          </div>
        </section>
        {!perSubtopic && <section className="final-test-card"><div className="final-test-icon"><Flag size={24} /></div><div><span>Topic {item.number} · Проверка</span><h2>Mini Test</h2><p>{item.testDescription || '8 заданий: уравнения, скобки, дроби, системы, количество решений и текстовая задача.'}</p></div><button onClick={() => navigate(root + '/mini-test')}>Открыть тест <ArrowRight size={17} /></button></section>}
        <LessonNavigation navigate={navigate} previous={{ path: '/' + courseWeek.id, label: 'Дашборд' }} next={{ path: stagePaths.lecture }} nextLabel={'Начать с лекции ' + item.subtopics[0].number} />
      </> : <div className="learning-intro week2-pending"><span>Материал готовится</span><p>Структура темы создана. Полные объяснения, примеры и интерактивная практика появятся после добавления учебного материала.</p></div>}
    </div></div>
  )
}

export function Week2LecturePage({ mini, navigate, progress, onComplete, courseWeek = week2 }) {
  if (!mini.available) return <div className="content-page"><div className="lesson-container">
    <PageHeading eyebrow={'Week 2 · Мини-тема ' + mini.number} title={mini.titleRu} subtitle={mini.summary} />
    <div className="learning-intro week2-pending"><span>План мини-темы</span><p>Подробный урок пока не добавлен. После его подготовки здесь будут Lecture, Examples и Practice.</p></div>
    <button className="secondary-button" onClick={() => navigate('/week-2/' + mini.lessonId)}><ArrowLeft size={16} /> Вернуться к теме</button>
  </div></div>
  const topic = mini.lesson
  const weekRoot = '/' + courseWeek.id
  const root = weekRoot + '/' + topic.id
  const perSubtopic = courseWeek.subtopicStages
  const stagePaths = perSubtopic ? Object.fromEntries(courseWeek.stages.map(([stage]) => [stage,weekRoot + '/' + mini.id + '/' + stage])) : getTopicStagePaths(topic)
  const index = topic.subtopics.findIndex((item) => item.id === mini.id)
  const nextMini = topic.subtopics[index + 1]
  const nextPath = perSubtopic ? stagePaths.examples : nextMini ? '/week-2/' + nextMini.id + '/lecture' : root + '/examples'
  const focus = perSubtopic ? mini : topic
  return (
    <div className="content-page lesson-content-page">
      <SubtopicHeader topic={mini} stage="lecture" navigate={navigate} progress={progress} weekId={courseWeek.id} stageConfig={courseWeek.stages} stagePaths={{ ...stagePaths, lecture: weekRoot + '/' + mini.id + '/lecture' }} stageProgressKeys={perSubtopic ? {} : { examples: topic.id + ':examples', practice: topic.id + ':practice' }} />
      <div className="lesson-container">
        <PageHeading eyebrow={'Week ' + courseWeek.number + ' · Lecture ' + mini.number} title={mini.titleRu} subtitle={mini.summary} meta={mini.title} />
        <section className="learning-intro"><span>После лекции</span><ul className="week2-outcomes">{mini.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="content-section"><SectionTitle index="01" title="Основная идея" note="Сначала смысл, потом действия" /><div className="theory-grid">{mini.theory.map((item) => <TheoryCard item={item} key={item.title} />)}</div></section>
        <section className="content-section"><SectionTitle index="02" title="Правила, которые можно объяснить" /><div className="rule-grid">{mini.rules.map((item, i) => <RuleCard item={item} index={i} key={item.title} />)}</div></section>
        {mini.notationTable && <section className="content-section"><NotationTable rows={mini.notationTable} /></section>}
        {mini.visuals && <section className="content-section"><SectionTitle title="Смотрим на обозначения" /><div className="sets-visual-grid">{mini.visuals.map((visual, i) => <MathVisual visual={visual} key={i} />)}</div></section>}
        <section className="content-section"><SectionTitle index="03" title="Разбираем вместе" note="Каждый шаг объясняет, что делаем и зачем" /><div className="example-sequence">{mini.lectureExamples.map((item, i) => <WorkedExample item={item} index={i} key={item.problem} />)}</div></section>
        <section className="content-section"><SectionTitle index="04" title="Проверьте понимание" /><div className="theory-grid">{mini.info.map((item) => <TheoryCard item={item} key={item.title} />)}</div></section>
        {(perSubtopic || index === 2) && <section className="content-section"><SectionTitle index="05" title={focus.examFocusTitle || (perSubtopic || topic.number === 2 ? 'Что нужно уметь для экзамена' : 'Что может встретиться на экзамене CSCA')} note={focus.examFocusNote || (perSubtopic || topic.number === 2 ? 'К таким типам задач стоит быть готовым' : 'К этому типу задач стоит быть готовым')} /><p className="week2-exam-note">{focus.examNote || (perSubtopic ? 'Это тренировочные типы задач, а не обещание конкретных заданий на экзамене.' : 'Это тренировочные типы задач для укрепления алгебраической базы, а не обещание конкретных заданий на экзамене.')}</p><div className="week2-exam-grid">{focus.examSkills.map(([title, text], i) => <TheoryCard key={title} item={{ title: (i + 1) + '. ' + title, text }} />)}</div>{!perSubtopic && <p className="week2-exam-note">Актуальный охват экзамена: <a href="https://csca.cn/testprep/examsv" target="_blank" rel="noopener noreferrer">официальная программа CSCA</a>.</p>}</section>}
        <section className="content-section"><SectionTitle title="Термины этой мини-темы" note="Можно переключить названия на китайский" /><VocabularyList items={perSubtopic ? mini.vocabulary : topic.vocabulary.filter((_, i) => mini.vocabularyIndexes ? mini.vocabularyIndexes.includes(i) : index === 0 ? i < 6 : index === 1 ? [4, 6, 7, 13].includes(i) : [6, 8, 14, 15].includes(i))} /></section>
        <LessonNavigation navigate={navigate} previous={{ path: perSubtopic ? root : index ? '/week-2/' + topic.subtopics[index - 1].id + '/lecture' : root, label: perSubtopic ? 'Все подтемы' : index ? 'Предыдущая лекция' : 'Topic ' + topic.number }} next={{ path: nextPath }} nextLabel={perSubtopic ? 'Продолжить к Worked Examples' : nextMini ? 'Продолжить к лекции ' + nextMini.number : 'Перейти к ' + topic.examples.length + ' примерам'} onNext={() => { onComplete(mini.id, 'lecture'); navigate(nextPath) }} />
      </div>
    </div>
  )
}

export function Week2ExamplesPage({ navigate, progress, onComplete, topic = topic1, courseWeek = week2 }) {
  const root = '/' + courseWeek.id + '/' + topic.id
  const perSubtopic = courseWeek.subtopicStages
  const stagePaths = perSubtopic ? Object.fromEntries(courseWeek.stages.map(([stage]) => [stage,root + '/' + stage])) : getTopicStagePaths(topic)
  const topicHeader = { ...topic, lesson: topic.lesson || { number: topic.number } }
  return <div className={'content-page lesson-content-page' + (topic.number === 2 ? ' topic2-content' : '')}>
    <SubtopicHeader topic={topicHeader} stage="examples" navigate={navigate} progress={progress} weekId={courseWeek.id} stageConfig={courseWeek.stages} stagePaths={stagePaths} />
    <div className="lesson-container">
      <PageHeading eyebrow={'Week ' + courseWeek.number + ' · ' + (perSubtopic ? 'Подтема ' : 'Topic ') + topic.number + ' · ' + (perSubtopic ? 'Worked Examples' : 'Examples')} title={topic.examples.length + ' задач: от основы к применению'} subtitle="Сначала попробуйте все задания. Решения находятся отдельным разделом ниже — не подглядывайте до собственной попытки." meta="Все задачи новые" />
      <section className="content-section"><SectionTitle index="01" title={topic.number === 2 ? 'Examples · Задания' : 'Задания'} note={topic.examplesNote || (perSubtopic ? 'От базовых к комбинированным · Условия можно перевести на казахский' : '1–3 базовые · 4–6 средние · 7–9 экзаменационные · 10–12 сложнее')} /><div className="week2-problem-list">
        {topic.examples.map((item, index) => <article className="theory-card" key={item.id || item.number}><span className="week2-problem-level">{index + 1}. {item.level}</span>{item.translationKk ? <TaskPrompt as="h3" text={item.prompt} translationKk={item.translationKk} /> : <h3>{item.prompt}</h3>}<MathFormula>{item.problem}</MathFormula>{item.visual && <MathVisual visual={item.visual} />}</article>)}
      </div></section>
      <section className="content-section"><SectionTitle index="02" title={topic.number === 2 ? 'Solutions · Решения' : 'Решения'} note="Сравните способ, а не только ответ" /><div className="example-sequence">{topic.examples.map((item, i) => <WorkedExample key={item.id || item.number} item={item} index={i} />)}</div></section>
      <LessonNavigation navigate={navigate} previous={{ path: perSubtopic ? stagePaths.lecture : '/week-2/' + topic.subtopics[2].id + '/lecture', label: perSubtopic ? 'Лекция' : 'Лекция ' + topic.subtopics[2].number }} next={{ path: root + '/practice' }} nextLabel="Перейти к самостоятельной практике" onNext={() => { onComplete(topic.id, 'examples'); navigate(root + '/practice') }} />
    </div>
  </div>
}

export function Week2VocabularyPage({ navigate, onComplete, topic = topic1 }) {
  const root = '/week-2/' + topic.id
  return <div className="content-page"><div className="lesson-container">
    <PageHeading eyebrow={'Week 2 · Topic ' + topic.number + ' · Exam terms'} title="Словарь для чтения заданий" subtitle="Узнавайте ключевые слова на английском или китайском. Объяснения остаются на русском — важно понимать действие, которое от вас ждут." meta={topic.vocabulary.length + ' терминов'} />
    <VocabularyList items={topic.vocabulary} />
    <LessonNavigation navigate={navigate} previous={{ path: root + '/practice', label: 'Практика' }} next={{ path: root + '/mini-test' }} nextLabel="Перейти к Mini Test" onNext={() => { onComplete(topic.id, 'vocabulary'); navigate(root + '/mini-test') }} />
  </div></div>
}
