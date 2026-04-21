import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addFamily } from '../services/familyService'
import { useLanguage } from '../context/LanguageContext'

const EMPTY_MEMBER = {
  fName: '', mName: '', lName: '', dob: '', relationship: '',
  isMarried: false, isCovered: true,
}

export default function AddFamilyPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [head, setHead] = useState({
    fName: '', mName: '', lName: '', phoneNum: '',
    joinedDate: '', dob: '',
    address: { stAddr: '', cityAddr: '', stateAddr: '', zipCode: '', countryAddr: '' },
  })

  const [members, setMembers] = useState([])

  function updateHead(field, value) { setHead(prev => ({ ...prev, [field]: value })) }
  function updateAddress(field, value) { setHead(prev => ({ ...prev, address: { ...prev.address, [field]: value } })) }
  function addMember() { setMembers(prev => [...prev, { ...EMPTY_MEMBER }]) }
  function removeMember(index) { setMembers(prev => prev.filter((_, i) => i !== index)) }
  function updateMember(index, field, value) {
    setMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!head.fName.trim() || !head.lName.trim()) { setError(t.addFamily.validationError); return }
    setSaving(true)
    try {
      const payload = {
        ...head,
        joinedDate: head.joinedDate || null,
        dob: head.dob || null,
        familyMembers: members.map(m => ({ ...m, dob: m.dob || null })),
      }
      const created = await addFamily(payload)
      navigate(`/families/${created.id}`)
    } catch {
      setError(t.addFamily.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Link to="/families" className="back-link">{t.addFamily.backToFamilies}</Link>

      <div className="page-header">
        <div>
          <h1>{t.addFamily.title}</h1>
          <p>{t.addFamily.subtitle}</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">{t.addFamily.headOfHousehold}</div>
          <div className="form-grid-3">
            <div className="form-group">
              <label>{t.addFamily.firstName} *</label>
              <input value={head.fName} onChange={e => updateHead('fName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t.addFamily.middleName}</label>
              <input value={head.mName} onChange={e => updateHead('mName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t.addFamily.lastName} *</label>
              <input value={head.lName} onChange={e => updateHead('lName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t.addFamily.phoneNumber}</label>
              <input value={head.phoneNum} onChange={e => updateHead('phoneNum', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t.addFamily.dateOfBirth}</label>
              <input type="date" value={head.dob} onChange={e => updateHead('dob', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t.addFamily.dateJoined}</label>
              <input type="date" value={head.joinedDate} onChange={e => updateHead('joinedDate', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">{t.addFamily.address}</div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>{t.addFamily.streetAddress}</label>
              <input value={head.address.stAddr} onChange={e => updateAddress('stAddr', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t.addFamily.city}</label>
              <input value={head.address.cityAddr} onChange={e => updateAddress('cityAddr', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t.addFamily.state}</label>
              <input value={head.address.stateAddr} onChange={e => updateAddress('stateAddr', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t.addFamily.zipCode}</label>
              <input value={head.address.zipCode} onChange={e => updateAddress('zipCode', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t.addFamily.country}</label>
              <input value={head.address.countryAddr} onChange={e => updateAddress('countryAddr', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>{t.addFamily.familyMembers}</div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addMember}>
              {t.addFamily.addMember}
            </button>
          </div>

          {members.length === 0 && (
            <div className="empty-state" style={{ padding: '24px' }}>
              <p>{t.addFamily.noMembersYet}</p>
            </div>
          )}

          {members.map((m, i) => (
            <div className="member-card" key={i}>
              <div className="member-card-header">
                <span>{t.familyDetail.member} {i + 1}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMember(i)}>
                  {t.common.remove}
                </button>
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>{t.addFamily.firstName}</label>
                  <input value={m.fName} onChange={e => updateMember(i, 'fName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{t.addFamily.middleName}</label>
                  <input value={m.mName} onChange={e => updateMember(i, 'mName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{t.addFamily.lastName}</label>
                  <input value={m.lName} onChange={e => updateMember(i, 'lName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{t.addFamily.dateOfBirth}</label>
                  <input type="date" value={m.dob} onChange={e => updateMember(i, 'dob', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{t.familyDetail.relationship}</label>
                  <select value={m.relationship} onChange={e => updateMember(i, 'relationship', e.target.value)}>
                    <option value="">{t.addFamily.selectRelationship}</option>
                    {t.addFamily.relationships.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ justifyContent: 'flex-end', gap: 12, flexDirection: 'row', alignItems: 'center' }}>
                  <label className="checkbox-row">
                    <input type="checkbox" checked={m.isMarried} onChange={e => updateMember(i, 'isMarried', e.target.checked)} />
                    {t.addFamily.married}
                  </label>
                  <label className="checkbox-row">
                    <input type="checkbox" checked={m.isCovered} onChange={e => updateMember(i, 'isCovered', e.target.checked)} />
                    {t.addFamily.covered}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? t.common.saving : t.addFamily.saveFamily}
          </button>
          <Link to="/families" className="btn btn-secondary">{t.common.cancel}</Link>
        </div>
      </form>
    </>
  )
}
