import React, { useState } from 'react'
import { useAppState } from '../state/AppState'
import '../../pocketplan/styles.css'

const SpendTracker: React.FC = () => {
  const { addTransaction, notify } = useAppState()
  const [amount, setAmount] = useState(100)
  const [desc, setDesc] = useState('Swiggy')

  const add = () => {
    addTransaction({ type: 'debit', amount: Math.max(0, amount), description: desc, category: 'Food' })
    notify('Daily spend added. Budget adjusted.')
    setAmount(100); setDesc('')
  }

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">Daily Spend Tracker 🧾</h2>
        <p className="pp-subtitle">Enter daily expenses. AI nudges and adjusts budget suggestions.</p>
        <div className="pp-row" style={{ marginTop: 8 }}>
          <div className="pp-col"><label className="pp-label">Amount</label><input className="pp-number" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} /></div>
          <div className="pp-col"><label className="pp-label">Description</label><input className="pp-input" value={desc} onChange={e => setDesc(e.target.value)} /></div>
          <div className="pp-col" style={{ alignSelf: 'flex-end' }}><button className="pp-btn pp-btn-primary" onClick={add}>Add</button></div>
        </div>
      </div>
    </div>
  )
}

export default SpendTracker