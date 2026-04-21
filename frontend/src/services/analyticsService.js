export async function getAnalyticsSummary() {
  const res = await fetch('/api/v1/analytics/summary')
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}
