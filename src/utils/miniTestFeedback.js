export function miniTestFeedbackKey(score,total,bands) {
  if (bands?.length) return bands.find((band) => score >= band.min)?.key || 'restart'
  if (score === total) return 'excellent'
  if (score >= total * 0.75) return 'good'
  if (score >= total * 0.5) return 'review'
  return 'restart'
}
