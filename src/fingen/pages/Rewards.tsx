import React from 'react'
import { useAppState } from '../state/AppState'
import '../../pocketplan/styles.css'

const Rewards: React.FC = () => {
  const { rewards, level, addRewards } = useAppState()

  const redeem = (points: number, label: string) => {
    if (rewards < points) return alert('Not enough coins')
    addRewards(-points)
    alert(`Redeemed: ${label} 🎁`)
  }

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">Rewards & Badges 🎖️</h2>
        <div className="pp-summary-grid" style={{ marginTop: 8 }}>
          <div className="pp-summary-card"><h4>Your Coins</h4><div className="pp-summary-amount">{rewards}</div></div>
          <div className="pp-summary-card"><h4>Level</h4><div className="pp-summary-amount">{level}</div></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <h3 className="pp-heading" style={{ fontSize: 20 }}>Redeem</h3>
          <div className="pp-list">
            <div className="pp-list-item"><div><div className="pp-bold">Online voucher</div><div className="pp-subtitle">-300 coins</div></div><button className="pp-btn pp-btn-primary" onClick={() => redeem(300, 'Voucher')}>Redeem</button></div>
            <div className="pp-list-item"><div><div className="pp-bold">Premium content access</div><div className="pp-subtitle">-150 coins</div></div><button className="pp-btn pp-btn-primary" onClick={() => redeem(150, 'Premium content')}>Redeem</button></div>
            <div className="pp-list-item"><div><div className="pp-bold">Finance consultation</div><div className="pp-subtitle">-500 coins</div></div><button className="pp-btn pp-btn-primary" onClick={() => redeem(500, 'Consultation')}>Redeem</button></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rewards