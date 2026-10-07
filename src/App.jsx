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

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const navigate = (nextPath) => {
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
  if (path === '/week-1/final-test') return <FinalTestPage navigate={navigate} onFinish={saveFinal} onSkip={skipFinal} />
  if (path === '/week-1/final-result') return <FinalResultPage navigate={navigate} result={progress.finalResult} />

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
