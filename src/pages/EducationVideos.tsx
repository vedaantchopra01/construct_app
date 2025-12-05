import React, { useEffect, useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import '../styles/pocketplan.css'
import '../styles/invest.css'
import '../styles/education.css'

type Lang = 'English' | 'Hindi' | 'Bengali' | 'Tamil' | 'Telugu' | 'Marathi' | 'Gujarati' | 'Kannada' | 'Malayalam' | 'Punjabi' | 'Urdu' | 'Spanish'

function ytEmbed(url: string) {
  // Convert common YouTube URLs to embeddable format
  try {
    if (url.includes('youtube.com/watch')) {
      const u = new URL(url)
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : url
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${id}`
    }
  } catch {}
  return url
}

function replySimple(q: string): string {
  const s = q.toLowerCase()
  if (s.includes('credit')) return 'Keep utilization under 30%, pay full bill monthly, avoid minimum due.'
  if (s.includes('saving') || s.includes('save')) return 'Aim to save 20–30% of income. Automate transfers on payday.'
  if (s.includes('invest')) return 'Start with index funds or simple SIPs. Diversify and stay long term.'
  if (s.includes('budget')) return 'Use 50/30/20 as a start: 50% essentials, 30% wants, 20% savings.'
  if (s.includes('loan')) return 'Compare APR, avoid long tenures. Keep EMI ≤ 40% of income.'
  if (s.includes('tax')) return 'Use tax‑saving instruments (ELSS, PPF). Keep records and plan quarterly.'
  return 'Ask me about budgeting, savings, investing, credit cards, or loans.'
}

function translate(text: string, lang: Lang): string {
  // Lightweight canned translations for clarity; falls back to English
  const map: Record<Lang, (t: string) => string> = {
    English: (t) => t,
    Hindi: (t) => t
      .replace('Aim to save', 'Bachत बचत करें')
      .replace('Start with index funds or simple SIPs', 'Index funds या सरल SIP से शुरू करें')
      .replace('Use 50/30/20 as a start', '50/30/20 नियम अपनाएं')
      .replace('Compare APR, avoid long tenures', 'APR तुलना करें, लंबी अवधि से बचें')
      .replace('Ask me about budgeting, savings, investing, credit cards, or loans.', 'Budgeting, बचत, निवेश, क्रेडिट कार्ड या loans पूछें.'),
    Bengali: (t) => t
      .replace('Aim to save', 'সঞ্চয় করার লক্ষ্য রাখুন')
      .replace('Start with index funds or simple SIPs', 'ইনডেক্স ফান্ড বা সহজ SIP দিয়ে শুরু করুন')
      .replace('Use 50/30/20 as a start', '৫০/৩০/২০ নিয়ম ব্যবহার করুন'),
    Tamil: (t) => t
      .replace('Aim to save', 'வருமானத்தின் 20–30% சேமிக்க முயற்சி செய்யவும்')
      .replace('Start with index funds or simple SIPs', 'இன்டெக்ஸ் ஃபண்ட் அல்லது எளிய SIP தொடங்கவும்')
      .replace('Use 50/30/20 as a start', '50/30/20 விதியை தொடங்குங்கள்'),
    Telugu: (t) => t
      .replace('Aim to save', 'ఆదాయం 20–30% సేవ్ చేయండి')
      .replace('Start with index funds or simple SIPs', 'ఇండెక్స్ ఫండ్లు లేదా సింపుల్ SIPతో ప్రారంభించండి')
      .replace('Use 50/30/20 as a start', '50/30/20 నియమాన్ని ఉపయోగించండి'),
    Marathi: (t) => t
      .replace('Aim to save', 'उत्पन्नाच्या 20–30% बचत करा')
      .replace('Start with index funds or simple SIPs', 'इंडेक्स फंड किंवा साध्या SIP पासून सुरू करा')
      .replace('Use 50/30/20 as a start', '50/30/20 नियम वापरा'),
    Gujarati: (t) => t
      .replace('Aim to save', 'આવકના 20–30% બચત કરો')
      .replace('Start with index funds or simple SIPs', 'ઈન્ડેક્સ ફંડ અથવા સરળ SIP થી શરૂ કરો')
      .replace('Use 50/30/20 as a start', '50/30/20 નિયમ અપનાવો'),
    Kannada: (t) => t
      .replace('Aim to save', 'ಆದಾಯದ 20–30% ಉಳಿಸಿರಿ')
      .replace('Start with index funds or simple SIPs', 'ಇಂಡೆಕ್ಸ್ ಫಂಡ್ ಅಥವಾ ಸರಳ SIP ಪ್ರಾರಂಭಿಸಿ')
      .replace('Use 50/30/20 as a start', '50/30/20 ನಿಯಮ ಬಳಸಿ'),
    Malayalam: (t) => t
      .replace('Aim to save', 'വരുമാനത്തിന്റെ 20–30% സേവ് ചെയ്യുക')
      .replace('Start with index funds or simple SIPs', 'ഇൻഡക്സ് ഫണ്ടുകൾ അല്ലെങ്കിൽ ലളിതമായ SIP ആരംഭിക്കുക')
      .replace('Use 50/30/20 as a start', '50/30/20 നിയമം ഉപയോഗിക്കുക'),
    Punjabi: (t) => t
      .replace('Aim to save', 'ਆਮਦਨ ਦਾ 20–30% ਬਚਤ ਕਰੋ')
      .replace('Start with index funds or simple SIPs', 'ਇੰਡੈਕਸ ਫੰਡ ਜਾਂ ਸੌਖੀ SIP ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ'),
    Urdu: (t) => t
      .replace('Aim to save', 'آمدنی کا 20–30% بچت کریں')
      .replace('Start with index funds or simple SIPs', 'انڈیکس فنڈز یا سادہ SIP سے شروع کریں')
      .replace('Use 50/30/20 as a start', '50/30/20 اصول اپنائیں'),
    Spanish: (t) => t
      .replace('Aim to save', 'Apunta a ahorrar 20–30% de tus ingresos')
      .replace('Start with index funds or simple SIPs', 'Empieza con fondos indexados o SIPs simples')
      .replace('Use 50/30/20 as a start', 'Usa la regla 50/30/20')
  }
  try { return (map[lang] || map.English)(text) } catch { return text }
}

const langs: Lang[] = ['English','Hindi','Bengali','Tamil','Telugu','Marathi','Gujarati','Kannada','Malayalam','Punjabi','Urdu','Spanish']

const categories = ['Beginner','Investing','Banking','Credit','Crypto','Taxes','Live Sessions'] as const

const curated: { title: string; topic: string; url: string }[] = [
  { title: 'Budgeting Basics in 60s', topic: 'Beginner', url: 'https://www.youtube.com/watch?v=EFH2aK6YwXo' },
  { title: '50/30/20 Rule Explained', topic: 'Beginner', url: 'https://www.youtube.com/watch?v=3gZrGuO2QgU' },
  { title: 'Index Funds for Beginners', topic: 'Investing', url: 'https://www.youtube.com/watch?v=IrbxVxJc1t4' },
  { title: 'What is SIP?', topic: 'Investing', url: 'https://www.youtube.com/watch?v=quWfZK4Vf4U' },
  { title: 'Credit Card Dos & Don’ts', topic: 'Credit', url: 'https://www.youtube.com/watch?v=UQ1XvTQ1KjM' },
  { title: 'Detecting UPI Fraud', topic: 'Banking', url: 'https://www.youtube.com/watch?v=9gCzQ8WnM1Q' },
  { title: 'Taxes: ELSS vs PPF', topic: 'Taxes', url: 'https://www.youtube.com/watch?v=Jf2W3e6u3fE' },
  { title: 'Crypto Risks 101', topic: 'Crypto', url: 'https://www.youtube.com/watch?v=2vW3ZkWkQZQ' }
]

const EducationVideos: React.FC = () => {
  const { videos, addVideo, markWatched, watched } = useAppState()
  const [activeCat, setActiveCat] = useState<typeof categories[number]>('Beginner')
  const [lang, setLang] = useState<Lang>('English')
  const [query, setQuery] = useState('')

  // Seed curated content once if empty
  useEffect(() => {
    if (videos.length === 0) {
      curated.forEach(v => addVideo({ title: v.title, url: ytEmbed(v.url), topic: v.topic }))
    }
  }, [videos.length])

  const progress = useMemo(() => {
    const total = videos.length
    const done = videos.filter(v => watched[v.id]).length
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [videos, watched])

  const filtered = useMemo(() => {
    return videos.filter(v => (
      (activeCat ? v.topic === activeCat : true) &&
      (query ? v.title.toLowerCase().includes(query.toLowerCase()) : true)
    ))
  }, [videos, activeCat, query])

  // Local AI chat agent
  const [chatOpen, setChatOpen] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: translate('Hi! Choose your language and ask finance doubts.', lang) }
  ])

  const send = () => {
    if (!input.trim()) return
    const userText = input.trim()
    const aiText = translate(replySimple(userText), lang)
    setMessages(m => [...m, { role: 'user', text: userText }, { role: 'ai', text: aiText }])
    setInput('')
  }

  return (
    <div className="edu-shell">
      <div className="edu-hero">
        <div className="edu-hero-left">
          <h2 className="edu-hero-title">knowledge capsules</h2>
          <div className="edu-progress"><div style={{ width: `${progress.pct}%` }} /></div>
          <div className="edu-progress-label">{progress.done}/{progress.total} completed</div>
        </div>
        <div className="edu-hero-right">
          <div className="edu-filter-row">
            {categories.map(c => (
              <button key={c} className={`edu-pill ${c === activeCat ? 'active' : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
            ))}
          </div>
          <input className="edu-search" placeholder="Search videos" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="edu-grid">
        {filtered.map(v => (
          <div className="edu-item" key={v.id}>
            <div className="edu-item-title">{v.title}</div>
            <div className="edu-item-sub">{v.topic}</div>
            <iframe className="edu-frame" src={ytEmbed(v.url)} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            <div className="edu-actions">
              <button className="edu-btn" onClick={() => markWatched(v.id)}>{watched[v.id] ? 'Watched ✅' : 'Mark Watched'}</button>
              <a className="edu-btn" href={v.url} target="_blank" rel="noreferrer">Open on YouTube</a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="edu-empty">No videos found. Try another category or search.</div>
        )}
      </div>

      <div className="edu-chat">
        <div className="edu-chat-header">
          <div className="edu-chat-title">AI Mentor</div>
          <div className="edu-chat-lang">
            <label>Language</label>
            <select value={lang} onChange={e => setLang(e.target.value as Lang)}>
              {langs.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button className="edu-chat-toggle" onClick={() => setChatOpen(o => !o)}>{chatOpen ? 'Hide' : 'Show'}</button>
        </div>
        {chatOpen && (
          <div className="edu-chat-body">
            <div className="edu-chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`edu-msg ${m.role}`}>{m.text}</div>
              ))}
            </div>
            <div className="edu-chat-input">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder={translate('Type your question…', lang)} />
              <button onClick={send}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EducationVideos