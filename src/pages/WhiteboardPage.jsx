import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ChevronDown } from '../components/Icons'

const tools = [
  { id: 'pen', label: 'Ручка', glyph: '✎' },
  { id: 'eraser', label: 'Ластик', glyph: '◇' },
  { id: 'line', label: 'Линия', glyph: '╱' },
  { id: 'arrow', label: 'Стрелка', glyph: '↗' },
  { id: 'rectangle', label: 'Прямоугольник', glyph: '▭' },
  { id: 'circle', label: 'Окружность', glyph: '○' },
]

const vividColors = ['#182016', '#ef4444', '#f97316', '#eab308', '#22a447', '#0891b2', '#2563eb', '#7c3aed', '#db2777']
const pastelColors = ['#64748b', '#fca5a5', '#fdba74', '#fde68a', '#86efac', '#a5f3fc', '#bfdbfe', '#c4b5fd', '#fbcfe8']

const pointDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

function drawAction(context, action) {
  if (!action) return
  context.save()
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.lineWidth = action.tool === 'eraser' ? Math.max(12, action.width * 4) : action.width
  context.strokeStyle = action.color
  context.fillStyle = action.color
  context.globalCompositeOperation = action.tool === 'eraser' ? 'destination-out' : 'source-over'

  if (action.tool === 'pen' || action.tool === 'eraser') {
    const points = action.points || []
    if (points.length === 1) {
      context.beginPath()
      context.arc(points[0].x, points[0].y, context.lineWidth / 2, 0, Math.PI * 2)
      context.fill()
    } else if (points.length > 1) {
      context.beginPath()
      context.moveTo(points[0].x, points[0].y)
      for (let index = 1; index < points.length - 1; index += 1) {
        const middle = {
          x: (points[index].x + points[index + 1].x) / 2,
          y: (points[index].y + points[index + 1].y) / 2,
        }
        context.quadraticCurveTo(points[index].x, points[index].y, middle.x, middle.y)
      }
      const last = points[points.length - 1]
      context.lineTo(last.x, last.y)
      context.stroke()
    }
    context.restore()
    return
  }

  const { start, end } = action
  if (!start || !end) {
    context.restore()
    return
  }

  if (action.tool === 'line' || action.tool === 'arrow') {
    context.beginPath()
    context.moveTo(start.x, start.y)
    context.lineTo(end.x, end.y)
    context.stroke()

    if (action.tool === 'arrow') {
      const angle = Math.atan2(end.y - start.y, end.x - start.x)
      const head = Math.max(12, action.width * 4)
      context.beginPath()
      context.moveTo(end.x, end.y)
      context.lineTo(end.x - head * Math.cos(angle - Math.PI / 6), end.y - head * Math.sin(angle - Math.PI / 6))
      context.moveTo(end.x, end.y)
      context.lineTo(end.x - head * Math.cos(angle + Math.PI / 6), end.y - head * Math.sin(angle + Math.PI / 6))
      context.stroke()
    }
  } else if (action.tool === 'rectangle') {
    context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y)
  } else if (action.tool === 'circle') {
    const centerX = (start.x + end.x) / 2
    const centerY = (start.y + end.y) / 2
    const radiusX = Math.abs(end.x - start.x) / 2
    const radiusY = Math.abs(end.y - start.y) / 2
    context.beginPath()
    context.ellipse(centerX, centerY, Math.max(radiusX, 0.5), Math.max(radiusY, 0.5), 0, 0, Math.PI * 2)
    context.stroke()
  }
  context.restore()
}

export default function WhiteboardPage({ navigate }) {
  const canvasRef = useRef(null)
  const surfaceRef = useRef(null)
  const actionsRef = useRef([])
  const draftRef = useRef(null)
  const pointerRef = useRef(null)
  const sizeRef = useRef({ width: 0, height: 0 })
  const [actions, setActions] = useState([])
  const [redoActions, setRedoActions] = useState([])
  const [clearBackup, setClearBackup] = useState(null)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#182016')
  const [width, setWidth] = useState(4)
  const [grid, setGrid] = useState('grid')
  const [paletteOpen, setPaletteOpen] = useState(false)

  const redraw = useCallback((draft = draftRef.current) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    const { width: canvasWidth, height: canvasHeight } = sizeRef.current
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    actionsRef.current.forEach((action) => drawAction(context, action))
    if (draft) drawAction(context, draft)
  }, [])

  useEffect(() => {
    const surface = surfaceRef.current
    const canvas = canvasRef.current
    if (!surface || !canvas) return undefined

    const resize = () => {
      const bounds = surface.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio))
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio))
      canvas.style.width = bounds.width + 'px'
      canvas.style.height = bounds.height + 'px'
      sizeRef.current = { width: bounds.width, height: bounds.height }
      canvas.getContext('2d').setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      redraw()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(surface)
    resize()
    return () => observer.disconnect()
  }, [redraw])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement) return
      const key = event.key.toLowerCase()
      if ((event.ctrlKey || event.metaKey) && key === 'z') {
        event.preventDefault()
        document.querySelector('[data-whiteboard-undo]')?.click()
      } else if ((event.ctrlKey || event.metaKey) && key === 'y') {
        event.preventDefault()
        document.querySelector('[data-whiteboard-redo]')?.click()
      } else if (key === 'escape') {
        draftRef.current = null
        pointerRef.current = null
        redraw(null)
      } else {
        const shortcuts = { p: 'pen', e: 'eraser', l: 'line', a: 'arrow', r: 'rectangle', c: 'circle' }
        if (shortcuts[key]) setTool(shortcuts[key])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [redraw])

  const canvasPoint = (event) => {
    const bounds = canvasRef.current.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }

  const startDrawing = (event) => {
    if (!event.isPrimary || event.button > 0) return
    const point = canvasPoint(event)
    pointerRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    draftRef.current = tool === 'pen' || tool === 'eraser'
      ? { tool, color, width, points: [point] }
      : { tool, color, width, start: point, end: point }
    redraw()
  }

  const continueDrawing = (event) => {
    const draft = draftRef.current
    if (!draft || pointerRef.current !== event.pointerId) return
    const point = canvasPoint(event)
    if (draft.tool === 'pen' || draft.tool === 'eraser') {
      const last = draft.points[draft.points.length - 1]
      if (pointDistance(last, point) < 1.3) return
      draft.points.push(point)
    } else {
      draft.end = point
    }
    redraw(draft)
  }

  const finishDrawing = (event) => {
    const draft = draftRef.current
    if (!draft || pointerRef.current !== event.pointerId) return
    continueDrawing(event)
    draftRef.current = null
    pointerRef.current = null
    const nextActions = [...actionsRef.current, draft].slice(-300)
    actionsRef.current = nextActions
    setActions(nextActions)
    setRedoActions([])
    setClearBackup(null)
    redraw(null)
  }

  const cancelDrawing = (event) => {
    if (pointerRef.current !== event.pointerId) return
    draftRef.current = null
    pointerRef.current = null
    redraw(null)
  }

  const undo = () => {
    if (!actionsRef.current.length && clearBackup?.length) {
      actionsRef.current = clearBackup
      setActions(clearBackup)
      setClearBackup(null)
      redraw(null)
      return
    }
    if (!actionsRef.current.length) return
    const nextActions = actionsRef.current.slice(0, -1)
    const removed = actionsRef.current[actionsRef.current.length - 1]
    actionsRef.current = nextActions
    setActions(nextActions)
    setRedoActions((current) => [removed, ...current].slice(0, 300))
    redraw(null)
  }

  const redo = () => {
    if (!redoActions.length) return
    const [restored, ...rest] = redoActions
    const nextActions = [...actionsRef.current, restored].slice(-300)
    actionsRef.current = nextActions
    setActions(nextActions)
    setRedoActions(rest)
    setClearBackup(null)
    redraw(null)
  }

  const clearAll = () => {
    if (!actionsRef.current.length) return
    setClearBackup(actionsRef.current)
    actionsRef.current = []
    setActions([])
    setRedoActions([])
    draftRef.current = null
    redraw(null)
  }

  const chooseColor = (nextColor) => {
    setColor(nextColor)
    setPaletteOpen(false)
  }

  return (
    <div className="whiteboard-page">
      <div className="whiteboard-mobile-notice">
        <strong>Интерактивная доска доступна на компьютере</strong>
        <p>Откройте эту страницу на компьютере или интерактивной панели.</p>
        <button onClick={() => navigate('/week-1')}><ArrowLeft size={17} /> Вернуться в Week 1</button>
      </div>

      <div className="whiteboard-workspace">
        <header className="whiteboard-header">
          <div>
            <button className="whiteboard-back" onClick={() => navigate('/week-1')} aria-label="Вернуться в Week 1">
              <ArrowLeft size={18} />
            </button>
            <span className="whiteboard-brand">CSCA / MATH</span>
            <span className="whiteboard-divider" />
            <h1>Интерактивная доска</h1>
          </div>
          <span className="whiteboard-memory-note"><i /> Рисунок не сохраняется</span>
        </header>

        <div className="whiteboard-toolbar" aria-label="Инструменты доски">
          <div className="whiteboard-tool-group">
            {tools.map((item) => (
              <button
                key={item.id}
                className={'whiteboard-tool ' + (tool === item.id ? 'is-active' : '')}
                aria-pressed={tool === item.id}
                title={item.label}
                onClick={() => setTool(item.id)}
              >
                <span>{item.glyph}</span>
                {item.label}
              </button>
            ))}
          </div>

          <span className="whiteboard-toolbar-separator" />

          <div className="whiteboard-tool-group whiteboard-compact-group">
            <div className="whiteboard-palette">
              <button className="palette-trigger" onClick={() => setPaletteOpen((open) => !open)} aria-expanded={paletteOpen}>
                <i style={{ backgroundColor: color }} /> Цвет <ChevronDown size={14} />
              </button>
              {paletteOpen && (
                <div className="palette-popover">
                  <span>Насыщенные</span>
                  <div>{vividColors.map((item) => <button key={item} style={{ backgroundColor: item }} aria-label={'Цвет ' + item} onClick={() => chooseColor(item)} />)}</div>
                  <span>Пастельные</span>
                  <div>{pastelColors.map((item) => <button key={item} style={{ backgroundColor: item }} aria-label={'Цвет ' + item} onClick={() => chooseColor(item)} />)}</div>
                  <label>
                    Свой цвет
                    <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
                  </label>
                </div>
              )}
            </div>

            <label className="whiteboard-width">
              <span>Толщина</span>
              <input type="range" min="2" max="18" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
              <strong>{width}</strong>
            </label>
          </div>

          <span className="whiteboard-toolbar-separator" />

          <div className="whiteboard-tool-group whiteboard-compact-group">
            <div className="whiteboard-grid-switch" aria-label="Фон доски">
              <button className={grid === 'blank' ? 'is-active' : ''} onClick={() => setGrid('blank')}>Чистый</button>
              <button className={grid === 'grid' ? 'is-active' : ''} onClick={() => setGrid('grid')}>Сетка</button>
              <button className={grid === 'axes' ? 'is-active' : ''} onClick={() => setGrid('axes')}>Оси</button>
            </div>
            <button data-whiteboard-undo className="whiteboard-icon-button" onClick={undo} disabled={!actions.length && !clearBackup?.length} title="Отменить (Ctrl+Z)">↶</button>
            <button data-whiteboard-redo className="whiteboard-icon-button" onClick={redo} disabled={!redoActions.length} title="Повторить (Ctrl+Y)">↷</button>
            <button className="whiteboard-clear" onClick={clearAll} disabled={!actions.length}>Стереть всё</button>
          </div>
        </div>

        <main
          ref={surfaceRef}
          className={'whiteboard-surface is-' + grid}
          onContextMenu={(event) => event.preventDefault()}
        >
          {!actions.length && !draftRef.current && (
            <div className="whiteboard-empty">
              <span>✎</span>
              <strong>Доска готова</strong>
              <small>Пишите мышью, стилусом или пальцем на интерактивной панели</small>
            </div>
          )}
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={continueDrawing}
            onPointerUp={finishDrawing}
            onPointerCancel={cancelDrawing}
            onPointerLeave={(event) => event.buttons === 0 && cancelDrawing(event)}
            aria-label="Поле интерактивной доски"
          />
        </main>
      </div>
    </div>
  )
}
