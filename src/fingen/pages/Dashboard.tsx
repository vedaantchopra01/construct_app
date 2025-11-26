import React, { useEffect, useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import '../../pocketplan/styles.css'
import '../styles/dashboard.css'

const Dashboard: React.FC = () => {
  const { profile, budgetPlan, bankAccounts, transactions, rewards, level, notifications, privacyMode, addTransaction, notify, streakDays, trustScore, totalBalance } = useAppState()

  const totals = useMemo(() => {
    const income = profile?.income || 0
    const essentials = (profile?.rent || 0) + (profile?.food || 0) + (profile?.transport || 0) + (profile?.other || 0)
    const remaining = Math.max(0, income - essentials)
    const savingsPct = income > 0 ? Math.round((remaining / income) * 100) : 0
    return { income, essentials, remaining, savingsPct }
  }, [profile])

  const dist = useMemo(() => {
    const bp = budgetPlan || { essentials: totals.essentials, wants: Math.round((profile?.income || 0) * 0.2), savings: Math.round((profile?.income || 0) * 0.2), investments: Math.round((profile?.income || 0) * 0.1) }
    const sum = Math.max(1, bp.essentials + bp.wants + bp.savings + bp.investments)
    return {
      segments: [
        { label: 'Essentials', value: bp.essentials, color: '#A78BFA' },
        { label: 'Wants', value: bp.wants, color: '#22D3EE' },
        { label: 'Savings', value: bp.savings, color: '#34D399' },
        { label: 'Invest', value: bp.investments, color: '#F59E0B' },
      ],
      sum
    }
  }, [budgetPlan, profile, totals])

  const goalProgressPct = useMemo(() => {
    const goal = profile?.monthlyGoal || 0
    if (!goal) return 0
    const saved = budgetPlan?.savings || Math.max(0, totals.remaining)
    return Math.max(0, Math.min(100, Math.round((saved / goal) * 100)))
  }, [profile, budgetPlan, totals])

  // Add Expense quick CTA
  const [showAdd, setShowAdd] = useState(false)
  const [newTx, setNewTx] = useState<{ amount: number; description: string; category: string; type: 'debit' | 'credit' }>({ amount: 100, description: '', category: 'Food', type: 'debit' })

  const submitTx = () => {
    if (!newTx.description || newTx.amount <= 0) return
    addTransaction({ amount: newTx.amount, description: newTx.description, category: newTx.category, type: newTx.type })
    notify('Transaction added ✅')
    setShowAdd(false)
    setNewTx({ amount: 100, description: '', category: 'Food', type: 'debit' })
  }

  // Spending trend indicator
  const trend = useMemo(() => {
    const debits = transactions.filter(t => t.type === 'debit')
    const recent = debits.slice(0, 5).reduce((s, t) => s + t.amount, 0)
    const prev = debits.slice(5, 10).reduce((s, t) => s + t.amount, 0)
    const diff = recent - prev
    const up = diff > 0
    return { recent, prev, diff, up }
  }, [transactions])

  const [selected, setSelected] = useState<string | null>(null)
  const [animateDraw, setAnimateDraw] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimateDraw(true), 30); return () => clearTimeout(t) }, [])

  return (
    <div>
        <h2 className="bnm-hello">Hi, {profile?.name || 'Alex'}</h2>
        <p className="bnm-sub">Welcome to gen Z finance dashboard.</p>

        <section className="bnm-kpis">
          <div className="bnm-card bnm-balance">
            <div className="bnm-label">Total Balance</div>
            <div className="bnm-amount">₹{privacyMode ? '••••••' : (totalBalance || 0).toLocaleString('en-IN')}</div>
            <div className="bnm-sparkline" aria-hidden />
          </div>
          <div className="bnm-card bnm-income">
            <div className="bnm-label">Income</div>
            <div className="bnm-amount-small">₹{privacyMode ? '••••' : (totals.income || 0).toLocaleString('en-IN')}</div>
          </div>
          <div className="bnm-card bnm-expenses">
            <div className="bnm-label">Expenses</div>
            <div className="bnm-amount-small">₹{privacyMode ? '••••' : (totals.essentials || 0).toLocaleString('en-IN')}</div>
          </div>
          <div className="bnm-card bnm-savings">
            <div className="bnm-label">Monthly Savings</div>
            <div className="bnm-amount-small">₹{privacyMode ? '••••' : (totals.remaining || 0).toLocaleString('en-IN')}</div>
            <div className="bnm-progress"><div style={{ width: `${totals.savingsPct}%` }} /></div>
          </div>
        </section>

        <div className="bnm-grid">
          <section className="bnm-card bnm-upcoming">
            <h3 className="bnm-card-title">Upcoming Payments</h3>
            <ul className="bnm-list">
              <li><span className="bnm-logo">🅽</span><span>Netflix</span><span>₹199</span></li>
              <li><span className="bnm-logo">🅂</span><span>Spotify</span><span>₹119</span></li>
              <li><span className="bnm-logo">🄿</span><span>Amazon Prime</span><span>₹299</span></li>
            </ul>
          </section>

          <section className="bnm-card bnm-budget">
            <h3 className="bnm-card-title">Budget Overview</h3>
            {(() => {
              const inc = Math.max(1, totals.income)
              const pct = (v: number) => Math.min(100, Math.round((v / inc) * 100))
              const bars = [
                { name: 'Food', value: profile?.food || 0 },
                { name: 'Transport', value: profile?.transport || 0 },
                { name: 'Shopping', value: Math.round((profile?.income || 0) * 0.1) },
                { name: 'Entertainment', value: Math.round((profile?.income || 0) * 0.08) }
              ]
              return (
                <div className="bnm-bars">
                  {bars.map(b => (
                    <div key={b.name} className="bnm-bar-row">
                      <span>{b.name}</span>
                      <div className="bnm-progress"><div style={{ width: `${pct(b.value)}%` }} /></div>
                      <span className="bnm-pct">{pct(b.value)}%</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </section>

          <section className="bnm-card bnm-gamify">
            <h3 className="bnm-card-title">Gamification</h3>
            <div className="bnm-metric-row"><span>XP Points</span><span>{rewards}</span></div>
            <div className="bnm-progress"><div style={{ width: `${Math.min(100, rewards % 100)}%` }} /></div>
            <div className="bnm-metric-row"><span>Account Score</span><span>{trustScore}/100</span></div>
            <div className="bnm-progress"><div style={{ width: `${Math.min(100, trustScore)}%` }} /></div>
          </section>

          <section className="bnm-card bnm-ai">
            <h3 className="bnm-card-title">Smart AI Insights</h3>
            <div className="bnm-insight">You overspent ₹{Math.max(0, (profile?.food || 0) - 1200)} on food this week 🍕</div>
            <div className="bnm-insight">Transport is {trend.up ? '18%' : '10%'} {trend.up ? 'higher' : 'lower'} than usual 🚗</div>
            <div className="bnm-insight">You're doing great! Savings increased by {totals.savingsPct}% 🥳</div>
          </section>
        </div>

        {/* Quick actions */}
        <div className="bnm-cta-row">
          <button className="pp-btn pp-btn-primary" onClick={() => setShowAdd(true)}>Add Expense +</button>
          <a href="/#/wizard" className="pp-btn pp-btn-primary">Run AI Budget ▶</a>
        </div>

        {showAdd && (
          <div className="db-add-modal">
            <div className="db-add-card">
              <div className="pp-heading" style={{ fontSize: 18 }}>Quick Add Expense</div>
              <div className="pp-row" style={{ marginTop: 8 }}>
                <div className="pp-col"><label className="pp-label">Amount</label><input className="pp-number" type="number" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: Math.max(1, Number(e.target.value)) })} /></div>
                <div className="pp-col"><label className="pp-label">Category</label>
                  <select className="pp-input" value={newTx.category} onChange={e => setNewTx({ ...newTx, category: e.target.value })}>
                    {['Food','Rent','Transport','Self-care','Gym','Shopping','Misc','UPI'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pp-col"><label className="pp-label">Type</label>
                  <select className="pp-input" value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value as any })}>
                    <option value="debit">Expense</option>
                    <option value="credit">Income</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <label className="pp-label">Description</label>
                <input className="pp-input" type="text" value={newTx.description} onChange={e => setNewTx({ ...newTx, description: e.target.value })} placeholder="e.g., Swiggy lunch" />
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button className="pp-btn pp-btn-primary" onClick={submitTx}>Add</button>
                <button className="pp-btn" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications (kept from existing) */}
        <section className="bnm-card" style={{ marginTop: 14 }}>
          <h3 className="bnm-card-title">Notifications 🔔</h3>
          {notifications.length === 0 && <div className="pp-message">No alerts right now. Keep making smart moves! ✨</div>}
          <div className="pp-list">
            {notifications.map(n => (
              <div key={n.id} className="pp-list-item">
                <div>
                  <div className="pp-bold">{new Date(n.createdAt).toLocaleString()}</div>
                  <div className="pp-subtitle">{n.message}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gamification pills */}
        <div className="mb-gamify">
          <div className="mb-badge">🔥 Streak {streakDays}d</div>
          <div className="mb-badge">⭐ Level {level}</div>
          <div className="mb-badge">🏆 XP {rewards}</div>
        </div>
    </div>
  )
}

export default Dashboard