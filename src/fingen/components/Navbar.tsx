import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppState } from '../state/AppState'
import { useAuth } from '../../contexts/AuthContext'
import '../../pocketplan/styles.css'
import '../styles/navbar.css'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/budget', label: 'Budget Planner' },
  { to: '/invest', label: 'Start Investing' },
  { to: '/bank', label: 'Bank & Payments' },
  { to: '/learn', label: 'Learn Finance' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/community', label: 'Community' },
  { to: '/coach', label: 'AI Coach' },
  { to: '/insights', label: 'AI Insights' },
  { to: '/spend', label: 'Daily Spend' },
  { to: '/split', label: 'Bill Splitter' },
  { to: '/notes', label: 'Notifications' },
  { to: '/settings', label: 'Settings' }
]

const Navbar: React.FC = () => {
  const loc = useLocation()
  const { theme, setTheme, profile, rewards, trustScore, totalBalance, logout } = useAppState()
  const { user, logout: authLogout } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`mb-navbar ${scrolled ? 'mb-navbar-scrolled' : ''}`}>
      <div className="mb-nav-inner">
        <div className="mb-brand">
          <div className="mb-logo" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
              <circle cx="11" cy="11" r="9" fill="url(#g1)" className="mb-logo-pulse" />
              <path d="M6 12 L10 8 L12 10 L16 6" stroke="#E6EDF3" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className="mb-title">MoneyBreak</div>
        </div>

        <div className="mb-stats">
          <div className="mb-stat">
            <div className="mb-stat-label">Welcome</div>
            <div className="mb-stat-value">{(user?.name || profile?.name) ? `${user?.name || profile?.name} 👋` : 'Guest'}</div>
          </div>
          <div className="mb-divider" />
          <div className="mb-stat">
            <div className="mb-stat-label">XP</div>
            <div className="mb-stat-value">{rewards}</div>
          </div>
          <div className="mb-divider" />
          <div className="mb-stat">
            <div className="mb-stat-label">Trust</div>
            <div className="mb-stat-value">{trustScore}%</div>
          </div>
          <div className="mb-divider" />
          <div className="mb-stat">
            <div className="mb-stat-label">Balance</div>
            <div className="mb-stat-value">₹{totalBalance}</div>
          </div>
        </div>

        <div className="mb-actions">
          <div className="mb-links">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`mb-link ${loc.pathname === l.to ? 'active' : ''}`}>{l.label}</Link>
            ))}
          </div>
          <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="mb-theme-select">
            <option value="FoodLover">Food Lover</option>
            <option value="SelfCare">Self-Care</option>
            <option value="Fitness">Fitness</option>
          </select>
          <button className="mb-logout" onClick={() => { authLogout(); logout(); }}>Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar