import React from 'react'
import { useAppState } from '../state/AppState'
import '../styles/pocketplan.css'
import '../styles/community.css'

type CommunityItem = {
  key: string
  title: string
  desc: string
  rule: string
  targetDays: number
}

const featuredCommunities: CommunityItem[] = [
  {
    key: 'no-zomato-week',
    title: 'No Zomato Week',
    desc: 'Skip food delivery for 7 days. Cook at home or eat out local.',
    rule: 'No food delivery apps',
    targetDays: 7,
  },
  {
    key: 'daily-100-limit',
    title: '₹100 Daily Spending Limit',
    desc: 'Cap discretionary spends at ₹100 per day for one week.',
    rule: '≤ ₹100 per day (discretionary)',
    targetDays: 7,
  },
  {
    key: 'cash-only-weekend',
    title: 'Cash‑Only Weekend',
    desc: 'Use only cash for transactions on Saturday and Sunday.',
    rule: 'Cash only (Sat–Sun)',
    targetDays: 2,
  },
  {
    key: 'no-sugar-drinks',
    title: 'No Sugary Drinks',
    desc: 'Avoid sugary beverages for a week. Hydrate smarter.',
    rule: 'No sodas / sweetened drinks',
    targetDays: 7,
  },
  {
    key: 'meal-prep-7',
    title: '7‑Day Meal Prep',
    desc: 'Prep meals ahead and avoid impulse takeouts.',
    rule: 'Plan & prep meals',
    targetDays: 7,
  },
  {
    key: 'expense-journal-21',
    title: '21‑Day Expense Journal',
    desc: 'Log daily expenses to build awareness and control.',
    rule: 'Journal expenses daily',
    targetDays: 21,
  },
]

const Community: React.FC = () => {
  const { challenges, joinChallenge, updateChallenge } = useAppState()

  const isJoined = (title: string) =>
    challenges.some(ch => ch.title === title)

  const getChallengeByTitle = (title: string) => {
    
    const matches = challenges.filter(ch => ch.title === title)
    return matches.length ? matches[matches.length - 1] : undefined
  }

  const join = (item: CommunityItem) => {
    if (!isJoined(item.title)) {
      joinChallenge({ title: item.title, target: item.targetDays, week: 1 })
    }
  }

  const markToday = (item: CommunityItem) => {
    const ch = getChallengeByTitle(item.title)
    if (!ch) return
    const step = Math.round(100 / Math.max(item.targetDays, 1))
    const next = Math.min(ch.progress + step, 100)
    updateChallenge(ch.id, next)
  }

  return (
    <div className="pp-container community-container">
      <div className="community-header">
        <div className="community-title">Communities</div>
        <div className="community-subtitle">Join groups, follow rules, and track progress together.</div>
      </div>

      <div className="community-grid">
        {featuredCommunities.map(item => {
          const joined = isJoined(item.title)
          const ch = getChallengeByTitle(item.title)
          return (
            <div key={item.key} className="community-card">
              <div className="community-card-header">
                <div className="community-card-title">{item.title}</div>
                <span className="community-tag">{item.targetDays}d</span>
              </div>
              <div className="community-card-desc">{item.desc}</div>
              <div className="community-card-rule">Rule: {item.rule}</div>
              <div className="community-card-actions">
                {!joined ? (
                  <button className="pp-btn pp-btn-primary" onClick={() => join(item)}>Join</button>
                ) : (
                  <>
                    <button className="pp-btn pp-btn-secondary" onClick={() => markToday(item)}>
                      Mark Today
                    </button>
                    <div className="community-progress">
                      <div className="community-progress-bar" style={{ width: `${ch?.progress ?? 0}%` }} />
                    </div>
                    <div className="community-progress-label">{Math.round(ch?.progress ?? 0)}%</div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="community-my">
        <div className="community-section-title">My Communities</div>
        {challenges.filter(ch => featuredCommunities.some(fc => fc.title === ch.title)).length === 0 && (
          <div className="pp-message">Join a community above to begin tracking.</div>
        )}

        {challenges
          .filter(ch => featuredCommunities.some(fc => fc.title === ch.title))
          .map(ch => {
            const fc = featuredCommunities.find(f => f.title === ch.title)!
            const step = Math.round(100 / Math.max(fc.targetDays, 1))
            return (
              <div key={ch.id} className="community-my-row">
                <div>
                  <div className="pp-bold">{ch.title}</div>
                  <div className="pp-subtitle">Goal: {fc.targetDays} days • Rule: {fc.rule}</div>
                </div>
                <div className="community-my-actions">
                  <button className="pp-btn pp-btn-secondary" onClick={() => updateChallenge(ch.id, Math.min(ch.progress + step, 100))}>Mark Today</button>
                  <div className="community-progress small">
                    <div className="community-progress-bar" style={{ width: `${ch.progress}%` }} />
                  </div>
                  <div className="community-progress-label">{Math.round(ch.progress)}%</div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Community