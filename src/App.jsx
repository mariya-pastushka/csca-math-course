import { useEffect, useMemo, useState } from 'react'
import { allSubtopics, findSubtopic } from './data/week1'
import LearningLayout from './components/LearningLayout'
import WelcomePage from './pages/WelcomePage'
import CoursePage from './pages/CoursePage'
import WeekOverviewPage from './pages/WeekOverviewPage'
import TheoryPage from './pages/TheoryPage'
import WorkedExamplesPage from './pages/WorkedExamplesPage'
import PracticePage from './pages/PracticePage'
import HomeworkPage from './pages/HomeworkPage'
import HomeworkResultPage from './pages/HomeworkResultPage'
import FinalTestPage from './pages/FinalTestPage'
import FinalResultPage from './pages/FinalResultPage'
import WhiteboardPage from './pages/WhiteboardPage'
import { week2, findWeek2Subtopic, getTopicProgressKeys } from './data/week2'
import { Week2OverviewPage, Week2TopicPage, Week2LecturePage, Week2ExamplesPage, Week2VocabularyPage, getTopicStagePaths } from './pages/Week2Pages'
import MiniTestPage from './pages/MiniTestPage'
import { requireSiteSession } from './security/course-session'

const STORAGE_KEY = 'csca-week1-progress-v1'
const emptyProgress = { completed: {}, skipped: {}, scores: {}, finalResult: null, finalSkipped: false }

const loadProgress = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return {
      completed: saved?.completed || {},
      skipped: saved?.skipped || {},
      scores: saved?.scores || {},
      finalResult: saved?.finalResult || null,
      finalSkipped: Boolean(saved?.finalSkipped),
    }
  } catch {
    return emptyProgress
  }
}

