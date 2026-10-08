export default function WeekSelector({ navigate, currentWeek }) {
  return (
    <nav className="week-selector" aria-label="Выбор недели">
      {[1, 2].map((number) => (
        <button key={number} className={currentWeek === number ? 'is-active' : ''} onClick={() => navigate('/week-' + number)} aria-current={currentWeek === number ? 'page' : undefined}>
          Week {number}
        </button>
      ))}
    </nav>
  )
}
