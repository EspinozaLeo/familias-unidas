import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllFamilies, searchFamilies, deleteFamily } from '../services/familyService'
import { useLanguage } from '../context/LanguageContext'

export default function FamiliesPage() {
  const { t } = useLanguage()
  const [families, setFamilies] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [contextMenu, setContextMenu] = useState(null) // { x, y, family }
  const contextMenuRef = useRef(null)

  useEffect(() => { loadFamilies() }, [])

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

  async function loadFamilies() {
    try {
      setLoading(true)
      const data = await getAllFamilies()
      setFamilies(data)
    } catch {
      setError(t.families.loadError)
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(e) {
    const val = e.target.value
    setQuery(val)
    if (val.trim() === '') {
      loadFamilies()
    } else {
      try {
        const data = await searchFamilies(val.trim())
        setFamilies(data)
      } catch {}
    }
  }

  async function handleDelete(id, name) {
    setContextMenu(null)
    if (!confirm(t.families.deleteConfirm(name))) return
    try {
      await deleteFamily(id)
      setFamilies(prev => prev.filter(f => f.id !== id))
    } catch {
      alert(t.families.deleteFailed)
    }
  }

  function handleRowRightClick(e, family) {
    e.preventDefault()
    const menuWidth = 160
    const menuHeight = 90
    const x = e.clientX + menuWidth > window.innerWidth ? e.clientX - menuWidth : e.clientX
    const y = e.clientY + menuHeight > window.innerHeight ? e.clientY - menuHeight : e.clientY
    setContextMenu({ x, y, family })
  }

  function fullName(p) {
    return [p.fName, p.mName, p.lName].filter(Boolean).join(' ')
  }

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t.families.title}</h1>
          <p>{families.length} {families.length === 1 ? t.families.enrolledCountSingle : t.families.enrolledCount}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/families/add')}>
          {t.families.addFamily}
        </button>
      </div>

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder={t.families.searchPlaceholder} value={query} onChange={handleSearch} />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">{t.common.loading}</div>
        ) : families.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 32 }}>👨‍👩‍👧‍👦</div>
            <p>{query ? t.families.noResults : t.families.noFamilies}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t.families.name}</th>
                  <th>{t.families.phone}</th>
                  <th>{t.families.address}</th>
                  <th>{t.families.members}</th>
                  <th>{t.families.joined}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {families.map(f => (
                  <tr
                    key={f.id}
                    className="row-clickable"
                    onClick={() => navigate(`/families/${f.id}`)}
                    onContextMenu={ev => handleRowRightClick(ev, f)}
                  >
                    <td><span style={{ fontWeight: 600 }}>{fullName(f)}</span></td>
                    <td>{f.phoneNum || '—'}</td>
                    <td>
                      {f.address
                        ? `${f.address.cityAddr || ''}${f.address.stateAddr ? ', ' + f.address.stateAddr : ''}`
                        : '—'}
                    </td>
                    <td>{f.familyMembers?.length ?? 0}</td>
                    <td>{formatDate(f.joinedDate)}</td>
                    <td onClick={ev => ev.stopPropagation()}>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id, fullName(f))}>
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
          <div className="context-menu-item" onClick={() => { setContextMenu(null); navigate(`/families/${contextMenu.family.id}`) }}>
            <span>👁</span> {t.common.view}
          </div>
          <div className="context-menu-divider" />
          <div className="context-menu-item danger" onClick={() => handleDelete(contextMenu.family.id, fullName(contextMenu.family))}>
            <span>🗑</span> {t.common.delete}
          </div>
        </div>
      )}
    </>
  )
}
