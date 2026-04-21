import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getDeathEventById, getPaymentsByDeathEvent, markAsPaid, markAsUnpaid } from '../services/deathEventService'
import { getFamilyById } from '../services/familyService'
import { useLanguage } from '../context/LanguageContext'

export default function DeathEventDetailPage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  // Family info modal
  const [familyModal, setFamilyModal] = useState(null)   // full family object
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => { loadAll() }, [id])

  // Close modal on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') setFamilyModal(null) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  async function loadAll() {
    try {
      setLoading(true)
      const [eventData, paymentData] = await Promise.all([
        getDeathEventById(id),
        getPaymentsByDeathEvent(id),
      ])
      setEvent(eventData)
      setPayments(paymentData)
    } catch {
      setError(t.deathEventDetail.loadError)
    } finally {
      setLoading(false)
    }
  }

  async function openFamilyModal(familyId) {
    setModalLoading(true)
    setFamilyModal('loading')
    try {
      const data = await getFamilyById(familyId)
      setFamilyModal(data)
    } catch {
      setFamilyModal(null)
    } finally {
      setModalLoading(false)
    }
  }

  async function handleMarkPaid(paymentId) {
    setUpdatingId(paymentId)
    try {
      const today = new Date().toISOString().split('T')[0]
      const updated = await markAsPaid(paymentId, today)
      setPayments(prev => prev.map(p => p.id === paymentId ? updated : p))
      setEvent(prev => prev ? { ...prev, paidCount: prev.paidCount + 1, unpaidCount: prev.unpaidCount - 1 } : prev)
    } catch {
      alert(t.deathEventDetail.markPaidFailed)
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleMarkUnpaid(paymentId) {
    setUpdatingId(paymentId)
    try {
      const updated = await markAsUnpaid(paymentId)
      setPayments(prev => prev.map(p => p.id === paymentId ? updated : p))
      setEvent(prev => prev ? { ...prev, paidCount: prev.paidCount - 1, unpaidCount: prev.unpaidCount + 1 } : prev)
    } catch {
      alert(t.deathEventDetail.markUnpaidFailed)
    } finally {
      setUpdatingId(null)
    }
  }

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  function fullName(p) {
    if (!p) return '—'
    return [p.fName, p.mName, p.lName].filter(Boolean).join(' ')
  }

  const filteredPayments = payments.filter(p => {
    const matchesFilter = filter === 'all' || (filter === 'paid' && p.paid) || (filter === 'unpaid' && !p.paid)
    const matchesSearch = search === '' || p.familyName.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalCollected = payments.filter(p => p.paid).reduce((sum, p) => sum + Number(p.amount), 0)

  if (loading) return <div className="loading">{t.common.loading}</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!event) return null

  return (
    <>
      <Link to="/death-events" className="back-link">{t.deathEventDetail.backToEvents}</Link>

      <div className="page-header">
        <div>
          <h1>{event.deceasedName}</h1>
          <p>{event.deceasedRelationship} · {event.affectedFamilyName} · {t.deathEventDetail.passed} {formatDate(event.dateOfDeath)}</p>
        </div>
      </div>

      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">{t.deathEventDetail.totalFamilies}</div>
          <div className="stat-value">{event.totalFamilies}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.deathEventDetail.paid}</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>{event.paidCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.deathEventDetail.pending}</div>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {event.unpaidCount - (event.overdueCount || 0)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.deathEventDetail.overdue}</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{event.overdueCount || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.deathEventDetail.totalCollected}</div>
          <div className="stat-value" style={{ color: 'var(--color-primary)', fontSize: 22 }}>
            ${totalCollected.toFixed(2)}
          </div>
        </div>
      </div>

      {event.notes && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-title">{t.deathEventDetail.notes}</div>
          <p style={{ fontSize: 14 }}>{event.notes}</p>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>{t.deathEventDetail.donationPayments}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder={t.deathEventDetail.searchFamily} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'paid', 'unpaid'].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? t.deathEventDetail.all : f === 'paid' ? t.deathEventDetail.paidBadge : t.deathEventDetail.pendingBadge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px' }}>
            <p>{t.deathEventDetail.noPayments}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t.deathEventDetail.family}</th>
                  <th>{t.deathEventDetail.phone}</th>
                  <th>{t.deathEventDetail.amount}</th>
                  <th>{t.deathEventDetail.status}</th>
                  <th>{t.deathEventDetail.datePaid}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p.id}>
                    <td>
                      <span
                        className="family-name-link"
                        onClick={() => openFamilyModal(p.familyId)}
                      >
                        {p.familyName}
                      </span>
                    </td>
                    <td>{p.familyPhone || '—'}</td>
                    <td>${Number(p.amount).toFixed(2)}</td>
                    <td>
                      {p.paid
                        ? <span className="badge badge-paid">{t.deathEventDetail.paidBadge}</span>
                        : p.overdue
                          ? <span className="badge badge-unpaid">{t.deathEventDetail.overdueBadge}</span>
                          : <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>{t.deathEventDetail.pendingBadge}</span>
                      }
                    </td>
                    <td>{formatDate(p.paidDate)}</td>
                    <td>
                      {p.paid ? (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleMarkUnpaid(p.id)} disabled={updatingId === p.id}>
                          {updatingId === p.id ? '...' : t.deathEventDetail.undo}
                        </button>
                      ) : (
                        <button className="btn btn-success btn-sm" onClick={() => handleMarkPaid(p.id)} disabled={updatingId === p.id}>
                          {updatingId === p.id ? '...' : t.deathEventDetail.markPaid}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Family Info Modal ── */}
      {familyModal && (
        <div className="modal-backdrop" onClick={() => setFamilyModal(null)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            {familyModal === 'loading' ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                {t.common.loading}
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2>{fullName(familyModal)}</h2>
                  <button className="modal-close" onClick={() => setFamilyModal(null)}>✕</button>
                </div>

                <div className="modal-body">
                  {/* Contact */}
                  <div className="modal-section-title">{t.familyDetail.contactInfo}</div>
                  <div className="modal-info-row">
                    <div className="modal-info-item">
                      <label>{t.familyDetail.phone}</label>
                      <p>{familyModal.phoneNum || '—'}</p>
                    </div>
                    <div className="modal-info-item">
                      <label>{t.familyDetail.dateOfBirth}</label>
                      <p>{formatDate(familyModal.dob)}</p>
                    </div>
                    <div className="modal-info-item">
                      <label>{t.familyDetail.dateJoined}</label>
                      <p>{formatDate(familyModal.joinedDate)}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="modal-section-title">{t.familyDetail.address}</div>
                  {familyModal.address && (familyModal.address.stAddr || familyModal.address.cityAddr) ? (
                    <div className="modal-info-row">
                      {familyModal.address.stAddr && (
                        <div className="modal-info-item" style={{ gridColumn: '1 / -1' }}>
                          <label>{t.familyDetail.street}</label>
                          <p>{familyModal.address.stAddr}</p>
                        </div>
                      )}
                      <div className="modal-info-item">
                        <label>{t.familyDetail.city}</label>
                        <p>{familyModal.address.cityAddr || '—'}</p>
                      </div>
                      <div className="modal-info-item">
                        <label>{t.familyDetail.state}</label>
                        <p>{familyModal.address.stateAddr || '—'}</p>
                      </div>
                      <div className="modal-info-item">
                        <label>{t.familyDetail.zipCode}</label>
                        <p>{familyModal.address.zipCode || '—'}</p>
                      </div>
                      <div className="modal-info-item">
                        <label>{t.familyDetail.country}</label>
                        <p>{familyModal.address.countryAddr || '—'}</p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{t.deathEventDetail.noAddress}</p>
                  )}

                  {/* Members */}
                  <div className="modal-section-title">
                    {t.familyDetail.familyMembers} ({familyModal.familyMembers?.length ?? 0})
                  </div>
                  {!familyModal.familyMembers || familyModal.familyMembers.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{t.deathEventDetail.noMembers}</p>
                  ) : (
                    <div className="table-wrapper" style={{ marginTop: 0 }}>
                      <table>
                        <thead>
                          <tr>
                            <th>{t.families.name}</th>
                            <th>{t.familyDetail.relationship}</th>
                            <th>{t.familyDetail.covered}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {familyModal.familyMembers.map(m => (
                            <tr key={m.id}>
                              <td style={{ fontWeight: 500 }}>{fullName(m)}</td>
                              <td>{m.relationship || '—'}</td>
                              <td>
                                <span className={`badge ${m.isCovered ? 'badge-covered' : 'badge-not-covered'}`}>
                                  {m.isCovered ? t.familyDetail.covered : t.familyDetail.notCovered}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={() => navigate(`/families/${familyModal.id}`)}>
                    {t.deathEventDetail.viewFullProfile}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setFamilyModal(null)}>
                    {t.common.cancel}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
