import React, { useState } from 'react'
import '../../pocketplan/styles.css'

const BillSplitter: React.FC = () => {
  const [friends, setFriends] = useState<string>('Aman, Priya, Rohit')
  const [total, setTotal] = useState<number>(900)

  const names = friends.split(',').map(s => s.trim()).filter(Boolean)
  const each = names.length > 0 ? Math.ceil(total / names.length) : 0

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">Bill Splitter ✂️</h2>
        <div className="pp-row" style={{ marginTop: 8 }}>
          <div className="pp-col"><label className="pp-label">Friends (comma separated)</label><input className="pp-input" value={friends} onChange={e => setFriends(e.target.value)} /></div>
          <div className="pp-col"><label className="pp-label">Total Bill</label><input className="pp-number" type="number" value={total} onChange={e => setTotal(Number(e.target.value))} /></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="pp-list">
            {names.map(n => (
              <div key={n} className="pp-list-item">
                <div>
                  <div className="pp-bold">{n}</div>
                  <div className="pp-subtitle">Owes: ₹{each}</div>
                </div>
                <button className="pp-btn">Remind</button>
              </div>
            ))}
            {names.length === 0 && <div className="pp-message">Add friends above to split the bill.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillSplitter