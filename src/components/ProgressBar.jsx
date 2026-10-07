export default function ProgressBar({ value, label, compact = false }) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value || 0)))
  return (
    <div className={'progress-wrap ' + (compact ? 'progress-compact' : '')}>
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <strong>{safeValue}%</strong>
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={safeValue}>
        <span style={{ width: String(safeValue) + '%' }} />
      </div>
    </div>
  )
}