const loadWeek2Progress = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('csca-week2-progress-v1'))
    return { completed: saved?.completed || {}, scores: {}, skipped: {}, miniTestResult: saved?.miniTestResult || null, testResults: saved?.testResults || {} }
  } catch {
    return { completed: {}, scores: {}, skipped: {}, miniTestResult: null, testResults: {} }
  }
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [progress, setProgress] = useState(loadProgress)
  const [week2Progress, setWeek2Progress] = useState(loadWeek2Progress)

  useEffect(() => {
    const onPopState = async () => { if (await requireSiteSession()) setPath(window.location.pathname) }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    localStorage.setItem('csca-week2-progress-v1', JSON.stringify(week2Progress))
  }, [week2Progress])

  const navigate = async (nextPath) => {
    if (!await requireSiteSession()) return
    if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const markComplete = (topicId, stage) => {
    const key = topicId + ':' + stage
    setProgress((current) => ({
      ...current,
      completed: { ...current.completed, [key]: true },
      skipped: { ...current.skipped, [key]: false },
    }))
  }

  const skipStage = (topicId, stage) => {
    const key = topicId + ':' + stage
    setProgress((current) => ({
      ...current,
      completed: { ...current.completed, [key]: true },
      skipped: { ...current.skipped, [key]: true },
    }))
  }

  const saveHomework = (topicId, result) => {
    const key = topicId + ':homework'
    setProgress((current) => ({
      ...current,
      completed: { ...current.completed, [key]: true },
      skipped: { ...current.skipped, [key]: false },
      scores: { ...current.scores, [topicId]: result },
    }))
  }

  const saveFinal = (result) => {
    setProgress((current) => ({ ...current, finalResult: result, finalSkipped: false }))
  }

  const skipFinal = () => {
    setProgress((current) => ({ ...current, finalSkipped: true }))
  }

  const progressPercent = useMemo(() => {
    const completedStages = Object.values(progress.completed).filter(Boolean).length
    const finalPoint = progress.finalResult || progress.finalSkipped ? 1 : 0
    return Math.round(((completedStages + finalPoint) / (allSubtopics.length * 4 + 1)) * 100)
  }, [progress])

  if (path === '/') return <WelcomePage navigate={navigate} />
  if (path === '/course') return <CoursePage navigate={navigate} />
  if (path === '/week-1/whiteboard') return <WhiteboardPage navigate={navigate} />
  if (path === '/week-1/final-test') return <FinalTestPage navigate={navigate} onFinish={saveFinal} onSkip={skipFinal} />
  if (path === '/week-1/final-result') return <FinalResultPage navigate={navigate} result={progress.finalResult} />

  if (path === '/week-2' || path.startsWith('/week-2/')) {
    const completeWeek2 = (id, stage) => setWeek2Progress((current) => ({ ...current, completed: { ...current.completed, [id + ':' + stage]: true } }))
    const topicMatch = path.match(/^\/week-2\/(topic-[123])$/)
    const stageMatch = path.match(/^\/week-2\/(topic-[123])\/(examples|practice|vocabulary|mini-test)$/)
    const miniMatch = path.match(/^\/week-2\/([^/]+)\/lecture$/)
    const mini = miniMatch ? findWeek2Subtopic(miniMatch[1]) : null
    const activeTopic = week2.lessons.find((item) => item.id === (mini?.lessonId || stageMatch?.[1] || topicMatch?.[1]))
    const progressKeys = activeTopic?.available ? getTopicProgressKeys(activeTopic) : week2.lessons.filter((item) => item.available).flatMap(getTopicProgressKeys)
    const week2Percent = Math.round(progressKeys.filter((key) => week2Progress.completed[key]).length / progressKeys.length * 100)
    const stagePaths = activeTopic?.available ? getTopicStagePaths(activeTopic) : null
    const displayWeek = { ...week2, progressLabel: activeTopic?.available ? 'Прогресс Topic ' + activeTopic.number : 'Прогресс Week 2', activeTopicId: activeTopic?.available ? activeTopic.id : 'topic-1' }
    let week2Content
    if (topicMatch) {
      week2Content = <Week2TopicPage item={week2.lessons.find((item) => item.id === topicMatch[1])} navigate={navigate} progress={week2Progress} />
    } else if (mini) {
      week2Content = <Week2LecturePage key={mini.id} mini={mini} navigate={navigate} progress={week2Progress} onComplete={completeWeek2} />
    } else if (activeTopic?.available && stageMatch?.[2] === 'examples') {
      week2Content = <Week2ExamplesPage topic={activeTopic} navigate={navigate} progress={week2Progress} onComplete={completeWeek2} />
    } else if (activeTopic?.available && stageMatch?.[2] === 'practice') {
      week2Content = <PracticePage key={activeTopic.id + '-practice'} topic={{ ...activeTopic, lesson: { number: activeTopic.number } }} navigate={navigate} progress={week2Progress} onComplete={completeWeek2} weekId="week-2" stageConfig={week2.stages} stagePaths={stagePaths} nextDestination={'/week-2/' + activeTopic.id + '/vocabulary'} nextLabel="Повторить термины перед Mini Test" />
    } else if (activeTopic?.available && stageMatch?.[2] === 'vocabulary') {
      week2Content = <Week2VocabularyPage topic={activeTopic} navigate={navigate} onComplete={completeWeek2} />
    } else if (activeTopic?.available && stageMatch?.[2] === 'mini-test') {
      week2Content = <MiniTestPage key={activeTopic.id + '-test'} title={'Topic ' + activeTopic.number + ' · Mini Test'} topicNumber={activeTopic.number} resultMessages={activeTopic.resultMessages} resultBands={activeTopic.resultBands} questions={activeTopic.miniTestQuestions} navigate={navigate} backPath={'/week-2/' + activeTopic.id} lecturePath={stagePaths.lecture} savedResult={week2Progress.testResults[activeTopic.id] || (activeTopic.number === 1 ? week2Progress.miniTestResult : null)} onFinish={(result) => setWeek2Progress((current) => ({ ...current, completed: { ...current.completed, [activeTopic.id + ':mini-test']: true }, testResults: { ...current.testResults, [activeTopic.id]: result }, ...(activeTopic.number === 1 ? { miniTestResult: result } : {}) }))} />
    } else {
      week2Content = <Week2OverviewPage navigate={navigate} progress={week2Progress} progressPercent={week2Percent} />
    }
    return <LearningLayout navigate={navigate} currentPath={path} progress={week2Progress} progressPercent={week2Percent} week={displayWeek}>{week2Content}</LearningLayout>
  }

  let content
  if (path === '/week-1') {
    content = <WeekOverviewPage navigate={navigate} progress={progress} progressPercent={progressPercent} />
  } else {
    const match = path.match(/^\/week-1\/([^/]+)\/(theory|examples|practice|homework|result)$/)
    const topic = match ? findSubtopic(match[1]) : null
    const stage = match?.[2]

    if (!topic) {
      content = <WeekOverviewPage navigate={navigate} progress={progress} progressPercent={progressPercent} />
    } else if (stage === 'theory') {
      content = <TheoryPage key={topic.id} topic={topic} navigate={navigate} progress={progress} onComplete={markComplete} onSkip={skipStage} />
    } else if (stage === 'examples') {
      content = <WorkedExamplesPage key={topic.id} topic={topic} navigate={navigate} progress={progress} onComplete={markComplete} onSkip={skipStage} />
    } else if (stage === 'practice') {
      content = <PracticePage key={topic.id} topic={topic} navigate={navigate} progress={progress} onComplete={markComplete} onSkip={skipStage} />
    } else if (stage === 'homework') {
      content = <HomeworkPage key={topic.id} topic={topic} navigate={navigate} progress={progress} onFinish={saveHomework} onSkip={skipStage} />
    } else {
      content = <HomeworkResultPage key={topic.id} topic={topic} navigate={navigate} progress={progress} />
    }
  }

  return (
    <LearningLayout navigate={navigate} currentPath={path} progress={progress} progressPercent={progressPercent}>
      {content}
    </LearningLayout>
  )
}
