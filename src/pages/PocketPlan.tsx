import React, { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import '../styles/pocketplan.css'

type Allocation = {
  savings: number
  food: number
  selfCare: number
  gym: number
  others: number
  totalExpenses: number
  balance: number
}

const COLORS = ['#A78BFA', '#2DD4BF', '#F472B6', '#60A5FA', '#F59E0B']

function formatCurrency(n: number) {
  return `₹${n.toFixed(0)}`
}

function computePlan(
  income: number,
  selfCareLevel: number,
  eatsOutTimes: number,
  gymEnabled: boolean,
  gymSpend: number,
  otherInput: number
): Allocation {
  const savings = Math.round(income * 0.20)
  const spendable = Math.max(0, income - savings)



  let foodWeight = 25
  let selfCareWeight = 20
  let gymWeight = gymEnabled ? 15 : 5
  let othersWeight = 20



  const foodBoost = Math.min(40, 10 + (eatsOutTimes / 30) * 30)
  foodWeight = foodBoost


  const selfCareBoost = Math.min(35, 8 + (selfCareLevel / 100) * 27)
  selfCareWeight = selfCareBoost


  const minGymAmount = gymEnabled ? Math.min(spendable * 0.25, gymSpend) : 0


  const minOtherAmount = Math.max(0, otherInput || 0)


  const remainingSpendable = Math.max(0, spendable - minGymAmount - minOtherAmount)
  const weightSum = foodWeight + selfCareWeight + (gymEnabled ? gymWeight : 0) + othersWeight
  const foodAmount = Math.round((foodWeight / weightSum) * remainingSpendable)
  const selfCareAmount = Math.round((selfCareWeight / weightSum) * remainingSpendable)
  const gymAmount = Math.round((gymEnabled ? gymWeight / weightSum : 0) * remainingSpendable) + minGymAmount
  const othersAmount = Math.round((othersWeight / weightSum) * remainingSpendable) + minOtherAmount

  const totalExpenses = foodAmount + selfCareAmount + gymAmount + othersAmount
  const balance = Math.max(0, income - savings - totalExpenses)

  return {
    savings,
    food: foodAmount,
    selfCare: selfCareAmount,
    gym: gymAmount,
    others: othersAmount,
    totalExpenses,
    balance
  }
}

const Splash: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="pp-splash pp-card pp-gradient-border pp-card-slide">
    <h1 className="pp-heading">PocketPlan – Your Smart Gen‑Z Money Buddy 💫</h1>
    <p className="pp-subtitle">Dark, neon vibes. Smarter budgets. Let’s plan your month 👇</p>
    <div style={{ marginTop: 24 }}>
      <button className="pp-btn pp-btn-primary" onClick={onStart}>
        Start Planning ✨
      </button>
    </div>
  </div>
)

const Loader: React.FC = () => (
  <div className="pp-card pp-card-slide pp-gradient-border">
    <div className="pp-loader">
      <span>AI thinking…</span>
      <div className="pp-dot" />
      <div className="pp-dot" />
      <div className="pp-dot" />
    </div>
  </div>
)

