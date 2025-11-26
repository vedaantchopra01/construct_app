import React, { useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import '../styles/pocketplan.css'

const pvFuture = (monthly: number, months: number, annualRatePct: number) => {
  const r = annualRatePct / 100 / 12
  
  const fv = monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r))
  return Math.round(fv)
}

const Invest: React.FC = () => {
  const { profile, budgetPlan, notify } = useAppState()
  const [sip, setSip] = useState(500)
  const [years, setYears] = useState(5)
  const [rate, setRate] = useState(10)
  const months = years * 12
  const futureValue = useMemo(() => pvFuture(sip, months, rate), [sip, months, rate])

  const recommendation = useMemo(() => {
    const income = profile?.income || 0
    const essentials = (profile?.rent || 0) + (profile?.food || 0) + (profile?.transport || 0) + (profile?.other || 0)
    const remaining = Math.max(0, income - essentials)
    const saved = budgetPlan?.savings || Math.round(remaining * 0.5)
    
    let recommended = Math.round(saved * 0.3)
    const tip = remaining < saved ? 'Expenses high! Reduce investments temporarily.' : `You are saving ₹${saved} → Invest ₹${recommended} safely.`
    return { recommended, saved, remaining, tip }
  }, [profile, budgetPlan])

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">Start Investing (from ₹10) 📈</h2>
        <p className="pp-subtitle">Guidance-only. No real money unless bank is linked.</p>

        <div className="pp-row" style={{ marginTop: 8 }}>
          <div className="pp-col"><label className="pp-label">Monthly SIP</label><input className="pp-number" type="number" value={sip} onChange={e => setSip(Math.max(10, Number(e.target.value)))} /></div>
          <div className="pp-col"><label className="pp-label">Years</label><input className="pp-number" type="number" value={years} onChange={e => setYears(Math.max(1, Number(e.target.value)))} /></div>
          <div className="pp-col"><label className="pp-label">Expected Return % (p.a.)</label><input className="pp-number" type="number" value={rate} onChange={e => setRate(Math.max(1, Number(e.target.value)))} /></div>
        </div>

        <div className="pp-summary-grid" style={{ marginTop: 10 }}>
          <div className="pp-summary-card"><h4>Future Value</h4><div className="pp-summary-amount">₹{futureValue}</div></div>
          <div className="pp-summary-card"><h4>Total Invested</h4><div className="pp-summary-amount">₹{sip * months}</div></div>
          <div className="pp-summary-card"><h4>Gain</h4><div className="pp-summary-amount">₹{futureValue - sip * months}</div></div>
        </div>

        <div className="pp-message" style={{ marginTop: 10 }}>Risk meter: Conservative → Moderate → Aggressive. Try gold savings and digital FDs for low risk; mini mutual funds for moderate risk.</div>

        <div style={{ marginTop: 12 }}>
          <h3 className="pp-heading" style={{ fontSize: 20 }}>Smart Recommendation</h3>
          <div className="pp-summary-grid" style={{ marginTop: 8 }}>
            <div className="pp-summary-card"><h4>Remaining</h4><div className="pp-summary-amount">₹{recommendation.remaining}</div></div>
            <div className="pp-summary-card"><h4>Saved</h4><div className="pp-summary-amount">₹{recommendation.saved}</div></div>
            <div className="pp-summary-card"><h4>Recommended Invest</h4><div className="pp-summary-amount">₹{recommendation.recommended}</div></div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div className="pp-progress"><div style={{ width: `${Math.min(100, Math.round((recommendation.recommended / Math.max(1, recommendation.saved)) * 100))}%` }} /></div>
            <div className="pp-subtitle" style={{ marginTop: 4 }}>{recommendation.tip}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className="pp-btn pp-btn-primary" onClick={() => { setSip(recommendation.recommended); notify('Investment plan updated to smart recommendation.'); }}>Apply Recommendation</button>
              <button className="pp-btn" onClick={() => setSip(Math.max(10, Math.round(recommendation.recommended * 1.2)))}>Aggressive +20%</button>
              <button className="pp-btn" onClick={() => setSip(Math.max(10, Math.round(recommendation.recommended * 0.8)))}>Conservative -20%</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <h3 className="pp-heading" style={{ fontSize: 20 }}>Options</h3>
          <div className="pp-list">
            <div className="pp-list-item"><div><div className="pp-bold">SIP Examples</div><div className="pp-subtitle">₹100 • ₹500 • ₹1000 per month</div></div></div>
            <div className="pp-list-item"><div><div className="pp-bold">Gold Savings</div><div className="pp-subtitle">Secure, hedges inflation</div></div></div>
            <div className="pp-list-item"><div><div className="pp-bold">Digital Fixed Deposits</div><div className="pp-subtitle">Stable returns, low risk</div></div></div>
            <div className="pp-list-item"><div><div className="pp-bold">Mini Mutual Funds</div><div className="pp-subtitle">Diversified exposure for beginners</div></div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invest