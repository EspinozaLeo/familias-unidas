import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAllFamilies } from '../services/familyService'
import { createDeathEvent } from '../services/deathEventService'
import { useLanguage } from '../context/LanguageContext'

export default function AddDeathEventPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [families, setFamilies] = useState([])
  const [loadingFamilies, setLoadingFamilies] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [selectedFamilyId, setSelectedFamilyId] = useState('')
  const [selectedFamily, setSelectedFamily] = useState(null)
  const [deceasedMemberId, setDeceasedMemberId] = useState('HEAD')
  const [dateOfDeath, setDateOfDeath] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllFamilies()
        setFamilies(data)
      } catch {
        setError(t.addDeathEvent.saveFailed)
      } finally {
        setLoadingFamilies(false)
      }
    }
    load()
  }, [])

  function handleFamilyChange(e) {
    const id = e.target.value
    setSelectedFamilyId(id)
    setDeceasedMemberId('HEAD')
    setSelectedFamily(id ? families.find(f => f.id === Number(id)) || null : null)
  }

  function fullName(p) {
    if (!p) return ''
    return [p.fName, p.mName, p.lName].filter(Boolean).join(' ')
  }

  const coveredMembers = selectedFamily?.familyMembers?.filter(m => m.isCovered) || []

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!selectedFamilyId) { setError(t.addDeathEvent.selectFamilyError); return }
    if (!dateOfDeath) { setError(t.addDeathEvent.selectDateError); return }
    setSaving(true)
    try {
      const payload = {
        affectedFamilyId: Number(selectedFamilyId),
        deceasedMemberId: deceasedMemberId === 'HEAD' ? null : Number(deceasedMemberId),
        dateOfDeath,
        notes: notes || null,
      }
      const created = await createDeathEvent(payload)
      navigate(`/death-events/${created.id}`)
    } catch {
      setError(t.addDeathEvent.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Link to="/death-events" className="back-link">{t.addDeathEvent.backToEvents}</Link>

      <div className="page-header">
        <div>
          <h1>{t.addDeathEvent.title}</h1>
          <p>{t.addDeathEvent.subtitle}</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">{t.addDeathEvent.deathInformation}</div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>{t.addDeathEvent.affectedFamily} *</label>
              <select value={selectedFamilyId} onChange={handleFamilyChange} disabled={loadingFamilies}>
                <option value="">{t.addDeathEvent.selectFamily}</option>
                {families.map(f => (
                  <option key={f.id} value={f.id}>{fullName(f)}</option>
                ))}
              </select>
            </div>

            {selectedFamily && (
              <div className="form-group full-width">
                <label>{t.addDeathEvent.whoPassed} *</label>
                <select value={deceasedMemberId} onChange={e => setDeceasedMemberId(e.target.value)}>
                  <option value="HEAD">
                    {fullName(selectedFamily)} ({t.addDeathEvent.headOfHousehold})
                  </option>
                  {coveredMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {fullName(m)} ({m.relationship || t.addDeathEvent.familyMember})
                    </option>
                  ))}
                </select>
                {selectedFamily.familyMembers?.length > 0 && coveredMembers.length === 0 && (
                  <small style={{ color: 'var(--color-text-muted)', marginTop: 4, display: 'block' }}>
                    {t.addDeathEvent.noCoveredMembers}
                  </small>
                )}
              </div>
            )}

            <div className="form-group">
              <label>{t.addDeathEvent.dateOfDeath} *</label>
              <input type="date" value={dateOfDeath} onChange={e => setDateOfDeath(e.target.value)} required />
            </div>

            <div className="form-group full-width">
              <label>{t.addDeathEvent.notes}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder={t.addDeathEvent.notesPlaceholder}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {selectedFamily && (
          <div className="card" style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.addDeathEvent.warningTitle}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {t.addDeathEvent.warningBody(fullName(selectedFamily))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving || !selectedFamilyId}>
            {saving ? t.common.saving : t.addDeathEvent.submit}
          </button>
          <Link to="/death-events" className="btn btn-secondary">{t.common.cancel}</Link>
        </div>
      </form>
    </>
  )
}
