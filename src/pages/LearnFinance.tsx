import React, { useState } from 'react'
import { useAppState } from '../state/AppState'
import '../styles/pocketplan.css'

const topics = ['Credit cards','Savings','Investments','UPI fraud awareness','Loans','Emergency funds']

const LearnFinance: React.FC = () => {
  const { videos, addVideo, markWatched, rewards } = useAppState()
  const [adminTitle, setAdminTitle] = useState('')
  const [adminTopic, setAdminTopic] = useState(topics[0])
  const [adminUrl, setAdminUrl] = useState('')

  const upload = () => {
    if (!adminTitle || !adminUrl) return alert('Please add title and URL')
    addVideo({ title: adminTitle, url: adminUrl, topic: adminTopic })
    setAdminTitle(''); setAdminUrl('')
    alert('Video uploaded!')
  }

  return (
    <div className="pp-container">
      <div className="pp-card pp-card-slide pp-gradient-border">
        <h2 className="pp-heading">Learn Finance 🎬</h2>
        <p className="pp-subtitle">Short 30–60 sec videos • Earn badges & FinGen Coins</p>
        <div className="pp-row" style={{ marginTop: 8 }}>
          <div className="pp-col">
            <label className="pp-label">Admin Upload</label>
            <input className="pp-input" placeholder="Video title" value={adminTitle} onChange={e => setAdminTitle(e.target.value)} />
            <select className="pp-input" value={adminTopic} onChange={e => setAdminTopic(e.target.value)}>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input className="pp-input" placeholder="Video URL (mp4/embed)" value={adminUrl} onChange={e => setAdminUrl(e.target.value)} />
            <button className="pp-btn pp-btn-primary" onClick={upload}>Upload</button>
          </div>
          <div className="pp-col">
            <div className="pp-summary-card"><h4>Your Coins</h4><div className="pp-summary-amount">{rewards}</div></div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {videos.length === 0 && <div className="pp-message">No videos yet. Add via Admin Upload above.</div>}
          <div className="pp-list">
            {videos.map(v => (
              <div key={v.id} className="pp-list-item">
                <div>
                  <div className="pp-bold">{v.title}</div>
                  <div className="pp-subtitle">{v.topic}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={v.url} target="_blank" rel="noreferrer" className="pp-btn">Watch</a>
                  <button className="pp-btn pp-btn-primary" onClick={() => markWatched(v.id)}>Mark Watched</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearnFinance