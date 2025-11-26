import React from 'react'
import { useAppState } from '../state/AppState'
import '../styles/pocketplan.css'
import '../styles/invest.css'

const EducationVideos: React.FC = () => {
  const { videos, markWatched } = useAppState()

  return (
    <div className="edu-shell">
      <div className="edu-card">
        <h2 className="edu-title">Financial Education Videos</h2>
        <p className="edu-sub">Short explainers to level up your money skills. Watch and mark complete to gain points.</p>

        {videos.length === 0 && (
          <div className="edu-note">No videos added yet. Use Learn Finance page to upload or seed content.</div>
        )}

        <div className="edu-grid">
          {videos.map(v => (
            <div className="edu-item" key={v.id}>
              <div className="edu-item-title">{v.title}</div>
              <div className="edu-item-sub">{v.topic}</div>
              {v.url.includes('youtube.com') || v.url.includes('youtu.be') ? (
                <a className="edu-btn" href={v.url} target="_blank" rel="noreferrer">Open on YouTube</a>
              ) : v.url.includes('embed') || v.url.endsWith('.mp4') ? (
                <iframe className="edu-frame" src={v.url} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <a className="edu-btn" href={v.url} target="_blank" rel="noreferrer">Open</a>
              )}
              <button className="edu-btn" onClick={() => markWatched(v.id)}>Mark Watched</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EducationVideos