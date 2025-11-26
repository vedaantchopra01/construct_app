import React, { useState } from 'react'
import { useAppState } from '../state/AppState'
import '../../pocketplan/styles.css'

function reply(input: string) {
  const q = input.toLowerCase()
  if (q.includes('credit card')) return 'Credit cards are useful if paid in full monthly. Keep utilization <30%.'
  if (q.includes('reduce spending')) return 'Track expenses daily, set a weekly cap, cook at home, avoid impulse buys.'
  if (q.includes('goal') || q.includes('phone')) return 'For a 4-month goal, divide price by 4 and save that amount monthly. Add 10% buffer.'
  if (q.includes('savings')) return 'Aim to save 20–30% of income. Automate transfers on payday.'
  if (q.includes('invest')) return 'Start small SIPs (₹100–₹500). Prefer index funds for beginners. Keep emergency fund separate.'
  return 'Ask me about budgeting, savings, investing, or goals. I reply in simple Hinglish 😊'
}

const Coach: React.FC = () => {
  const { notify } = useAppState()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ from: 'you' | 'coach'; text: string }[]>([
    { from: 'coach', text: 'Hi! Main tumhara finance coach hoon. Aaj ka plan?' }
  ])

  const send = () => {
    if (!input.trim()) return
    const ans = reply(input)
    setMessages(prev => [...prev, { from: 'you', text: input }, { from: 'coach', text: ans }])
    notify('Coach suggested: ' + ans)
    setInput('')
  }

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">AI Finance Coach 🤖</h2>
        <div className="pp-list" style={{ minHeight: 180 }}>
          {messages.map((m, i) => (
            <div key={i} className="pp-list-item" style={{ justifyContent: m.from === 'you' ? 'flex-end' : 'flex-start' }}>
              <div className="pp-message" style={{ background: m.from === 'you' ? 'rgba(167,139,250,0.18)' : 'rgba(157,171,188,0.15)' }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="pp-row" style={{ marginTop: 10 }}>
          <input className="pp-input" placeholder="Ask in Hinglish..." value={input} onChange={e => setInput(e.target.value)} />
          <button className="pp-btn pp-btn-primary" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Coach