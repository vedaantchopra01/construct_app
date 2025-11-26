import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Finance App</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link to="/transactions" style={{ color: 'white', textDecoration: 'none' }}>
            Transactions
          </Link>
          <Link to="/insights" style={{ color: 'white', textDecoration: 'none' }}>
            AI Insights
          </Link>
          <Link to="/wizard" style={{ color: 'white', textDecoration: 'none' }}>
            AI Budget
          </Link>
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="btn" style={{ background: '#dc3545', color: 'white' }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar