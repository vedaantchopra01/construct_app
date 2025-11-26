import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAppState } from '../state/AppState'
import '../styles/pocketplan.css'
import '../styles/dashboard.css'

const AppLayout: React.FC = () => {
  const { profile, theme, setTheme } = useAppState()

  return (
    <div className="bnm-layout">
      <aside className="bnm-sidebar">
        <div className="bnm-brand">BNM</div>
        <div className="bnm-tagline">Broke No More</div>
        <nav className="bnm-sidenav">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/onboarding" className={({isActive}) => isActive ? 'active' : ''}>Setup</NavLink>
          <NavLink to="/bank" className={({isActive}) => isActive ? 'active' : ''}>Accounts</NavLink>
          <NavLink to="/bank" className={({isActive}) => isActive ? 'active' : ''}>Payments</NavLink>
          <NavLink to="/spend" className={({isActive}) => isActive ? 'active' : ''}>Cards</NavLink>
          <NavLink to="/budget" className={({isActive}) => isActive ? 'active' : ''}>Budget</NavLink>
          <NavLink to="/sip" className={({isActive}) => isActive ? 'active' : ''}>SIP</NavLink>
          <NavLink to="/insights" className={({isActive}) => isActive ? 'active' : ''}>Insights</NavLink>
          <NavLink to="/rewards" className={({isActive}) => isActive ? 'active' : ''}>Rewards</NavLink>
          <NavLink to="/community" className={({isActive}) => isActive ? 'active' : ''}>Community</NavLink>
          <NavLink to="/edu" className={({isActive}) => isActive ? 'active' : ''}>Edu Videos</NavLink>
        </nav>
      </aside>

      <main className="bnm-main">
        <header className="bnm-header">
          <input className="bnm-search" placeholder="Search artwork" />
          <div className="bnm-actions">
            <button className="bnm-icon" title="Notifications">🔔</button>
            <div className="bnm-avatar" title={profile?.name || 'User'}>{(profile?.name || 'A')[0]}</div>
            <button className="bnm-more">More more ▾</button>
            <select className="bnm-theme-select" value={theme} onChange={e => setTheme(e.target.value as any)}>
              <option value="Dark">Dark</option>
              <option value="Neon">Neon</option>
              <option value="Light">Light</option>
            </select>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout