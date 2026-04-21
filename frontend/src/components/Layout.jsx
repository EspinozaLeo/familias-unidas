import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Layout({ children }) {
  const { t, lang, toggle } = useLanguage()

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Familias Unidas</h2>
          <span>{t.nav.adminPortal}</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">🏠</span>
            {t.nav.dashboard}
          </NavLink>
          <NavLink to="/families" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">👨‍👩‍👧‍👦</span>
            {t.nav.families}
          </NavLink>
          <NavLink to="/death-events" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📋</span>
            {t.nav.deathEvents}
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📊</span>
            {t.nav.analytics}
          </NavLink>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={toggle}
            style={{
              width: '100%', padding: '8px', borderRadius: 8,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            🌐 {lang === 'en' ? 'Español' : 'English'}
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
