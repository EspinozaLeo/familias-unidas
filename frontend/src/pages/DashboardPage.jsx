import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAnalyticsSummary } from '../services/analyticsService'
import { getAllDeathEvents } from '../services/deathEventService'
import { getAllFamilies } from '../services/familyService'
import { useLanguage } from '../context/LanguageContext'

export default function DashboardPage() {
  const { t } = useLanguage()
  const [summary, setSummary] = useState(null)
  const [recentEvents, setRecentEvents] = useState([])
  const [recentFamilies, setRecentFamilies] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const [summaryData, eventsData, familiesData] = await Promise.all([
          getAnalyticsSummary(),
          getAllDeathEvents(),
          getAllFamilies(),
        ])
        setSummary(summaryData)
        setRecentEvents(eventsData.slice(0, 5))
        const sorted = [...familiesData].sort((a, b) => {
          if (!a.joinedDate) return 1
          if (!b.joinedDate) return -1
          return new Date(b.joinedDate) - new Date(a.joinedDate)
        })
        setRecentFamilies(sorted.slice(0, 5))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  function fullName(p) {
    return [p.fName, p.mName, p.lName].filter(Boolean).join(' ')
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  if (loading) return <div className="loading">{t.common.loading}</div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t.dashboard.title}</h1>
          <p>{today}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/families/add')}>
            {t.dashboard.addFamily}
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/death-events/add')}>
            {t.dashboard.recordDeath}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/families')}>
          <div className="stat-label">{t.dashboard.enrolledFamilies}</div>
          <div className="stat-value">{summary?.totalFamilies ?? '—'}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{t.dashboard.viewAll}</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/death-events')}>
          <div className="stat-label">{t.dashboard.totalEvents}</div>
          <div className="stat-value">{summary?.totalEvents ?? '—'}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{t.dashboard.viewAll}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.dashboard.totalCollected}</div>
          <div className="stat-value" style={{ color: 'var(--color-success)', fontSize: 22 }}>
            ${Number(summary?.totalCollected ?? 0).toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            ${Number(summary?.totalOutstanding ?? 0).toFixed(2)} {t.dashboard.outstanding}
          </div>
        </div>
        <div
          className="stat-card"
          style={{ cursor: summary?.totalOverdue > 0 ? 'pointer' : 'default', borderColor: summary?.totalOverdue > 0 ? '#fca5a5' : undefined }}
          onClick={() => summary?.totalOverdue > 0 && navigate('/analytics')}
        >
          <div className="stat-label">{t.dashboard.overdueDonations}</div>
          <div className="stat-value" style={{ color: summary?.totalOverdue > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
            {summary?.totalOverdue ?? 0}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {summary?.totalOverdue > 0 ? t.dashboard.viewInAnalytics : t.dashboard.allOnTime}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Recent Death Events */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>{t.dashboard.recentDeathEvents}</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/death-events')}>{t.common.viewAll}</button>
          </div>
          {recentEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}><p>{t.dashboard.noEventsYet}</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentEvents.map(e => (
                <div
                  key={e.id}
                  onClick={() => navigate(`/death-events/${e.id}`)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  onMouseEnter={ev => ev.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={ev => ev.currentTarget.style.background = ''}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{e.deceasedName}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {e.deceasedRelationship} · {e.affectedFamilyName} · {formatDate(e.dateOfDeath)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12, fontSize: 12 }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{e.paidCount} {t.dashboard.paid}</span>
                    {' · '}
                    {e.overdueCount > 0
                      ? <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{e.overdueCount} {t.dashboard.overdue}</span>
                      : <span style={{ color: 'var(--color-text-muted)' }}>{e.unpaidCount} {t.dashboard.pending}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue or Recently Joined */}
        <div className="card" style={{ marginBottom: 0 }}>
          {summary?.overdueFamilies?.length > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="card-title" style={{ marginBottom: 0, color: 'var(--color-danger)' }}>⚠️ {t.dashboard.overdueDonations}</div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/analytics')}>{t.common.viewAll}</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {summary.overdueFamilies.slice(0, 5).map(o => (
                  <div
                    key={o.paymentId}
                    onClick={() => navigate(`/families/${o.familyId}`)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 12px', borderRadius: 'var(--radius)',
                      border: '1px solid #fca5a5', cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={ev => ev.currentTarget.style.background = '#fff5f5'}
                    onMouseLeave={ev => ev.currentTarget.style.background = ''}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{o.familyName}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Re: {o.deceasedName}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: 13 }}>${Number(o.amount).toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{o.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="card-title" style={{ marginBottom: 0 }}>{t.dashboard.recentlyJoined}</div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/families')}>{t.common.viewAll}</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentFamilies.map(f => (
                  <div
                    key={f.id}
                    onClick={() => navigate(`/families/${f.id}`)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 12px', borderRadius: 'var(--radius)',
                      border: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={ev => ev.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={ev => ev.currentTarget.style.background = ''}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{fullName(f)}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {f.address?.cityAddr}{f.address?.stateAddr ? ', ' + f.address.stateAddr : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: 12 }}>
                      {t.dashboard.joined} {formatDate(f.joinedDate)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {summary?.overdueFamilies?.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>{t.dashboard.recentlyJoined}</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/families')}>{t.common.viewAll}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentFamilies.map(f => (
              <div
                key={f.id}
                onClick={() => navigate(`/families/${f.id}`)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={ev => ev.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={ev => ev.currentTarget.style.background = ''}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{fullName(f)}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {f.address?.cityAddr}{f.address?.stateAddr ? ', ' + f.address.stateAddr : ''}
                    {' · '}{f.familyMembers?.length ?? 0} {f.familyMembers?.length !== 1 ? t.dashboard.members : t.dashboard.member}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: 12 }}>
                  {t.dashboard.joined} {formatDate(f.joinedDate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
