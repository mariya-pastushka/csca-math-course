export default function Brand({ navigate, compact = false }) {
  return (
    <button className={'brand ' + (compact ? 'brand-compact' : '')} onClick={() => navigate('/')} aria-label="На главную">
      <span className="brand-mark">C</span>
      <span>CSCA / MATH</span>
    </button>
  )
}
