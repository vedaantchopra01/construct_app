import React, { useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import '../../pocketplan/styles.css'
import '../styles/invest.css'

const SIP: React.FC = () => {
  const { profile, budgetPlan, rewards, watched, bankAccounts, addSIPPlan, sipPlans, toggleSIPPlan, runSIPNow } = useAppState()
  const [amount, setAmount] = useState(500)
  const [day, setDay] = useState(5)
  const [asset, setAsset] = useState('Index Fund')
  const [accountId, setAccountId] = useState<string>(bankAccounts[0]?.id || '')

  const videosWatched = useMemo(() => Object.values(watched).filter(Boolean).length, [watched])
  const savings = budgetPlan?.savings || Math.round((profile?.income || 0) * 0.2)
  const literacyFactor = Math.min(1.4, 1 + (videosWatched / 20)) // + up to 40%
  const recommended = Math.max(100, Math.round((savings * 0.25) * (literacyFactor)))

  const enable = () => {
    if (!accountId) return alert('Please link/select a bank account')
    addSIPPlan({ amount, day, asset, accountId, active: true })
  }

  return (
    <div className="sip-shell">
      <div className="sip-card">
        <h2 className="sip-title">Monthly SIP (Auto‑Invest)</h2>
        <p className="sip-sub">Set a fixed amount to invest every month. Recommendation adapts based on your financial literacy and savings.</p>

        <div className="sip-grid">
          <div>
            <label className="sip-label">Amount (₹)</label>
            <input className="sip-input" type="number" value={amount} onChange={e => setAmount(Math.max(10, Number(e.target.value)))} />
          </div>
          <div>
            <label className="sip-label">Day of Month</label>
            <input className="sip-input" type="number" value={day} onChange={e => setDay(Math.min(28, Math.max(1, Number(e.target.value))))} />
          </div>
          <div>
            <label className="sip-label">Asset</label>
            <select className="sip-input" value={asset} onChange={e => setAsset(e.target.value)}>
              <option>Index Fund</option>
              <option>Gold Savings</option>
              <option>Digital FD</option>
              <option>Balanced Mutual</option>
            </select>
          </div>
          <div>
            <label className="sip-label">Bank Account</label>
            <select className="sip-input" value={accountId} onChange={e => setAccountId(e.target.value)}>
              {bankAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="sip-reco">
          <div>
            <div className="sip-reco-title">Recommended</div>
            <div className="sip-reco-amt">₹{recommended}</div>
            <div className="sip-tip">Savings: ₹{savings} • Videos watched: {videosWatched} • Rewards: {rewards}</div>
          </div>
          <div className="sip-reco-actions">
            <button className="sip-btn" onClick={() => setAmount(recommended)}>Apply</button>
            <button className="sip-btn" onClick={() => setAmount(Math.max(10, Math.round(recommended * 1.2)))}>Aggressive +20%</button>
            <button className="sip-btn" onClick={() => setAmount(Math.max(10, Math.round(recommended * 0.8)))}>Conservative -20%</button>
          </div>
        </div>

        <div className="sip-actions">
          <button className="sip-btn sip-primary" onClick={enable}>Enable Auto‑Invest</button>
        </div>

        <div className="sip-list">
          <h3 className="sip-subtitle">Active Plans</h3>
          {sipPlans.length === 0 && <div className="sip-note">No SIP yet. Create one above.</div>}
          {sipPlans.map(pl => (
            <div className="sip-item" key={pl.id}>
              <div>
                <div className="sip-item-title">₹{pl.amount}/mo • {pl.asset}</div>
                <div className="sip-item-sub">Day {pl.day} • Bank: {bankAccounts.find(b => b.id === pl.accountId)?.name || '—'}</div>
              </div>
              <div className="sip-item-actions">
                <button className="sip-btn" onClick={() => toggleSIPPlan(pl.id, !pl.active)}>{pl.active ? 'Pause' : 'Resume'}</button>
                <button className="sip-btn" onClick={() => runSIPNow(pl.id)}>Run Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SIP