const Results: React.FC<{ income: number; alloc: Allocation; onRestart: () => void }> = ({ income, alloc, onRestart }) => {
  const pieData = [
    { name: 'Food', value: alloc.food },
    { name: 'Self Care', value: alloc.selfCare },
    { name: 'Gym', value: alloc.gym },
    { name: 'Others', value: alloc.others },
    { name: 'Savings', value: alloc.savings },
  ]

  const message = alloc.balance >= income * 0.20
    ? 'You saved well this month! 🔥'
    : alloc.balance > 0
      ? 'Try to save more next month.'
      : 'You have overspent!'

  const weekly = {
    income: Math.round(income / 4.33),
    expenses: Math.round(alloc.totalExpenses / 4.33),
    savings: Math.round(alloc.savings / 4.33),
    balance: Math.round(alloc.balance / 4.33)
  }

  const downloadReport = () => {
    const report = {
      pocketMoney: income,
      savings: alloc.savings,
      totalExpenses: alloc.totalExpenses,
      balance: alloc.balance,
      categories: {
        food: alloc.food,
        selfCare: alloc.selfCare,
        gym: alloc.gym,
        others: alloc.others
      },
      weekly
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pocketplan-report.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pp-card pp-card-slide pp-gradient-border">
      <h2 className="pp-heading">Your Monthly Plan 🧠</h2>
      <div className="pp-summary-grid" style={{ marginTop: 12 }}>
        <div className="pp-summary-card"><h4>Pocket Money</h4><div className="pp-summary-amount">{formatCurrency(income)}</div></div>
        <div className="pp-summary-card"><h4>Total Expenses</h4><div className="pp-summary-amount">{formatCurrency(alloc.totalExpenses)}</div></div>
        <div className="pp-summary-card"><h4>Savings (20%)</h4><div className="pp-summary-amount">{formatCurrency(alloc.savings)}</div></div>
        <div className="pp-summary-card"><h4>Balance</h4><div className="pp-summary-amount">{formatCurrency(alloc.balance)}</div></div>
      </div>

      <div style={{ height: 280, marginTop: 12 }} className="pp-card">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} isAnimationActive>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#0c1321', border: '1px solid rgba(157,171,188,0.25)', borderRadius: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="pp-breakdown">
        <div className="pp-breakdown-item"><span>🍕 Food</span><span>{formatCurrency(alloc.food)}</span></div>
        <div className="pp-breakdown-item"><span>✨ Self Care</span><span>{formatCurrency(alloc.selfCare)}</span></div>
        <div className="pp-breakdown-item"><span>🏋️ Gym</span><span>{formatCurrency(alloc.gym)}</span></div>
        <div className="pp-breakdown-item"><span>🎁 Others</span><span>{formatCurrency(alloc.others)}</span></div>
      </div>

      <div className="pp-message">{message}</div>

      <div className="pp-footer-actions">
        <button className="pp-btn pp-btn-primary" onClick={downloadReport}>Download Report ⬇️</button>
        <button className="pp-btn pp-btn-ghost" onClick={onRestart}>Restart ↻</button>
      </div>
    </div>
  )
}

const PocketPlan: React.FC = () => {
  const [step, setStep] = useState<number>(0)
  const [income, setIncome] = useState<number>(0)
  const [selfCare, setSelfCare] = useState<number>(50)
  const [gymYes, setGymYes] = useState<boolean>(false)
  const [gymSpend, setGymSpend] = useState<number>(0)
  const [eatOuts, setEatOuts] = useState<number>(4)
  const [others, setOthers] = useState<number>(0)
  const [processing, setProcessing] = useState<boolean>(false)

  const alloc = useMemo(() => computePlan(income, selfCare, eatOuts, gymYes, gymSpend, others), [income, selfCare, eatOuts, gymYes, gymSpend, others])

  const start = () => setStep(1)
  const next = () => setStep((s) => s + 1)
  const prev = () => setStep((s) => Math.max(0, s - 1))

  const runAI = () => {
    setProcessing(true)

    setTimeout(() => { setProcessing(false); setStep(7) }, 1200)
  }

  const restart = () => {
    setStep(0)
    setIncome(0)
    setSelfCare(50)
    setGymYes(false)
    setGymSpend(0)
    setEatOuts(4)
    setOthers(0)
    setProcessing(false)
  }

  return (
    <div className="pp-container">
      {step === 0 && <Splash onStart={start} />}

      {step === 1 && (
        <div className="pp-card pp-card-slide pp-gradient-border">
          <h2 className="pp-heading">What’s your monthly pocket money? 💸</h2>
          <p className="pp-subtitle">Enter amount to begin your plan.</p>
          <label className="pp-label">Amount</label>
          <input className="pp-number" type="number" value={income || ''} onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))} placeholder="e.g., 10000" />
          <div style={{ marginTop: 14 }} className="pp-row">
            <button className="pp-btn pp-btn-ghost" onClick={prev} disabled={true}>Back</button>
            <button className="pp-btn pp-btn-primary" onClick={next} disabled={income <= 0}>Next →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="pp-card pp-card-slide pp-gradient-border">
          <h2 className="pp-heading">How much do you love self‑care? ✨</h2>
          <p className="pp-subtitle">Slide to choose your vibe — Minimal → Treat Yourself</p>
          <label className="pp-label">Self‑care level: {selfCare}%</label>
          <input className="pp-range" type="range" min={0} max={100} value={selfCare} onChange={(e) => setSelfCare(Number(e.target.value))} />
          <div style={{ marginTop: 14 }} className="pp-row">
            <button className="pp-btn pp-btn-ghost" onClick={prev}>Back</button>
            <button className="pp-btn pp-btn-primary" onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="pp-card pp-card-slide pp-gradient-border">
          <h2 className="pp-heading">Do you go to the gym or play a sport? 🏋️⚽</h2>
          <div className="pp-toggle" style={{ marginTop: 10 }}>
            <button className={gymYes ? '' : 'active'} onClick={() => setGymYes(false)}>No</button>
            <button className={gymYes ? 'active' : ''} onClick={() => setGymYes(true)}>Yes</button>
          </div>
          <div style={{ marginTop: 14 }} className="pp-row">
            <button className="pp-btn pp-btn-ghost" onClick={prev}>Back</button>
            <button className="pp-btn pp-btn-primary" onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {step === 4 && gymYes && (
        <div className="pp-card pp-card-slide pp-gradient-border">
          <h2 className="pp-heading">How much do you spend monthly on it?</h2>
          <label className="pp-label">Gym / Sports spend</label>
          <input className="pp-number" type="number" value={gymSpend || ''} onChange={(e) => setGymSpend(Math.max(0, Number(e.target.value)))} placeholder="e.g., 1000" />
          <div style={{ marginTop: 14 }} className="pp-row">
            <button className="pp-btn pp-btn-ghost" onClick={prev}>Back</button>
            <button className="pp-btn pp-btn-primary" onClick={next} disabled={gymSpend <= 0}>Next →</button>
          </div>
        </div>
      )}

      {step === 4 && !gymYes && (
        <div className="pp-card pp-card-slide pp-gradient-border">
          <h2 className="pp-heading">How many times do you eat out per month? 🍕🍔</h2>
          <label className="pp-label">Eat‑outs: {eatOuts} times</label>
          <input className="pp-range" type="range" min={0} max={30} value={eatOuts} onChange={(e) => setEatOuts(Number(e.target.value))} />
          <div style={{ marginTop: 14 }} className="pp-row">
            <button className="pp-btn pp-btn-ghost" onClick={prev}>Back</button>
            <button className="pp-btn pp-btn-primary" onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {step === 5 && gymYes && (
        <div className="pp-card pp-card-slide pp-gradient-border">
          <h2 className="pp-heading">How many times do you eat out per month? 🍕🍔</h2>
          <label className="pp-label">Eat‑outs: {eatOuts} times</label>
          <input className="pp-range" type="range" min={0} max={30} value={eatOuts} onChange={(e) => setEatOuts(Number(e.target.value))} />
          <div style={{ marginTop: 14 }} className="pp-row">
            <button className="pp-btn pp-btn-ghost" onClick={prev}>Back</button>
            <button className="pp-btn pp-btn-primary" onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="pp-card pp-card-slide pp-gradient-border">
          <h2 className="pp-heading">Any other monthly expenses? 🎁✈️</h2>
          <p className="pp-subtitle">Subscriptions, gifts, travel — add a rough total.</p>
          <label className="pp-label">Other expenses</label>
          <input className="pp-number" type="number" value={others || ''} onChange={(e) => setOthers(Math.max(0, Number(e.target.value)))} placeholder="e.g., 500" />
          <div style={{ marginTop: 14 }} className="pp-row">
            <button className="pp-btn pp-btn-ghost" onClick={prev}>Back</button>
            <button className="pp-btn pp-btn-primary" onClick={runAI} disabled={income <= 0}>Generate Plan ⚡</button>
          </div>
        </div>
      )}

      {processing && <Loader />}

      {step === 7 && <Results income={income} alloc={alloc} onRestart={restart} />}
    </div>
  )
}

export default PocketPlan