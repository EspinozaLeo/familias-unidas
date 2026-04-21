import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDeathEvents, deleteDeathEvent } from '../services/deathEventService'
import { useLanguage } from '../context/LanguageContext'

export default function DeathEventsPage() {
  const { t } = useLanguage()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [contextMenu, setContextMenu] = useState(null) // { x, y, event }
  const contextMenuRef = useRef(null)

  useEffect(() => { loadEvents() }, [])

  useEffect(() => {
    function handleClick() { setContextMenu(null) }
    function handleKey(e) { if (e.key === 'Escape') setContextMenu(null) }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  async function loadEvents() {
    try {
      setLoading(true)
      const data = await getAllDeathEvents()
      setEvents(data)
    } catch {
      setError(t.deathEvents.loadError)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, name) {
    setContextMenu(null)
    if (!confirm(t.deathEvents.deleteConfirm(name))) return
    try {
      await deleteDeathEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch {
      alert(t.deathEvents.deleteFailed)
    }
  }

  function handleRowRightClick(e, event) {
    e.preventDefault()
    const menuWidth = 160
    const menuHeight = 90
    const x = e.clientX + menuWidth > window.innerWidth ? e.clientX - menuWidth : e.clientX
    const y = e.clientY + menuHeight > window.innerHeight ? e.clientY - menuHeight : e.clientY
    setContextMenu({ x, y, event })
  }

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const totalUnpaid = events.reduce((sum, e) => sum + (e.unpaidCount || 0), 0)
  const totalPaid = events.reduce((sum, e) => sum + (e.paidCount || 0), 0)

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t.deathEvents.title}</h1>
          <p>{t.deathEvents.subtitle}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/death-events/add')}>
          {t.deathEvents.recordDeath}
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">{t.deathEvents.totalEvents}</div>
          <div className="stat-value">{events.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.deathEvents.donationsPaid}</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>{totalPaid}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.deathEvents.donationsPending}</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{totalUnpaid}</div>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        {loading ? (
          <div className="loading">{t.common.loading}</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 32 }}>📋</div>
            <p>{t.deathEvents.noEventsYet}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t.deathEvents.deceased}</th>
                  <th>{t.deathEvents.relationship}</th>
                  <th>{t.deathEvents.affectedFamily}</th>
                  <th>{t.deathEvents.dateOfDeath}</th>
                  <th>{t.deathEvents.paid}</th>
                  <th>{t.deathEvents.pending}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr
                    key={e.id}
                    className="row-clickable"
                    onClick={() => navigate(`/death-events/${e.id}`)}
                    onContextMenu={ev => handleRowRightClick(ev, e)}
                  >
                    <td style={{ fontWeight: 600 }}>{e.deceasedName}</td>
                    <td>{e.deceasedRelationship}</td>
                    <td>{e.affectedFamilyName}</td>
                    <td>{formatDate(e.dateOfDeath)}</td>
                    <td><span className="badge badge-paid">{e.paidCount} {t.deathEvents.paid.toLowerCase()}</span></td>
                    <td>
                      {e.unpaidCount > 0
                        ? <span className="badge badge-unpaid">{e.unpaidCount} {t.deathEvents.pending.toLowerCase()}</span>
                        : <span className="badge badge-paid">{t.deathEvents.allPaid}</span>
                      }
                    </td>
                    <td onClick={ev => ev.stopPropagation()}>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id, e.deceasedName)}>
                        {t.common.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={() => { setContextMenu(null); navigate(`/death-events/${contextMenu.event.id}`) }}>
            <span>👁</span> {t.common.view}
          </div>
          <div className="context-menu-divider" />
          <div className="context-menu-item danger" onClick={() => handleDelete(contextMenu.event.id, contextMenu.event.deceasedName)}>
            <span>🗑</span> {t.common.delete}
          </div>
        </div>
      )}
    </>
  )
}
