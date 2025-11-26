import React, { useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import '../styles/pocketplan.css'

const funLines: any[] = [
  (food: number, gym: number) => `Whoa! 😮 You spent ₹${food} on food vs ₹${gym} on gym. Fitness or food? 😅`,
  (transport: number) => `Transport = Money leak 🚗💸… share rides and save ₹${Math.min(800, Math.round(transport * 0.25))} next week.`,
  (rent: number, income: number) => `Rent ate ${Math.round((rent / Math.max(1, income)) * 100)}% of your budget 🏠😵… let’s optimize somewhere else.`,
  (_: number) => `Self-care spree detected 💅✨… good vibes but track the vibes!`
]

const AIInsights: React.FC = () => {
  const { profile, transactions, notify, addRewards } = useAppState()
  const [history, setHistory] = useState<string[]>([])

  const totals = useMemo(() => {
    const cats = { Food: 0, Rent: 0, Transport: 0, Gym: 0, Other: 0, SelfCare: 0 }
    transactions.forEach(t => { cats[(t.category as keyof typeof cats) || 'Other'] = (cats[(t.category as keyof typeof cats) || 'Other'] || 0) + t.amount })
    return cats
  }, [transactions])

  const generateInsight = () => {
    const lines: string[] = []
    lines.push(funLines[0](totals.Food || 0, totals.Gym || 0))
    lines.push(funLines[1](totals.Transport || 0))
    lines.push(funLines[2](profile?.rent || 0, profile?.income || 1))
    lines.push(funLines[3](0))
    const pick = lines[Math.floor(Math.random() * lines.length)]
    setHistory(prev => [pick, ...prev])
    notify(`AI Insight: ${pick}`)
    addRewards(5)
  }

  const summary = useMemo(() => {
    const income = profile?.income || 0
    const essentials = (profile?.rent || 0) + (profile?.food || 0) + (profile?.transport || 0) + (profile?.other || 0)
    const remaining = Math.max(0, income - essentials)
    return { income, essentials, remaining }
  }, [profile])

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">AI Insights 🤖✨</h2>
        <div className="pp-subtitle">Fun, smart nudges based on your recent spending.</div>

        <div className="pp-summary-grid" style={{ marginTop: 8 }}>
          <div className="pp-summary-card"><h4>Income</h4><div className="pp-summary-amount">₹{summary.income}</div></div>
          <div className="pp-summary-card"><h4>Essentials</h4><div className="pp-summary-amount">₹{summary.essentials}</div></div>
          <div className="pp-summary-card"><h4>Remaining</h4><div className="pp-summary-amount">₹{summary.remaining}</div></div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="pp-btn pp-btn-primary" onClick={generateInsight}>Generate Daily Insight</button>
          <button className="pp-btn" onClick={generateInsight}>Weekly Report</button>
          <button className="pp-btn" onClick={generateInsight}>Monthly Summary</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <h3 className="pp-heading" style={{ fontSize: 20 }}>Insight History</h3>
          {history.length === 0 && <div className="pp-message">No insights yet. Tap any button above!</div>}
          <div className="pp-list">
            {history.map((h, i) => (
              <div key={i} className="pp-list-item"><div className="pp-subtitle">{h}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInsights