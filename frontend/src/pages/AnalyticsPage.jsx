import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { getAnalyticsSummary } from '../services/analyticsService'
import { useLanguage } from '../context/LanguageContext'

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'overview'
  const [selectedYear, setSelectedYear] = useState(null)
  const [reliabilityFilter, setReliabilityFilter] = useState('all')
  const [overdueSort, setOverdueSort] = useState('asc')
  const navigate = useNavigate()

  function setTab(newTab) {
    setSearchParams({ tab: newTab }, { replace: true })
  }

  function navigateAway(path) {
    sessionStorage.setItem('analytics-scroll', window.scrollY)
    navigate(path)
  }

  useEffect(() => {
    async function load() {
      try {
        const result = await getAnalyticsSummary()
        setData(result)
        if (result.eventsByYear?.length > 0) {
          setSelectedYear(result.eventsByYear[0].year)
        }
      } catch {
        setError(t.analytics.loadError)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!loading && data) {
      const saved = sessionStorage.getItem('analytics-scroll')
      if (saved) {
        window.scrollTo(0, parseInt(saved))
        sessionStorage.removeItem('analytics-scroll')
      }
    }
  }, [loading, data])

  if (loading) return <div className="loading">{t.common.loading}</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!data) return null

  const totalDonations = data.totalPaid + data.totalPending + data.totalOverdue
  const collectionPct = totalDonations > 0
    ? Math.round(data.totalPaid / totalDonations * 100)
    : 0

  const filteredReliability = reliabilityFilter === 'issues'
    ? data.familyReliability.filter(f => f.totalOverdue > 0 || f.rate < 100)
    : data.familyReliability

  const yearData = data.eventsByYear?.find(y => y.year === selectedYear)
  const chartData = yearData?.months ?? data.eventsByMonth

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function daysOverdue(dueDateStr) {
    const due = new Date(dueDateStr)
    due.setHours(0, 0, 0, 0)
    return Math.floor((today - due) / (1000 * 60 * 60 * 24))
  }

  const sortedOverdue = [...(data.overdueFamilies ?? [])].sort((a, b) => {
    const diff = new Date(a.dueDate) - new Date(b.dueDate)
    return overdueSort === 'asc' ? diff : -diff
  })

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t.analytics.title}</h1>
          <p>{t.analytics.subtitle}</p>
        </div>
      </div>

      {/* Top summary — always visible */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">{t.analytics.enrolledFamilies}</div>
          <div className="stat-value">{data.totalFamilies}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.analytics.totalEvents}</div>
          <div className="stat-value">{data.totalEvents}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.analytics.totalCollected}</div>
          <div className="stat-value" style={{ color: 'var(--color-success)', fontSize: 22 }}>
            ${Number(data.totalCollected).toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.analytics.outstanding}</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)', fontSize: 22 }}>
            ${Number(data.totalOutstanding).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          {t.analytics.tabOverview}
        </button>
        <button className={`tab ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')}>
          {t.analytics.tabEvents}
        </button>
        <button className={`tab ${tab === 'families' ? 'active' : ''}`} onClick={() => setTab('families')}>
          {t.analytics.tabFamilies}
          {data.totalOverdue > 0 && (
            <span style={{
              marginLeft: 6, background: 'var(--color-danger)', color: '#fff',
              borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 6px'
            }}>
              {data.totalOverdue}
            </span>
          )}
        </button>
      </div>

      {/* ── Overview Tab ─────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <>
          {/* Donation breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-label">{t.analytics.donationsPaid}</div>
              <div className="stat-value" style={{ color: 'var(--color-success)' }}>{data.totalPaid}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">{t.analytics.donationsPending}</div>
              <div className="stat-value" style={{ color: 'var(--color-warning)' }}>{data.totalPending}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">{t.analytics.overdue}</div>
              <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{data.totalOverdue}</div>
            </div>
          </div>

          {/* Collection rate bar */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-title">{t.analytics.collectionRate}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, height: 20, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: `${collectionPct}%`, height: '100%', borderRadius: 999,
                  background: collectionPct >= 80 ? 'var(--color-success)' : collectionPct >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                  transition: 'width 0.5s'
                }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, minWidth: 50 }}>{collectionPct}%</span>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 10, fontSize: 12 }}>
              <span style={{ color: 'var(--color-success)' }}>● {data.totalPaid} {t.dashboard.paid}</span>
              <span style={{ color: 'var(--color-warning)' }}>● {data.totalPending} {t.dashboard.pending}</span>
              <span style={{ color: 'var(--color-danger)' }}>● {data.totalOverdue} {t.dashboard.overdue}</span>
            </div>
          </div>

          {/* Overdue donations */}
          {sortedOverdue.length > 0 ? (
            <div className="card" style={{ borderColor: '#fca5a5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="card-title" style={{ marginBottom: 0, color: 'var(--color-danger)' }}>
                  ⚠️ {t.analytics.overdueDonations} ({sortedOverdue.length})
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setOverdueSort(s => s === 'asc' ? 'desc' : 'asc')}
                >
                  {overdueSort === 'asc' ? t.analytics.sortMostOverdue : t.analytics.sortLeastOverdue}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sortedOverdue.map(o => {
                  const days = daysOverdue(o.dueDate)
                  const urgency = days >= 30
                    ? 'var(--color-danger)'
                    : days >= 14
                      ? '#b45309'
                      : 'var(--color-warning)'
                  return (
                    <div
                      key={o.paymentId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: '#fff5f5',
                        border: '1px solid #fecaca',
                        borderRadius: 8,
                        gap: 12,
                      }}
                    >
                      {/* Left: name + details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          className="family-name-link"
                          style={{ fontSize: 15, fontWeight: 600 }}
                          onClick={() => navigateAway(`/families/${o.familyId}`)}
                        >
                          {o.familyName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3 }}>
                          {o.familyPhone || '—'}
                          <span style={{ margin: '0 6px' }}>·</span>
                          {t.analytics.forEvent} {o.deceasedName}
                        </div>
                      </div>

                      {/* Right: amount + overdue badge + due date */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>
                          ${Number(o.amount).toFixed(2)}
                        </div>
                        <div style={{
                          fontSize: 11, fontWeight: 700, color: urgency,
                          marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.03em'
                        }}>
                          {t.analytics.daysOverdue(days)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
                          {t.analytics.dueDate}: {o.dueDate}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-success)' }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span style={{ fontWeight: 600 }}>{t.analytics.allOnTime}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Events Tab ───────────────────────────────────────────────────── */}
      {tab === 'events' && (
        <>
          {/* Events by month chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 0 }}>
                {t.analytics.eventsByMonth}
                {selectedYear && (
                  <span style={{ marginLeft: 8, color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 13 }}>
                    — {yearData?.totalEvents ?? 0} {t.analytics.eventsIn} {selectedYear}
                  </span>
                )}
              </div>
              {data.eventsByYear?.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {data.eventsByYear.map(y => (
                    <button
                      key={y.year}
                      className={`btn btn-sm ${selectedYear === y.year ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setSelectedYear(y.year)}
                    >
                      {y.year}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {chartData.some(m => m.count > 0) ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" name={t.analytics.tabEvents} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: 24 }}>
                <p>{t.analytics.noEventsYear(selectedYear)}</p>
              </div>
            )}
          </div>

          {/* Collection rate per event */}
          <div className="card">
            <div className="card-title">{t.analytics.collectionRatePerEvent}</div>
            {data.collectionRates.length === 0 ? (
              <div className="empty-state" style={{ padding: 24 }}>
                <p>{t.analytics.noEventsRecorded}</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>{t.analytics.deceased}</th>
                      <th>{t.analytics.date}</th>
                      <th>{t.analytics.paidTotal}</th>
                      <th>{t.analytics.collectionRateCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.collectionRates.map(e => (
                      <tr key={e.eventId} style={{ cursor: 'pointer' }} onClick={() => navigateAway(`/death-events/${e.eventId}`)}>
                        <td style={{ fontWeight: 500 }}>{e.deceasedName}</td>
                        <td>{e.dateOfDeath}</td>
                        <td>{e.paidCount} / {e.totalFamilies}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 999, maxWidth: 120 }}>
                              <div style={{
                                width: `${e.rate}%`, height: '100%', borderRadius: 999,
                                background: e.rate >= 80 ? 'var(--color-success)' : e.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
                              }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{e.rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Families Tab ─────────────────────────────────────────────────── */}
      {tab === 'families' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>{t.analytics.familyReliability}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'issues'].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm ${reliabilityFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setReliabilityFilter(f)}
                >
                  {f === 'all' ? t.analytics.allFamilies : t.analytics.issuesOnly}
                </button>
              ))}
            </div>
          </div>

          {filteredReliability.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}>
              <p>{reliabilityFilter === 'issues' ? t.analytics.noIssues : t.analytics.noPaymentData}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t.analytics.family}</th>
                    <th>{t.deathEvents.paid}</th>
                    <th>{t.analytics.overdue}</th>
                    <th>{t.analytics.totalEventsCol}</th>
                    <th>{t.analytics.reliability}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReliability.map(f => (
                    <tr key={f.familyId} style={{ cursor: 'pointer' }} onClick={() => navigateAway(`/families/${f.familyId}`)}>
                      <td style={{ fontWeight: 500 }}>{f.familyName}</td>
                      <td style={{ color: 'var(--color-success)' }}>{f.totalPaid}</td>
                      <td>
                        {f.totalOverdue > 0
                          ? <span className="badge badge-unpaid">{f.totalOverdue}</span>
                          : <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                        }
                      </td>
                      <td>{f.totalOwed}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 999, maxWidth: 100 }}>
                            <div style={{
                              width: `${f.rate}%`, height: '100%', borderRadius: 999,
                              background: f.rate >= 80 ? 'var(--color-success)' : f.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
                            }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{f.rate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  )
}
