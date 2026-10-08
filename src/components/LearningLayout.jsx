import { useState } from 'react'
import CourseSidebar from './CourseSidebar'
import Brand from './Brand'
import { Menu } from './Icons'

export default function LearningLayout({ children, navigate, currentPath, progress, progressPercent, week }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <div className={'learning-shell ' + (sidebarCollapsed ? 'is-sidebar-collapsed' : '')}>
      <CourseSidebar
        navigate={navigate}
        currentPath={currentPath}
        progress={progress}
        progressPercent={progressPercent}
        week={week}
        mobileOpen={mobileOpen}
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(true)}
        onClose={() => setMobileOpen(false)}
      />
      <div className="learning-main">
        {sidebarCollapsed && (
          <div className="desktop-sidebar-bar">
            <button onClick={() => setSidebarCollapsed(false)} aria-label="Показать боковую панель" aria-expanded={false}>
              <Menu size={18} /> Показать меню
            </button>
          </div>
        )}
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
