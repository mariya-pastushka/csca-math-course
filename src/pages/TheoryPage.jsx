import { MiniExample, RuleCard, TheoryCard, VocabularyCard } from '../components/LearningCards'
import { LessonNavigation, PageHeading, SectionTitle } from '../components/PageElements'
import SubtopicHeader from '../components/SubtopicHeader'

export default function TheoryPage({ topic, navigate, progress, onComplete }) {
  const nextPath = '/week-1/' + topic.id + '/examples'
  const complete = () => {
    onComplete(topic.id, 'theory')
    navigate(nextPath)
  }

  return (
    <div className="content-page lesson-content-page">
      <SubtopicHeader topic={topic} stage="theory" navigate={navigate} progress={progress} />
      <div className="lesson-container">
        <PageHeading
          eyebrow={'Урок ' + topic.lesson.number + ' · Подтема ' + topic.number + ' · Теория'}
          title={topic.titleRu}
          subtitle={topic.summary}
          meta={topic.title}
        />

        <div className="learning-intro">
          <span>Цель страницы</span>
          <p>Сначала поймите идею. Не старайтесь запомнить всё сразу — после каждого правила есть простой пример.</p>
        </div>

        <section className="content-section">
          <SectionTitle index="01" title="Основная идея" note="Коротко и по шагам" />
          <div className="theory-grid">
            {topic.theory.map((item) => <TheoryCard key={item.title} item={item} />)}
          </div>
        </section>

        <section className="content-section">
          <SectionTitle index="02" title="Правила" note="То, что нужно применять в заданиях" />
          <div className="rule-grid">
            {topic.rules.map((item, index) => <RuleCard key={item.title} item={item} index={index} />)}
          </div>
        </section>

        <section className="content-section">
          <SectionTitle index="03" title="Мини-примеры" note="Самые простые ситуации без лишней сложности" />
          <div className="mini-example-grid">
            {topic.miniExamples.map((item, index) => <MiniExample key={item.expression} item={item} index={index} />)}
          </div>
        </section>

        <section className="content-section">
          <SectionTitle index="04" title="Математический словарь" note="English term + русское объяснение" />
          <div className="vocabulary-grid">
            {topic.vocabulary.map((item) => <VocabularyCard key={item.term} item={item} />)}
          </div>
        </section>

        <LessonNavigation
          previous={{ path: '/week-1', label: 'Дашборд' }}
          next={{ path: nextPath, label: 'Разобранные примеры' }}
          nextLabel="Продолжить к разобранным примерам"
          navigate={navigate}
          onNext={complete}
        />
      </div>
    </div>
  )
}
