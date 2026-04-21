import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  getFamilyById, updateFamily, deleteFamilyMember, addFamilyMember, updateFamilyMember
} from '../services/familyService'
import { useLanguage } from '../context/LanguageContext'

const EMPTY_MEMBER = { fName: '', mName: '', lName: '', dob: '', relationship: '', isMarried: false, isCovered: true }

export default function FamilyDetailPage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()

  const [family, setFamily] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Edit head of household
  const [editingHead, setEditingHead] = useState(false)
  const [headForm, setHeadForm] = useState(null)
  const [savingHead, setSavingHead] = useState(false)

  // Add member
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState({ ...EMPTY_MEMBER })
  const [savingMember, setSavingMember] = useState(false)

  // Edit member
  const [editingMemberId, setEditingMemberId] = useState(null)
  const [memberForm, setMemberForm] = useState(null)

  useEffect(() => {
    loadFamily()
  }, [id])

  async function loadFamily() {
    try {
      setLoading(true)
      const data = await getFamilyById(id)
      setFamily(data)
    } catch {
      setError(t.familyDetail.loadError)
    } finally {
      setLoading(false)
    }
  }

  function fullName(p) {
    return [p.fName, p.mName, p.lName].filter(Boolean).join(' ')
  }

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // ── Head of Household Edit ───────────────────────────────────────────────

  function startEditHead() {
    setHeadForm({
      fName: family.fName || '',
      mName: family.mName || '',
      lName: family.lName || '',
      phoneNum: family.phoneNum || '',
      dob: family.dob || '',
      joinedDate: family.joinedDate || '',
      address: {
        stAddr: family.address?.stAddr || '',
        cityAddr: family.address?.cityAddr || '',
        stateAddr: family.address?.stateAddr || '',
        zipCode: family.address?.zipCode || '',
        countryAddr: family.address?.countryAddr || '',
      },
      familyMembers: family.familyMembers || [],
    })
    setEditingHead(true)
  }

  async function saveHead() {
    setSavingHead(true)
    try {
      const updated = await updateFamily(id, headForm)
      setFamily(updated)
      setEditingHead(false)
    } catch {
      alert(t.familyDetail.updateFailed)
    } finally {
      setSavingHead(false)
    }
  }

  // ── Add Member ────────────────────────────────────────────────────────────

  async function handleAddMember() {
    if (!newMember.fName.trim()) { alert(t.familyDetail.firstNameRequired); return }
    setSavingMember(true)
    try {
      await addFamilyMember({ ...newMember, dob: newMember.dob || null, headOfFamily: { id: Number(id) } })
      setNewMember({ ...EMPTY_MEMBER })
      setShowAddMember(false)
      await loadFamily()
    } catch {
      alert(t.familyDetail.addMemberFailed)
    } finally {
      setSavingMember(false)
    }
  }

  // ── Edit Member ───────────────────────────────────────────────────────────

  function startEditMember(member) {
    setEditingMemberId(member.id)
    setMemberForm({
      id: member.id,
      fName: member.fName || '',
      mName: member.mName || '',
      lName: member.lName || '',
      dob: member.dob || '',
      relationship: member.relationship || '',
      isMarried: member.isMarried || false,
      isCovered: member.isCovered || false,
      headOfFamilyId: Number(id),
    })
  }

  async function saveMember() {
    try {
      await updateFamilyMember(editingMemberId, memberForm)
      setEditingMemberId(null)
      await loadFamily()
    } catch {
      alert(t.familyDetail.updateMemberFailed)
    }
  }

  // ── Delete Member ─────────────────────────────────────────────────────────

  async function handleDeleteMember(memberId, name) {
    if (!confirm(t.familyDetail.deleteMemberConfirm(name))) return
    try {
      await deleteFamilyMember(memberId)
      await loadFamily()
    } catch {
      alert(t.familyDetail.deleteMemberFailed)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return <div className="loading">{t.common.loading}</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!family) return null

  return (
    <>
      <Link to="/families" className="back-link">{t.familyDetail.backToFamilies}</Link>

      <div className="page-header">
        <div>
          <h1>{fullName(family)}</h1>
          <p>{t.familyDetail.headOfHousehold} · {t.familyDetail.joinedOn} {formatDate(family.joinedDate)}</p>
        </div>
        {!editingHead && (
          <button className="btn btn-secondary" onClick={startEditHead}>{t.familyDetail.editInfo}</button>
        )}
      </div>

      {/* Head of Household Info */}
      <div className="card">
        <div className="card-title">{t.familyDetail.contactInfo}</div>

        {!editingHead ? (
          <>
            <div className="info-grid">
              <div className="info-item">
                <label>{t.familyDetail.fullName}</label>
                <p>{fullName(family)}</p>
              </div>
              <div className="info-item">
                <label>{t.familyDetail.phone}</label>
                <p>{family.phoneNum || '—'}</p>
              </div>
              <div className="info-item">
                <label>{t.familyDetail.dateOfBirth}</label>
                <p>{formatDate(family.dob)}</p>
              </div>
              <div className="info-item">
                <label>{t.familyDetail.dateJoined}</label>
                <p>{formatDate(family.joinedDate)}</p>
              </div>
            </div>

            {family.address && (
              <>
                <hr className="section-divider" />
                <div className="card-title">{t.familyDetail.address}</div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>{t.familyDetail.street}</label>
                    <p>{family.address.stAddr || '—'}</p>
                  </div>
                  <div className="info-item">
                    <label>{t.familyDetail.city}</label>
                    <p>{family.address.cityAddr || '—'}</p>
                  </div>
                  <div className="info-item">
                    <label>{t.familyDetail.state}</label>
                    <p>{family.address.stateAddr || '—'}</p>
                  </div>
                  <div className="info-item">
                    <label>{t.familyDetail.zipCode}</label>
                    <p>{family.address.zipCode || '—'}</p>
                  </div>
                  <div className="info-item">
                    <label>{t.familyDetail.country}</label>
                    <p>{family.address.countryAddr || '—'}</p>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="form-grid-3">
              <div className="form-group">
                <label>{t.addFamily.firstName}</label>
                <input value={headForm.fName} onChange={e => setHeadForm(p => ({ ...p, fName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.addFamily.middleName}</label>
                <input value={headForm.mName} onChange={e => setHeadForm(p => ({ ...p, mName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.addFamily.lastName}</label>
                <input value={headForm.lName} onChange={e => setHeadForm(p => ({ ...p, lName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.phone}</label>
                <input value={headForm.phoneNum} onChange={e => setHeadForm(p => ({ ...p, phoneNum: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.dateOfBirth}</label>
                <input type="date" value={headForm.dob || ''} onChange={e => setHeadForm(p => ({ ...p, dob: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.dateJoined}</label>
                <input type="date" value={headForm.joinedDate || ''} onChange={e => setHeadForm(p => ({ ...p, joinedDate: e.target.value }))} />
              </div>
            </div>
            <hr className="section-divider" />
            <div className="card-title">{t.familyDetail.address}</div>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>{t.familyDetail.street}</label>
                <input value={headForm.address.stAddr} onChange={e => setHeadForm(p => ({ ...p, address: { ...p.address, stAddr: e.target.value } }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.city}</label>
                <input value={headForm.address.cityAddr} onChange={e => setHeadForm(p => ({ ...p, address: { ...p.address, cityAddr: e.target.value } }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.state}</label>
                <input value={headForm.address.stateAddr} onChange={e => setHeadForm(p => ({ ...p, address: { ...p.address, stateAddr: e.target.value } }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.zipCode}</label>
                <input value={headForm.address.zipCode} onChange={e => setHeadForm(p => ({ ...p, address: { ...p.address, zipCode: e.target.value } }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.country}</label>
                <input value={headForm.address.countryAddr} onChange={e => setHeadForm(p => ({ ...p, address: { ...p.address, countryAddr: e.target.value } }))} />
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 16 }}>
              <button className="btn btn-primary" onClick={saveHead} disabled={savingHead}>
                {savingHead ? t.common.saving : t.familyDetail.saveChanges}
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingHead(false)}>{t.common.cancel}</button>
            </div>
          </>
        )}
      </div>

      {/* Family Members */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            {t.familyDetail.familyMembers} ({family.familyMembers?.length ?? 0})
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => { setShowAddMember(true); setEditingMemberId(null) }}>
            {t.familyDetail.addMember}
          </button>
        </div>

        {/* Add member form */}
        {showAddMember && (
          <div className="member-card" style={{ marginBottom: 16 }}>
            <div className="member-card-header">
              <span>{t.familyDetail.newMember}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddMember(false)}>{t.common.cancel}</button>
            </div>
            <div className="form-grid-3">
              <div className="form-group">
                <label>{t.addFamily.firstName}</label>
                <input value={newMember.fName} onChange={e => setNewMember(p => ({ ...p, fName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.addFamily.middleName}</label>
                <input value={newMember.mName} onChange={e => setNewMember(p => ({ ...p, mName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.addFamily.lastName}</label>
                <input value={newMember.lName} onChange={e => setNewMember(p => ({ ...p, lName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.dateOfBirth}</label>
                <input type="date" value={newMember.dob} onChange={e => setNewMember(p => ({ ...p, dob: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t.familyDetail.relationship}</label>
                <select value={newMember.relationship} onChange={e => setNewMember(p => ({ ...p, relationship: e.target.value }))}>
                  <option value="">{t.addFamily.selectRelationship}</option>
                  {t.addFamily.relationships.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end', gap: 12, flexDirection: 'row', alignItems: 'center' }}>
                <label className="checkbox-row">
                  <input type="checkbox" checked={newMember.isMarried} onChange={e => setNewMember(p => ({ ...p, isMarried: e.target.checked }))} />
                  {t.familyDetail.married}
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={newMember.isCovered} onChange={e => setNewMember(p => ({ ...p, isCovered: e.target.checked }))} />
                  {t.familyDetail.covered}
                </label>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 12 }}>
              <button className="btn btn-primary btn-sm" onClick={handleAddMember} disabled={savingMember}>
                {savingMember ? t.common.saving : t.familyDetail.addMember}
              </button>
            </div>
          </div>
        )}

        {(!family.familyMembers || family.familyMembers.length === 0) && !showAddMember ? (
          <div className="empty-state" style={{ padding: '24px' }}>
            <p>{t.familyDetail.noMembersYet}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t.families.name}</th>
                  <th>{t.familyDetail.relationship}</th>
                  <th>{t.familyDetail.dateOfBirth}</th>
                  <th>{t.familyDetail.married}</th>
                  <th>{t.familyDetail.covered}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {family.familyMembers?.map(m => (
                  <tr key={m.id}>
                    {editingMemberId === m.id ? (
                      <td colSpan={6}>
                        <div className="form-grid-3" style={{ marginBottom: 10 }}>
                          <div className="form-group">
                            <label>{t.addFamily.firstName}</label>
                            <input value={memberForm.fName} onChange={e => setMemberForm(p => ({ ...p, fName: e.target.value }))} />
                          </div>
                          <div className="form-group">
                            <label>{t.addFamily.middleName}</label>
                            <input value={memberForm.mName} onChange={e => setMemberForm(p => ({ ...p, mName: e.target.value }))} />
                          </div>
                          <div className="form-group">
                            <label>{t.addFamily.lastName}</label>
                            <input value={memberForm.lName} onChange={e => setMemberForm(p => ({ ...p, lName: e.target.value }))} />
                          </div>
                          <div className="form-group">
                            <label>{t.familyDetail.dateOfBirth}</label>
                            <input type="date" value={memberForm.dob || ''} onChange={e => setMemberForm(p => ({ ...p, dob: e.target.value }))} />
                          </div>
                          <div className="form-group">
                            <label>{t.familyDetail.relationship}</label>
                            <select value={memberForm.relationship} onChange={e => setMemberForm(p => ({ ...p, relationship: e.target.value }))}>
                              <option value="">{t.addFamily.selectRelationship}</option>
                              {t.addFamily.relationships.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                          <div className="form-group" style={{ justifyContent: 'flex-end', gap: 12, flexDirection: 'row', alignItems: 'center' }}>
                            <label className="checkbox-row">
                              <input type="checkbox" checked={memberForm.isMarried} onChange={e => setMemberForm(p => ({ ...p, isMarried: e.target.checked }))} />
                              {t.familyDetail.married}
                            </label>
                            <label className="checkbox-row">
                              <input type="checkbox" checked={memberForm.isCovered} onChange={e => setMemberForm(p => ({ ...p, isCovered: e.target.checked }))} />
                              {t.familyDetail.covered}
                            </label>
                          </div>
                        </div>
                        <div className="form-actions">
                          <button className="btn btn-primary btn-sm" onClick={saveMember}>{t.common.save}</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingMemberId(null)}>{t.common.cancel}</button>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td style={{ fontWeight: 500 }}>{fullName(m)}</td>
                        <td>{m.relationship || '—'}</td>
                        <td>{formatDate(m.dob)}</td>
                        <td>{m.isMarried ? t.common.yes : t.common.no}</td>
                        <td>
                          <span className={`badge ${m.isCovered ? 'badge-covered' : 'badge-not-covered'}`}>
                            {m.isCovered ? t.familyDetail.covered : t.familyDetail.notCovered}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => startEditMember(m)}>{t.common.edit}</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMember(m.id, fullName(m))}>{t.common.remove}</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
