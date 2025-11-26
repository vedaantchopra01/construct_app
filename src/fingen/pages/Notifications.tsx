import React from 'react'
import { useAppState } from '../state/AppState'
import '../../pocketplan/styles.css'

const Notifications: React.FC = () => {
  const { notifications } = useAppState()
  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">Notifications 🔔</h2>
        <div className="pp-list" style={{ marginTop: 8 }}>
          {notifications.map(n => (
            <div key={n.id} className="pp-list-item">
              <div>
                <div className="pp-bold">{new Date(n.createdAt).toLocaleString()}</div>
                <div className="pp-subtitle">{n.message}</div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && <div className="pp-message">No notifications yet.</div>}
        </div>
      </div>
    </div>
  )
}

export default Notifications