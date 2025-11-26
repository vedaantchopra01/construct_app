import React, { useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import '../../pocketplan/styles.css'

const BudgetPlanner: React.FC = () => {
  const { profile, setProfile, setBudgetPlan } = useAppState()
  const income = profile?.income || 0
  const [rent, setRent] = useState<number>(profile?.rent || 0)
  const [food, setFood] = useState<number>(profile?.food || 0)
  const [transport, setTransport] = useState<number>(profile?.transport || 0)
  const [misc, setMisc] = useState<number>(profile?.other || 0)
  const [savings, setSavings] = useState<number>(profile?.preferredSavings || Math.round(income * 0.2))
  const essentials = rent + food + transport + misc

  const plan = useMemo(() => {
    const base = Math.max(0, income)
    const investments = Math.round(base * 0.1)
    const essentialsCalc = Math.max(0, essentials)
    const wants = Math.max(0, base - (essentialsCalc + savings + investments))
    const overspendAlert = essentialsCalc > Math.round(base * 0.5)
    return { essentials: essentialsCalc, wants, savings, investments, overspendAlert }
  }, [income, essentials, savings])

  const total = plan.essentials + plan.wants + plan.savings + plan.investments
  const remaining = Math.max(0, income - total)

  const savePlan = () => {
    setBudgetPlan(plan)
    setProfile({ ...(profile || { income: 0, rent: 0, food: 0, transport: 0, other: 0, persona: 'College', goal: 'Save' }), rent, food, transport, other: misc, preferredSavings: savings })
    const toast = document.createElement('div')
    toast.className = 'pp-message'
    toast.style.position = 'fixed'; toast.style.bottom = '24px'; toast.style.left = '50%'; toast.style.transform = 'translateX(-50%)'; toast.style.zIndex = '1000'
    toast.textContent = 'Budget updated ✅'
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 1200)
  }

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">AI Monthly Budget Planner 🧠</h2>
        <p className="pp-subtitle">Personalized split into Essentials / Wants / Savings / Investments</p>

        <div className="pp-summary-grid" style={{ marginTop: 6 }}>
          <div className="pp-summary-card"><h4>Essentials</h4><div className="pp-summary-amount">₹{plan.essentials}</div></div>
          <div className="pp-summary-card"><h4>Wants</h4><div className="pp-summary-amount">₹{plan.wants}</div></div>
          <div className="pp-summary-card"><h4>Savings</h4><div className="pp-summary-amount">₹{plan.savings}</div></div>
          <div className="pp-summary-card"><h4>Investments</h4><div className="pp-summary-amount">₹{plan.investments}</div></div>
        </div>
        {plan.overspendAlert && <div className="pp-message">Overspending alert ⚠️ Essentials exceed 50% of income. Try reducing rent/food/transport.</div>}

        {/* Sliders with editable fields beside */}
        <div style={{ marginTop: 10 }}>
          {[
            { label: 'Rent', value: rent, set: setRent },
            { label: 'Food', value: food, set: setFood },
            { label: 'Transport', value: transport, set: setTransport },
            { label: 'Savings', value: savings, set: setSavings },
            { label: 'Misc', value: misc, set: setMisc },
          ].map((row) => (
            <div key={row.label} className="pp-row" style={{ alignItems: 'center', marginTop: 8 }}>
              <div className="pp-col" style={{ flex: 2 }}>
                <label className="pp-label">{row.label}</label>
                <input type="range" min={0} max={income} value={row.value} onChange={(e) => row.set(Number(e.target.value))} />
              </div>
              <div className="pp-col" style={{ flex: 1 }}>
                <input className="pp-number" type="number" value={row.value} onChange={(e) => row.set(Math.max(0, Number(e.target.value)))} />
              </div>
            </div>
          ))}
          <div className="pp-message">Suggestion 💡 Reduce Food by 10% to increase Savings.</div>
        </div>

        <div className="pp-row" style={{ marginTop: 10 }}>
          <div className="pp-col">
            <label className="pp-label">Income</label>
            <div className="pp-summary-amount">₹{income}</div>
          </div>
          <div className="pp-col">
            <label className="pp-label">Allocated Total</label>
            <div className="pp-summary-amount">₹{total}</div>
          </div>
          <div className="pp-col">
            <label className="pp-label">Remaining</label>
            <div className="pp-summary-amount">₹{remaining}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="pp-btn pp-btn-primary" onClick={savePlan}>Save Plan</button>
        </div>
      </div>
    </div>
  )
}

export default BudgetPlanner