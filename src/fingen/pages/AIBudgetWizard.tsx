import React, { useEffect, useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import '../styles/ai.css'
import '../../pocketplan/styles.css'

type Step = 'intro' | 'collect' | 'analyze' | 'recommend' | 'summary'

const clamp = (n: number, min = 0) => Math.max(min, Math.round(n))

const AIBudgetWizard: React.FC = () => {
  const { profile, transactions, setBudgetPlan, notify, addRewards } = useAppState()
  const [step, setStep] = useState<Step>('intro')
  const [pct, setPct] = useState(0)

  const income = profile?.income || 0

  const recentTotals = useMemo(() => {
    const cats: Record<string, number> = { Food: 0, Rent: 0, Transport: 0, 'Self-care': 0, Gym: 0, Shopping: 0, Misc: 0 }
    transactions.slice(0, 30).forEach(t => {
      const key = cats[t.category] !== undefined ? t.category : 'Misc'
      cats[key] = (cats[key] || 0) + (t.type === 'debit' ? t.amount : 0)
    })
    return cats
  }, [transactions])

  const rec = useMemo(() => {
    const base = {
      Rent: clamp(profile?.rent || income * 0.3),
      Food: clamp((profile?.food || 0) > 0 ? profile!.food : income * 0.15),
      Transport: clamp((profile?.transport || 0) > 0 ? profile!.transport : income * 0.1),
      'Self-care': clamp(income * 0.05),
      Gym: clamp(income * 0.05),
      Shopping: clamp(income * 0.1),
      Misc: clamp(income * 0.05),
      Savings: clamp(income * 0.15),
      Invest: clamp(income * 0.05)
    }
    // Adaptive nudges: if overspending recently, bump by +10% and trim elsewhere
    const bump = (k: keyof typeof base) => { base[k] = clamp(base[k] * 1.1) }
    const cut = (k: keyof typeof base) => { base[k] = clamp(base[k] * 0.95) }
    if (recentTotals.Food > base.Food) { bump('Food'); cut('Shopping') }
    if (recentTotals.Transport > base.Transport) { bump('Transport'); cut('Misc') }
    const sumSpend = base.Rent + base.Food + base.Transport + base['Self-care'] + base.Gym + base.Shopping + base.Misc
    const sumTotal = sumSpend + base.Savings + base.Invest
    // Normalize to income ceiling
    if (sumTotal > income && income > 0) {
      const scale = income / sumTotal
      ;(Object.keys(base) as (keyof typeof base)[]).forEach(k => base[k] = clamp(base[k] * scale))
    }
    return base
  }, [income, profile, recentTotals])

  useEffect(() => {
    let i = 0
    const seq: Step[] = ['intro', 'collect', 'analyze', 'recommend', 'summary']
    setStep(seq[i])
    setPct(5)
    const t = setInterval(() => {
      i++
      if (i >= seq.length) { clearInterval(t); return }
      setStep(seq[i])
      setPct(p => Math.min(100, p + 22))
    }, 900)
    return () => clearInterval(t)
  }, [])

  const applyPlan = () => {
    const essentials = rec.Rent + rec.Food + rec.Transport + rec.Misc + rec['Self-care'] + rec.Gym
    const wants = rec.Shopping
    const savings = rec.Savings
    const investments = rec.Invest
    setBudgetPlan({ essentials, wants, savings, investments })
    notify('AI-applied budget plan ✅')
    addRewards(25)
  }

  return (
    <div className="pp-container">
      <div className="ai-shell">
        <div className="ai-header">
          <div className="ai-mascot" aria-hidden>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <defs>
                <linearGradient id="aiG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="26" fill="url(#aiG)" className="ai-pulse" />
              <circle cx="24" cy="28" r="4" fill="#0d1324" />
              <circle cx="40" cy="28" r="4" fill="#0d1324" />
              <path d="M22 40 Q32 48 42 40" stroke="#0d1324" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className="ai-title">AI Budget Wizard</div>
          <div className="ai-sub">Futuristic, playful, and personalized budgeting ✨</div>
        </div>

        <div className="ai-progress">
          <div className="ai-bar"><div style={{ width: `${pct}%` }} /></div>
          <div className="ai-steps">
            <span className={step==='intro'?'active':''}>Intro</span>
            <span className={step==='collect'?'active':''}>Collect</span>
            <span className={step==='analyze'?'active':''}>Analyze</span>
            <span className={step==='recommend'?'active':''}>Recommend</span>
            <span className={step==='summary'?'active':''}>Summary</span>
          </div>
        </div>

        {/* Animated stages */}
        <div className="ai-stage">
          {step === 'intro' && (
            <div className="ai-card">
              <div className="ai-type">Hi {profile?.name || 'there'}! I’ll craft a monthly plan that balances essentials, fun, savings, and investments — with a bit of magic ✨</div>
            </div>
          )}
          {step === 'collect' && (
            <div className="ai-card">
              <div className="ai-type">Scanning your recent activity and goals… 🛰️</div>
              <div className="ai-grid">
                {Object.entries(recentTotals).map(([k,v]) => (
                  <div key={k} className="ai-chip"><span>{k}</span><span>₹{v}</span></div>
                ))}
              </div>
            </div>
          )}
          {step === 'analyze' && (
            <div className="ai-card">
              <div className="ai-type">Analyzing patterns, streaks, and overspending… 🧠</div>
              <div className="ai-orb" aria-hidden />
            </div>
          )}
          {step === 'recommend' && (
            <div className="ai-card">
              <div className="ai-type">Here’s your personalized monthly breakdown 💎</div>
              <div className="ai-recs">
                {(['Rent','Food','Transport','Self-care','Gym','Shopping','Misc'] as const).map(k => (
                  <div key={k} className="ai-rec">
                    <div className="ai-rec-icon">{k==='Food'?'🍽️':k==='Rent'?'🏠':k==='Transport'?'🚗':k==='Self-care'?'💅':k==='Gym'?'🏋️':k==='Shopping'?'🛍️':'✨'}</div>
                    <div className="ai-rec-title">{k}</div>
                    <div className="ai-rec-amt">₹{(rec as any)[k]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 'summary' && (
            <div className="ai-card">
              <div className="ai-type">Save ₹{rec.Savings} and invest ₹{rec.Invest}. Tap apply to lock this plan — earn +25 XP!</div>
              <div className="ai-actions">
                <button className="pp-btn pp-btn-primary" onClick={applyPlan}>Apply Plan</button>
                <button className="pp-btn" onClick={() => window.print()}>Share / Print</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIBudgetWizard