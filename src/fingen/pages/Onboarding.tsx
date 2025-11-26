import React, { useMemo, useState } from 'react'
import { useAppState, Persona, Goal, Theme } from '../state/AppState'
import '../../pocketplan/styles.css'

const Onboarding: React.FC = () => {
  const { setProfile, setTheme, theme } = useAppState()
  const [name, setName] = useState<string>('')
  const [income, setIncome] = useState<number>(0)
  const [rent, setRent] = useState<number>(0)
  const [food, setFood] = useState<number>(0)
  const [transport, setTransport] = useState<number>(0)
  const [other, setOther] = useState<number>(0)
  const [persona, setPersona] = useState<Persona>('College')
  const [goal, setGoal] = useState<Goal>('Save')
  const [prefSavings, setPrefSavings] = useState<number>(0)
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0)

  const totals = useMemo(() => {
    const totalExpenses = rent + food + transport + other
    const remaining = Math.max(0, income - totalExpenses)
    const savingsPct = income > 0 ? Math.round((remaining / income) * 100) : 0
    const suggestion = remaining < income * 0.2
      ? 'Try cutting food/transport to save 20%.'
      : 'Great! You are saving well. Consider investing small amounts.'
    return { totalExpenses, remaining, savingsPct, suggestion }
  }, [income, rent, food, transport, other])

  const save = () => {
    setProfile({ name, income, rent, food, transport, other, persona, goal, preferredSavings: prefSavings, monthlyGoal, goalProgress: 0 })
    alert('Onboarding saved! Head to Budget Planner next.')
  }

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">Let’s set you up ✨</h2>
        <p className="pp-subtitle">Add your monthly numbers and preferences.</p>
        <div className="pp-row" style={{ marginTop: 10 }}>
          <div className="pp-col">
            <label className="pp-label">Your Name</label>
            <input className="pp-input" placeholder="e.g., Vedaant" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="pp-col">
            <label className="pp-label">Monthly Income</label>
            <input className="pp-number" type="number" value={income || ''} onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))} />
          </div>
          <div className="pp-col">
            <label className="pp-label">Rent</label>
            <input className="pp-number" type="number" value={rent || ''} onChange={(e) => setRent(Math.max(0, Number(e.target.value)))} />
          </div>
        </div>
        <div className="pp-row" style={{ marginTop: 10 }}>
          <div className="pp-col">
            <label className="pp-label">Food</label>
            <input className="pp-number" type="number" value={food || ''} onChange={(e) => setFood(Math.max(0, Number(e.target.value)))} />
          </div>
          <div className="pp-col">
            <label className="pp-label">Transport</label>
            <input className="pp-number" type="number" value={transport || ''} onChange={(e) => setTransport(Math.max(0, Number(e.target.value)))} />
          </div>
        </div>
        <div className="pp-row" style={{ marginTop: 10 }}>
          <div className="pp-col">
            <label className="pp-label">Other Expenses</label>
            <input className="pp-number" type="number" value={other || ''} onChange={(e) => setOther(Math.max(0, Number(e.target.value)))} />
          </div>
        </div>

        <div className="pp-row" style={{ marginTop: 12 }}>
          <div className="pp-col">
            <label className="pp-label">Persona</label>
            <div className="pp-toggle">
              {(['College','School','Working'] as Persona[]).map(p => (
                <button key={p} className={persona === p ? 'active' : ''} onClick={() => setPersona(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="pp-col">
            <label className="pp-label">Financial Goal</label>
            <div className="pp-toggle">
              {(['Save','Track','Learn','Invest','Rewards'] as Goal[]).map(g => (
                <button key={g} className={goal === g ? 'active' : ''} onClick={() => setGoal(g)}>{g}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences: savings, monthly goal, and theme vibe */}
        <div className="pp-row" style={{ marginTop: 10 }}>
          <div className="pp-col">
            <label className="pp-label">Preferred Savings</label>
            <input className="pp-number" type="number" value={prefSavings || ''} onChange={(e) => setPrefSavings(Math.max(0, Number(e.target.value)))} />
          </div>
          <div className="pp-col">
            <label className="pp-label">Monthly Goal (₹)</label>
            <input className="pp-number" type="number" value={monthlyGoal || ''} onChange={(e) => setMonthlyGoal(Math.max(0, Number(e.target.value)))} />
          </div>
          <div className="pp-col">
            <label className="pp-label">Theme Vibe</label>
            <div className="pp-toggle">
              {(['FoodLover','SelfCare','Fitness'] as Theme[]).map(t => (
                <button key={t} className={theme === t ? 'active' : ''} onClick={() => setTheme(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="pp-summary-grid" style={{ marginTop: 12 }}>
          <div className="pp-summary-card"><h4>Total Expenses</h4><div className="pp-summary-amount">₹{totals.totalExpenses}</div></div>
          <div className="pp-summary-card"><h4>Remaining</h4><div className="pp-summary-amount">₹{totals.remaining}</div></div>
          <div className="pp-summary-card"><h4>Savings %</h4><div className="pp-summary-amount">{totals.savingsPct}%</div></div>
        </div>
        <div className="pp-message" style={{ marginTop: 10 }}>{totals.suggestion}</div>
        <div style={{ marginTop: 14 }}>
          <button className="pp-btn pp-btn-primary" disabled={income <= 0} onClick={save}>Save & Continue →</button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding