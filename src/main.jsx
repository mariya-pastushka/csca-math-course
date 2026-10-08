import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'katex/dist/katex.min.css'
import './styles.css'
import { requireSiteSession } from './security/course-session'

if (await requireSiteSession()) {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode><App /></React.StrictMode>,
  )
  setInterval(() => { if (!document.hidden) requireSiteSession() },30000)
  window.addEventListener('pageshow',() => requireSiteSession())
  document.addEventListener('visibilitychange',() => { if (!document.hidden) requireSiteSession() })
}
