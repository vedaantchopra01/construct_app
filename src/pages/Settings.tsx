import React, { useState } from 'react'
import { useAppState } from '../state/AppState'
import '../styles/pocketplan.css'

const Settings: React.FC = () => {
  const { privacyMode, togglePrivacy, profile, setProfile } = useAppState()
  const [goal, setGoal] = useState<number>(profile?.monthlyGoal || 0)
  const [goalProgress, setGoalProgress] = useState<number>(profile?.goalProgress || 0)

  const printReport = () => {
    const w = window.open('', '_blank')
    if (!w) return
    const doc = `
      <html><head><title>FinGen Monthly Report</title></head>
      <body>
        <h1>Monthly Report</h1>
        <p>Income: ₹${profile?.income ?? 0}</p>
        <p>Rent: ₹${profile?.rent ?? 0}</p>
        <p>Food: ₹${profile?.food ?? 0}</p>
        <p>Transport: ₹${profile?.transport ?? 0}</p>
        <p>Other: ₹${profile?.other ?? 0}</p>
        <script>window.print()</script>
      </body></html>
    `
    w.document.write(doc)
    w.document.close()
  }

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">Settings ⚙️</h2>
        <div className="pp-list" style={{ marginTop: 10 }}>
          <div className="pp-list-item">
            <div>
              <div className="pp-bold">Privacy Mode</div>
              <div className="pp-subtitle">Hide balances on dashboard</div>
            </div>
            <button className="pp-btn pp-btn-primary" onClick={togglePrivacy}>{privacyMode ? 'Disable' : 'Enable'}</button>
          </div>
          <div className="pp-list-item">
            <div>
              <div className="pp-bold">Monthly Report PDF</div>
              <div className="pp-subtitle">Download via browser print</div>
            </div>
            <button className="pp-btn pp-btn-primary" onClick={printReport}>Generate</button>
          </div>
          <div className="pp-list-item">
            <div style={{ flex: 1 }}>
              <div className="pp-bold">Monthly Goal 🎯</div>
              <div className="pp-row" style={{ marginTop: 8 }}>
                <div className="pp-col">
                  <label className="pp-label">Amount (₹)</label>
                  <input className="pp-number" type="number" value={goal || ''} onChange={(e) => setGoal(Math.max(0, Number(e.target.value)))} />
                </div>
                <div className="pp-col">
                  <label className="pp-label">Progress (%)</label>
                  <input className="pp-number" type="number" value={goalProgress || ''} onChange={(e) => setGoalProgress(Math.max(0, Math.min(100, Number(e.target.value))))} />
                  <div className="pp-progress" style={{ marginTop: 8 }}><div style={{ width: `${goalProgress}%` }} /></div>
                </div>
              </div>
            </div>
            <button className="pp-btn pp-btn-primary" onClick={() => {
              setProfile({ ...(profile || { income:0, rent:0, food:0, transport:0, other:0, persona:'College', goal:'Save' }), monthlyGoal: goal, goalProgress })
              const toast = document.createElement('div')
              toast.className = 'pp-toast'
              toast.textContent = 'Goal saved ✅'
              document.body.appendChild(toast)
              setTimeout(() => toast.remove(), 1500)
            }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings