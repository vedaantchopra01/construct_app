import React, { useState } from 'react'
import { useAppState } from '../state/AppState'
import '../../pocketplan/styles.css'
import '../styles/accounts.css'

const BankPayments: React.FC = () => {
  const { bankAccounts, linkBank, updateBalance, addTransaction, privacyMode, rewards, level, trustScore, totalBalance, profile, budgetPlan } = useAppState()
  const [bankName, setBankName] = useState('BNM Demo Bank')
  const [initialBalance, setInitialBalance] = useState(2000)
  const [amount, setAmount] = useState(500)
  const [desc, setDesc] = useState('Rent')
  const [selectedAccount, setSelectedAccount] = useState<string>('')

  const monthlySpending = bankAccounts.length === 0 ? 0 : Math.round(
    // sum of last 30 debit transactions would be ideal; approximate using budgetPlan or other inputs
    (budgetPlan?.essentials || 0) + (budgetPlan?.wants || 0)
  )
  const totalSavings = (budgetPlan?.savings || Math.round((profile?.income || 0) * 0.2))

  const link = () => {
    linkBank(bankName, Math.max(0, initialBalance))
  }

  const pay = () => {
    if (!selectedAccount) return alert('Select a bank account')
    updateBalance(selectedAccount, -Math.max(0, amount))
    addTransaction({ type: 'debit', amount: Math.max(0, amount), description: desc, category: 'UPI' })
    alert('Payment sent ✅')
  }

  const receive = () => {
    if (!selectedAccount) return alert('Select a bank account')
    updateBalance(selectedAccount, Math.max(0, amount))
    addTransaction({ type: 'credit', amount: Math.max(0, amount), description: 'Received: ' + desc, category: 'UPI' })
    alert('Money received ✅')
  }

  const scanAndPay = () => {
    pay()
  }

  return (
    <div className="bnm-account-shell">
      {/* Top header with avatar, level and XP */}
      <div className="bnm-acc-header">
        <div className="bnm-avatar-lg" aria-label="User avatar">
          <span>{(profile?.name || 'User').charAt(0).toUpperCase()}</span>
        </div>
        <div className="bnm-level-wrap">
          <div className="bnm-level-title">Level {Math.max(1, Math.floor((rewards || 1200) / 100))} – Money Master</div>
          <div className="bnm-xp-bar"><div style={{ width: `${Math.min(100, (rewards % 100) )}%` }} /></div>
        </div>
        <div className="bnm-score-mini">BNM Score: {trustScore * 10}</div>
      </div>

      {/* Large balance card */}
      <section className="bnm-balance-card">
        <div className="bnm-balance-header">Current Balance:</div>
        <div className="bnm-balance-amt">₹{privacyMode ? '••••' : totalBalance}</div>
        <div className="bnm-balance-sub">
          <div>
            <div className="bnm-sub-cap">Total Savings:</div>
            <div className="bnm-sub-val">₹{totalSavings}</div>
          </div>
          <div>
            <div className="bnm-sub-cap">Monthly Spending:</div>
            <div className="bnm-sub-val">₹{monthlySpending}</div>
          </div>
        </div>
      </section>

      {/* Bank management row */}
      <div className="bnm-section-row">
        <div className="bnm-section-title">Bank Management</div>
        <button className="bnm-pill" onClick={link}>+ Add Bank Account</button>
      </div>

      {/* Linked accounts card */}
      <div className="bnm-linked-card">
        <div className="bnm-linked-left">
          <div className="bnm-linked-icon">🏦</div>
          <div>
            <div className="bnm-linked-title">Linked Accounts</div>
            <div className="bnm-linked-sub">{bankAccounts.length} connected</div>
          </div>
        </div>
        <div className="bnm-linked-right">›</div>
      </div>

      {/* Accounts list with select */}
      <section className="bnm-accounts">
        <div className="bnm-list">
          {bankAccounts.map(a => (
            <div key={a.id} className="bnm-list-item">
              <div>
                <div className="bnm-bold">{a.name}</div>
                <div className="bnm-sub">Balance: {privacyMode ? '••••' : `₹${a.balance}`}</div>
              </div>
              <label className="bnm-radio">
                <input type="radio" name="acct" checked={selectedAccount === a.id} onChange={() => setSelectedAccount(a.id)} /> Use
              </label>
            </div>
          ))}
          {bankAccounts.length === 0 && <div className="bnm-message">No banks linked. Use “Add Bank Account”.</div>}
        </div>
      </section>

      {/* UPI hub */}
      <section className="bnm-upi">
        <div className="bnm-section-title">UPI Payments Hub</div>
        <div className="bnm-upi-grid">
          <button className="bnm-pill-gradient" onClick={pay}>Send Money</button>
          <button className="bnm-pill-gradient" onClick={receive}>Receive Money</button>
          <button className="bnm-pill-gradient" onClick={scanAndPay}>Scan & Pay</button>
        </div>
        <div className="bnm-qr-large" aria-label="QR code" />
      </section>

      {/* Smart insights */}
      <section className="bnm-insights">
        <div className="bnm-section-title">Smart Insights</div>
        <div className="bnm-insights-pills">
          <div className="bnm-pill-outlined">You spent extra on food this week 🍕</div>
          <div className="bnm-pill-outlined">Rent is 12% of income – stable 🏠</div>
        </div>
        <div className="bnm-pill-row">
          <button className="bnm-pill">Security Panel</button>
          <button className="bnm-pill">Daily Streak 🔥</button>
          <button className="bnm-pill">Rewards 🎁</button>
        </div>
      </section>
    </div>
  )
}

export default BankPayments