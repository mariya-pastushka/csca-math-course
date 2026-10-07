import { useState } from 'react'
import CourseSidebar from './CourseSidebar'
import Brand from './Brand'
import { Menu } from './Icons'

export default function LearningLayout({ children, navigate, currentPath, progress, progressPercent }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="learning-shell">
      <CourseSidebar
        navigate={navigate}
        currentPath={currentPath}
        progress={progress}
        progressPercent={progressPercent}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="learning-main">
        <header className="mobile-course-header">
          <Brand navigate={navigate} compact />
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Открыть меню курса">
            <Menu />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}
